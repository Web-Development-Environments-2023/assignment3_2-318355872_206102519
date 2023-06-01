CREATE TABLE IF NOT EXISTS familyrecipes (
   recipe_id INT,
   username VARCHAR(255),
   title VARCHAR(255),
   about TEXT,
   readyInMinutes INT,
   image VARCHAR(255),
   servings INT,
   vegan TINYINT(1),
   vegetarian TINYINT(1),
   glutenFree TINYINT(1),
   extendedIngredients TEXT,
   instructions TEXT,
    PRIMARY KEY (recipe_id, username)
);

CREATE TABLE IF Not EXISTS favoriterecipes(
    id INT,
    recipe_id INT,
    PRIMARY KEY (id, recipe_id)
);

CREATE TABLE IF Not EXISTS mypersonalrecipes(
     recipeid INT,
     user_id INT,
     title VARCHAR(255),
     readyInMinutes INT,
     image VARCHAR(255),
     servings INT,
     popularity INT,
     vegan TINYINT(1),
     vegetarian TINYINT(1),
     glutenFree TINYINT(1),
     extendedIngredients TEXT,
     instructions TEXT,
     PRIMARY KEY (recipeid, user_id)
    );

CREATE TABLE IF Not EXISTS users(
    id INT AUTO_INCREMENT,
    username VARCHAR(50),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    country VARCHAR(50),
    password VARCHAR(100),
    email VARCHAR(100),
    profilePicture VARCHAR(255),
     PRIMARY KEY (id)
    );

CREATE TABLE IF Not EXISTS watchedrecipes(
     recipe_id INT,
     user_id INT,
    date_watched DATE,
    PRIMARY KEY (recipe_id, user_id, date_watched)
    );

