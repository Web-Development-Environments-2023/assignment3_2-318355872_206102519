var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  console.log(req.session)
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT id FROM users").then((users) => {
      if (users.find((x) => x.id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    console.log(recipe_id)
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

// /**
//  * This path returns the favorites recipes that were saved by the logged-in user
//  */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});
router.post('/AddToWatched', async (req, res) => {
  try {
    const recipe_id = req.body.recipeId;
    console.log(recipe_id);
    const user_id = req.session.user_id;

    // Call the AddToWatchedRecipes function
    await user_utils.AddToWatchedRecipes(user_id, recipe_id);

    // Retrieve the user_id from the users table

    res.status(201).send("watched recipes added successful");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/RecentThreeWatched', async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const recentWatchedRecipes = await user_utils.getRecentWatchedRecipes(user_id);
    console.log(recentWatchedRecipes)
    preview_recipes= await recipe_utils.getRecipesPreview(recentWatchedRecipes)

    res.status(200).send(preview_recipes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
