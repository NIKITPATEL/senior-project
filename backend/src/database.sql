CREATE DATABASE food_scanner;

CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL
);


-- This his saving the scanned information into the databse and can access it later
CREATE TABLE ScannedFoods (
    ScanID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    ScanTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    BarcodeID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES FoodProducts(ProductID)

    );



-- Create the DietaryPreferences table
CREATE TABLE DietaryPreferences (
    PreferenceID SERIAL PRIMARY KEY,
    PreferenceName VARCHAR(255) NOT NULL
);

-- Create the UserDietaryPreferences table
CREATE TABLE UserDietaryPreferences (
    UserPreferenceID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    PreferenceID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (PreferenceID) REFERENCES DietaryPreferences(PreferenceID)
);

-- Create the Allergens table
CREATE TABLE Allergens (
    AllergenID SERIAL PRIMARY KEY,
    AllergenName VARCHAR(255) NOT NULL
);

-- Create the UserAllergens table
CREATE TABLE UserAllergens (
    UserAllergenID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    AllergenID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (AllergenID) REFERENCES Allergens(AllergenID)
);

-- Create the FoodProducts table
CREATE TABLE FoodProducts (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    Ingredients TEXT
);

-- Create the UserFoodPreferences table
CREATE TABLE UserFoodPreferences (
    UserFoodPreferenceID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Allowed BOOLEAN NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES FoodProducts(ProductID)
);
