const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
require("dotenv").config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const apiKey="apiKey=48240d39af344d718700679bf24c8e2e"

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}
// implmentation of Preview Recipes Details
function extractPreviewRecipeDetails(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })
  }
  async function getRecipesPreview(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    info_res.map((recp)=>{console.log(recp.data)});
    // console.log(info_res);
    return extractPreviewRecipeDetails(info_res);
  }
  function give_ids_list(response){
    let recipes= response.data.recipes
    list_id=[]
    recipes.map((recipe)=>{list_id.push(recipe.id);
    })
    return list_id;
  }
//   give id of recipes from search
  function give_ids_list_by_search(response){
    let results= response.data.results
    list_id=[]
    results.map((result)=>{list_id.push(result.id);
    })
    return list_id;
  }
//   get 3 random recipes
async function getRandomRecipes() {
     complete_info =await axios.get(`${api_domain}/random?number=3`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    })
    const recipe_list_id= give_ids_list(complete_info)
    console.log(recipe_list_id)
    let recipe_previ= getRecipesPreview(recipe_list_id);
    console.log(recipe_previ)
    return recipe_previ;
}
// get recipe information by id. that's for page 7 after the user clicked on the picutre of ingredient
async function getRecipeInfoClicking(recipe_id){
    let search_info= await getRecipeInformation(recipe_id)
    let recipes_information=GetFullDataRecipe(search_info);
    extract_ingerdients(recipes_information);
    analyzedInstruction(recipes_information);
    return recipes_information;
    

}
// info=getRecipeInfoClicking(324694)


// analyzed ingerdients
 function extract_ingerdients(search_info){
    let ingredientsList= search_info.extendedIngredients;
    let ingredients=[]
    ingredientsList.map((ingredient)=>{ingredients.push(ingredient.original)})
    search_info.extendedIngredients=ingredients;
}
// analyzed insturctions
function analyzedInstruction(search_info){
    let instructions_List= search_info.analyzedInstructions
    let instructions= []
    instructions_List.flatMap((instruction)=>instruction.steps.map(step=>
        (instructions.push({ number: step.number, description: step.step}))));
    // fix the sequential order
    let counter=1
    for(let i=0;i<instructions.length;i++){
        instructions[i].number=counter
        counter=counter+1;
    }
    search_info.analyzedInstructions=instructions
}
function GetFullDataRecipe(recipe_info){
    
    let { id, title, readyInMinutes, image,servings, aggregateLikes, vegan, vegetarian, glutenFree,extendedIngredients,analyzedInstructions } = recipe_info.data;
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        servings:servings,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients:extendedIngredients,
        analyzedInstructions:analyzedInstructions
    }

}
// the ExtractParameters extract the parameters below in the complete_info list
function ExtractParameters(query,searching_parameters){
    // change the name of the variable below
const complete_info_list=["cuisine","diet","intolerance"];
for(let i=0;i<complete_info_list.length;i++){
    if(query[complete_info_list[i]]){
        searching_parameters[complete_info_list[i]]=query[complete_info_list[i]]
    }
}
}
async function SearchRecipes(search_params){
    let searchResponse = await axios.get(`${api_domain}/complexSearch?${process.env.apiKey}`,
    {
        params: search_params
    });
   const id_list= give_ids_list_by_search(searchResponse);
   return await getRecipesPreview(id_list);

}


module.exports={getRecipeDetails:getRecipeDetails,
    getRecipesPreview:getRecipesPreview,
    getRandomRecipes:getRandomRecipes,
    ExtractParameters:ExtractParameters,
    SearchRecipes:SearchRecipes,
    getRecipeInfoClicking:getRecipeInfoClicking
}



