var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
router.get("/hi",(req,res)=>{
  res.send("hi")
})
router.get("/threerandomRecipes",(req,res)=>{
  recipes_utils.getRandomRecipes().then((result) =>res.status(200).send({recipes:result}) 
    
  ).catch((err) => {res.sendStatus(500)});
}
)
router.get("/searchrecipes",(req,res)=>{
  params_to_search={};
  params_to_search.query= req.query.query;
  params_to_search.number=req.query.number;
  params_to_search.instructionsRequired= true;
  const temp= req.query.query
  console.log(params_to_search.query)
  console.log(params_to_search.number)
  console.log(temp)
  // res.send("hi")
  recipes_utils.ExtractParameters(req.query,params_to_search);
  recipes_utils.SearchRecipes(params_to_search).
  then((result)=>res.status(200).send({recipes:result})).
  catch((err)=>{res.sendstatus(500)})
  });
/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeInfoClicking(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
