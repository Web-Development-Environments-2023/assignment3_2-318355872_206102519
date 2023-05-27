var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/threerandomRecipes",(req,res)=>{
  console.log("hi")
  recipes_utils.getRandomRecipes().then((result) =>res.status(200).send({recipes:result}) 
    
  ).catch((err) => {res.sendStatus(500)
    
  });
}
)
/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
