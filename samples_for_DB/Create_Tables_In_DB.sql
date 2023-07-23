CREATE TABLE IF Not EXISTS users(
    user_id INT AUTO_INCREMENT,
    username VARCHAR(50),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    country VARCHAR(50),
    password VARCHAR(100),
    email VARCHAR(100),
    profilePicture VARCHAR(255),
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS recipes (
   recipe_id INT AUTO_INCREMENT,
   user_id INT,
   title VARCHAR(255),
   readyInMinutes INT,
   image text,
   servings INT,
   popularity INT,
   vegan TINYINT(1),
   vegetarian TINYINT(1),
   glutenFree TINYINT(1),
   extendedIngredients TEXT,
   instructions TEXT,
   PRIMARY KEY (recipe_id),
   foreign key (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF Not EXISTS favoriterecipes(
    user_id INT,
    recipe_id INT,
    PRIMARY KEY (user_id, recipe_id),
    foreign key (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF Not EXISTS familyrecipes(
    recipe_id INT,
    user_id INT,
    about text,
    occasion text,
    chef text,
    PRIMARY KEY (recipe_id),
    foreign key (user_id) REFERENCES users(user_id)
    -- foreign key (recipe_id) REFERENCES recipes(recipe_id)
);


CREATE TABLE IF Not EXISTS mypersonalrecipes(
     recipe_id INT,
     user_id INT,
     PRIMARY KEY (recipe_id),
     foreign key (user_id) REFERENCES users(user_id)
    --  foreign key (recipe_id) REFERENCES recipes(recipe_id)
    );


CREATE TABLE IF Not EXISTS watchedrecipes(
    recipe_id INT,
    user_id INT,
    date_watched Timestamp,
    PRIMARY KEY (recipe_id, user_id, date_watched),
    foreign key (user_id) REFERENCES users(user_id)
    );

