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
app.get('/user/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT dp.PreferenceName FROM DietaryPreferences dp INNER JOIN UserDietaryPreferences udp ON dp.PreferenceID = udp.PreferenceID WHERE udp.UserID = $1',
      [userId]
    );
    const preferences = result.rows.map(row => row.PreferenceName);
    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Error fetching preferences.' });
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
      const { rows } = await pool.query('SELECT PreferenceID FROM DietaryPreferences WHERE PreferenceName = $1', [preferenceName]);
      
      if (rows.length > 0) {
        console.log(rows)
        const preferenceId = rows[0].preferenceid;
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