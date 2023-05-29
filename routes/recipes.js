var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
router.get("/hi",(req,res)=>{
  res.send("hi")
})
// this function get every time when we call her 3 random recipes in thier preview information
router.get("/threerandomRecipes",(req,res)=>{
  recipes_utils.getRandomRecipes().then((result) =>res.status(200).send({recipes:result}) 
    
  ).catch((err) => {res.sendStatus(500)});
}
)
// this function allow for searching recipes by recieving the next paramaters:
// 1. query(what i want to find like "pasta"), 2.number(number of result),cuisine or diet or intolerence
// this function returns the preview information of all reciepes which include instructions
router.get("/searchrecipes",(req,res)=>{
  if(req.params.length===0||!req.query.query||!req.query.number||(!req.query.cuisine&&!req.query.diet&&!req.query.diet)){
    // ****maybe need to change the number of the status.and maybe thie validation should be in client side
    throw { status: 409, message: "didn't recieve one or more of the argument" };
  }
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
