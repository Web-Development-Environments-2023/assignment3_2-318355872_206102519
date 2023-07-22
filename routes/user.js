var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const {get_username_by_id} = require("./utils/user_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  console.log(req.session);
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
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

/**
 * This path returns the favorites recipes of the connected user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});
/**
 * This path update the DB with the watched recipe of the connected user
 */
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
/**
 * This path returns the recent three watched recipes of the connected user
 */
router.get('/RecentThreeWatched', async (req, res) => {
  try {
    const user_id = req.session.user_id;
    let full_info_recipes = await user_utils.getRecentWatchedRecipes(user_id);
    console.log(full_info_recipes)
    full_info_recipes = await recipe_utils.getRecipesPreview(full_info_recipes)

    res.status(200).send({recipes:full_info_recipes});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/**
 * This path update the DB with the new Personal recipe of the connected user
 */
router.post('/AddPersonalRecipe',async(req,res)=>{
  try{
    const user_id= req.session.user_id;
    const vegan= req.body.vegan?1:0;
    const glutenFree=req.body.glutenFree?1:0;
    const vegetarian=req.body.vegetarian?1:0;
    let recipe_details = {
      user_id: user_id,
      title:req.body.title,
      readyInMinutes:req.body.readyInMinutes,
      image:req.body.image,
      servings:req.body.servings,
      popularity:req.body.popularity,
      vegan:vegan,
      vegetarian:vegetarian,
      glutenFree:glutenFree,
      extendedIngredients:req.body.extendedIngredients,
      instructions:req.body.instructions
    }
    await user_utils.AddPersonalRecipes(recipe_details);
    res.status(201).send("Personal recipe added successful");

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
/**
 * This path returns the personal recipes of the connected user in preview format
 */
router.get('/GetPreviewPersonalRecipes', async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const preview_personal_recipes = await user_utils.GetPreviePersonalRecipes(user_id);
    
    console.log(preview_personal_recipes)
    res.status(200).send({preview_personal_recipes});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/**
 * This path returns the personal recipes of the connected user in full format
 */
router.get('/GetfullPersonalRecipes', async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const full_personal_recipes = await user_utils.GetfullPersonalRecipes(user_id);
    
    console.log(full_personal_recipes)
    res.status(200).send({full_personal_recipes});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/**
 * This path check if user watched recipe or added to favorite by using list of recipes ids
 * return list that for each id : {watched_bool,favorite_bool}
 */
router.get("/CheckFavoriteWatched/:recipeIds", async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const ids_list_json=  req.params.recipeIds.split(',');
    console.log('Recipe IDs received: ' + ids_list_json)
    let promise_list=[]
    let json_reutrn={}
    for(let i=0;i<ids_list_json.length;i++){
      let promise_push= user_utils.CheckIfRecipeWatchedOrFavorite(ids_list_json[i],user_id)
      .then((value_reutrn)=>{json_reutrn[ids_list_json[i]]=value_reutrn;});
      promise_list.push(promise_push);
    }
    await Promise.all(promise_list);
    // console.log(result)
    res.status(200).send(json_reutrn);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/**
 * This path returns the family recipes of the connected user
 */
router.get('/GetFamilyRecipes', async (req, res) => {
  try {
    const result = await user_utils.GetFamilyPreViewRecipes(req.session.user_id);

    console.log(result)
    res.status(200).send({result});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * This path return family recipe of the connected user in full format
 */
router.get('/GetFamilyRecipeFullView/:recipe_id', async (req, res) => {
  try {
    const result = await user_utils.GetFamilyRecipeFullView(req.session.user_id, req.params.recipe_id);

    console.log(result)
    res.status(200).send({result});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
