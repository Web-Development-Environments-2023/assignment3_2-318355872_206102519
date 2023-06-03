var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
router.get("/hi",(req,res)=>{
  res.send("hi")
})
/**
 * This path returns 3 random recipes in preview format
 */
router.get("/main_page_3_random",(req,res)=>{
  recipes_utils.getRandomRecipes().then((result) =>res.status(200).send({recipes:result}) 
    
  ).catch((err) => {res.sendStatus(500)});
}
)
//TODO need to understand if it ok to leave it to only number and query? or we want to create filter system
// this function allow for searching recipes by recieving the next paramaters:
// 1. query(what i want to find like "pasta"), 2.number(number of result),cuisine or diet or intolerence
// this function returns the preview information of all reciepes which include instructions
/**
 * This path returns recipes that have the query in there title
 */
router.get("/search",(req,res)=>{
  // if(req.params.length===0||!req.query.query||!req.query.number||(!req.query.cuisine&&!req.query.diet&&!req.query.diet)){
  if(req.params.length===0||!req.query.query||!req.query.number){
    // ****maybe need to change the number of the status.and maybe thie validation should be in client side
    throw { status: 409, message: "didn't recieve one or more of the argument" };
  }
  params_to_search={};
  params_to_search.query= req.query.query;
  params_to_search.number=req.query.number;
  params_to_search.instructionsRequired= true;
  console.log(params_to_search.query)
  console.log(params_to_search.number)
  // res.send("hi")
  recipes_utils.ExtractParameters(req.query,params_to_search);
  recipes_utils.SearchRecipes(params_to_search).
  then((result)=>res.status(200).send({recipes:result})).
  catch((err)=>{res.sendstatus(500)})
  });
/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeInfoClicking(req.params.recipe_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
