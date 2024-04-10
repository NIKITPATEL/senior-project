const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


app.use(cors())
app.use(express.json()); // allows us to access the req.body


//ROUTES



//GET ALL


//GET

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401); // Unauthorized if token is missing
  }

  jwt.verify(token, 'i_got', (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user;
    next();
  });
};

// Route to fetch user information based on the JWT token
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the token payload

    // Fetch user information from the database based on userId
    const userInfo = await pool.query('SELECT * FROM users WHERE userid = $1', [userId]);

    if (userInfo.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract the username from the user record
    const username = userInfo.rows[0].username;
    
    res.json({ userId:userId,username: username });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.sendStatus(500); // Internal server error
  }
});

app.get('/savefood/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log({userId})

  try {
      // Query the database to fetch barcode IDs for the provided user ID
      const result = await pool.query('SELECT barcodeid FROM SCANNEDFOODS WHERE userid = $1', [userId]);

      // Extract barcode IDs from the query result
      const barcodeIds = result.rows.map(row => row.barcodeid);

      // Send the barcode IDs as a JSON response
      res.json({ barcodeIds });
  } catch (error) {
      console.error('Error retrieving barcode IDs:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user preferences
app.get('/userpreferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Prefernce user',userId)
    const result = await pool.query(
      'SELECT dp.PreferenceName FROM DietaryPreferences dp INNER JOIN UserDietaryPreferences udp ON dp.PreferenceID = udp.PreferenceID WHERE udp.UserID = $1',
      [userId]
    );
    
    const preferences = result.rows.map(row => row.preferencename);
    console.log(preferences)
    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Error fetching preferences.' });
  }
});

//Get the user allergies
app.get('/userallergies/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('User allergy',userId)
    const result = await pool.query(
      'SELECT a.AllergenName FROM Allergens a INNER JOIN UserAllergens ua ON a.AllergenID = ua.AllergenID WHERE ua.UserID = $1',
      [userId]
    );
    
    const preferences = result.rows.map(row => row.allergenname);
    console.log('Send Allergy: ',preferences)
    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Error fetching preferences.' });
  }
});

app.get('/total-nutrients/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Query the database to calculate total nutritional values for the user and current date
    const result = await pool.query('SELECT SUM(calories) AS totalCalories, SUM(protein) AS totalProtein, SUM(carbs) AS totalCarbs, SUM(fats) AS totalFats FROM nutrients WHERE UserID = $1 AND meal_date = $2', [userId, currentDate]);

    // Extract the total nutritional values from the result
    const { totalcalories, totalprotein, totalcarbs, totalfats } = result.rows[0];

    res.status(200).json({totalcalories, totalprotein, totalcarbs, totalfats });
  } catch (error) {
    console.error('Error fetching total nutrients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//a route handler for retrieving user nutrients
app.get('/user-nutrients/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve user nutrients from the database for the specified userId
    const { rows } = await pool.query('SELECT * FROM UserNutrients WHERE UserID = $1', [userId]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching user nutrients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
















//////////////////// POST METHODS ////////////////////////////////

app.post('/register',async(req,res) => {
  const {username,email,password,firstname,lastname} = req.body;
  try{
    // Hash password 
    const hashedPassword = await bcrypt.hash(password,10);

    //Storeuser in the databse
    const result = await pool.query('INSERT INTO USERS(username,email,password,firstName,lastname) VALUES ($1,$2,$3,$4,$5) RETURNING *',[username,email,hashedPassword,firstname,lastname]);

    res.json({user:result.rows[0]});

  }catch (error){
    console.log(error);
    res.status(500).json({error:'internal server error'});
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user record from the database based on the provided email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Extract hashed password from the user record
    const hashedPasswordFromDb = user.rows[0].password;

    // Compare hashed password from the database with the hashed password provided by the user
    const passwordMatch = await bcrypt.compare(password, hashedPasswordFromDb);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Authentication successful, generate JWT token and send it to the client
    const userId = user.rows[0].userid; // Assuming user ID is stored in 'userid' column
    const token = jwt.sign({ userId: userId }, 'i_got', { noTimestamp: true, expiresIn: '1h' });

    // Fetch the user record from the database based on userId
    const userInfo = await pool.query('SELECT * FROM users WHERE userid = $1', [userId]);

    if (userInfo.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract the username from the user record
    const username = userInfo.rows[0].username;

    console.log('Username:', username);

    res.json({ login: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/save_scanned', async (req, res) => {
  let { userId, productId, barcodeId } = req.body;
  // Convert productId and barcodeId to integers
  productId = parseInt(productId);
  barcodeId = parseInt(barcodeId);

  try {
    // First check if the Poduct or the barcode scanned already exists
    const existingProduct = await pool.query(
      'SELECT * FROM SCANNEDFOODS WHERE BarcodeId = $1',[barcodeId]
    );

    if(existingProduct.rows.length > 0){
      console.log('error sent')
      return res.status(400).json({success:false,message:'Product already saved'});
    }

      //if product doesn't exists
      // Here, you'll need to execute an INSERT query to insert the scanned data into your table.
      const result = await pool.query(
          'INSERT INTO SCANNEDFOODS (UserID, ProductID, ScanTime, BarcodeID) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *',
          [userId, productId, barcodeId]
      );

      console.log('Data inserted successfully:', result.rows[0]);

      // Send a JSON response indicating success
      res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
      console.error('Error inserting data:', error);
      // Send an error response
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.post('/user/preferences', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    for (const preferenceName of preferences) {
      
      // Lookup the PreferenceID for the given preferenceName
      const { rows:dietaryRows } = await pool.query('SELECT PreferenceID FROM DietaryPreferences WHERE PreferenceName = $1', [preferenceName]);
      
      if (dietaryRows.length > 0) {
        console.log(dietaryRows)
        const preferenceId = dietaryRows[0].preferenceid;
        console.log(preferenceId)
        // Insert the UserDietaryPreferences
        await pool.query('INSERT INTO UserDietaryPreferences (UserID, PreferenceID) VALUES ($1, $2)', [userId, preferenceId]);
      }
    }
    res.status(200).json({ message: 'Preferences saved successfully.' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Error saving preferences.' });
  }
});

app.post('/user/allergies',async(req,res)=> {

  try{
    const{userId,allergies} = req.body;
    for(const allergyName of allergies){
      // Check if the user has allready the allergy saved
       const {rows} = await pool.query('SELECT * FROM UserAllergens WHERE  UserId = $1 and AllergenID = (SELECT AllergenID FROM Allergens WHERE AllergenName = $2)',[userId,allergyName]);
      if(rows.length === 0) {
        // If the user doesn't have the allergy then insert it
        const {  rows: allergensRows} = await pool.query('SELECT * FROM Allergens WHERE AllergenName =$1',[allergyName]);
        if(allergensRows.length > 0){
          const allergenId = allergensRows[0].allergenid;
          // INsert into Userallergens
          await pool.query('INSERT INTO UserAllergens (UserID,AllergenID) VALUES ($1,$2)',[userId,allergenId]);

        }

    }

  }
  res.status(200).json({message:'Allergies saved successfully'});
    

  }catch (error){
    console.error('Error saving allergies:', error);
    res.status(500).json({ message: 'Error saving allergies.' });
  }
})

app.post('add-meal',async (req,res) => {
  try{
    const {userId,calories,protein,carbs,fats} = req.body;

    //Inser the Query 
    const insertQuery = await pool.query('INSERT INTO nutrients (UserID, calories, protein, carbs, fats, meal_date)VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)',[[userId, calories, protein, carbs, fats]]);
    res.status(200).json({message:'Meal added successfully'});

  }catch (error) {
    console.error('Error adding meal: ',error);
    res.status(500).json({message:'Internal server error'});
  }
})

// Add a route handler for adding user nutrients
app.post('/user-nutrients', async (req, res) => {
  try {
    const { userId, nutrient_name, nutrient_min, nutrient_max } = req.body;

    // Check if the nutrient already exists for the user
    const existingNutrient = await pool.query('SELECT * FROM UserNutrients WHERE UserID = $1 AND nutrient_name = $2', [userId, nutrient_name]);

    if (existingNutrient.rows.length > 0) {
      // If the nutrient exists, update its min and max values
      await pool.query('UPDATE UserNutrients SET nutrient_min = $1, nutrient_max = $2 WHERE UserID = $3 AND nutrient_name = $4', [nutrient_min, nutrient_max, userId, nutrient_name]);
      res.status(200).json({ message: 'User nutrient updated successfully' });
    } else {
      // If the nutrient does not exist, insert a new entry
      await pool.query('INSERT INTO UserNutrients (UserID, nutrient_name, nutrient_min, nutrient_max) VALUES ($1, $2, $3, $4)', [userId, nutrient_name, nutrient_min, nutrient_max]);
      res.status(201).json({ message: 'User nutrient added successfully' });
    }
  } catch (error) {
    console.error('Error adding/updating user nutrient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add-meal', async (req, res) => {
  const { userId, calories, protein, carbs, fats, sugar } = req.body;

  try {
    // Execute the INSERT query to add the meal
    const queryText = 'INSERT INTO nutrients (UserID, calories, protein, carbs, fats, sugar) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [userId, calories, protein, carbs, fats, sugar];
    await pool.query(queryText, values);

    // Send response indicating success
    res.status(200).send('Meal added successfully');
  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error adding meal:', error);
    res.status(500).send('Error adding meal');
  }
});











//UPDATE



// Test route to check database connection
app.get("/test-db-connection", async (req, res) => {
  try {
    // Execute a simple query to check if the database connection works
    const result = await pool.query("SELECT 1");
    
    res.status(200).json({ message: "Database connection successful" });
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});