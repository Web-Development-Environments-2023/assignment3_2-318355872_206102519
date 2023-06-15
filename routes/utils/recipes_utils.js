const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
require("dotenv").config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
// const apiKey="apiKey=48240d39af344d718700679bf24c8e2e"

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipe_id
 */

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

/**
 * func that get the all details of recipe
 * @param recipe_id
 * @returns {Promise<{readyInMinutes: *, image: *, popularity: *, vegetarian: *, glutenFree: *, id: *, vegan: *, title: *}>}
 */
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
/**
 * func that take recipes_info tne extract the data from it
 * @param recipes_info
 * @returns {*}
 */
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

/**
 * func thar get ids of recipes and return list of all recipes with all there params
 * @param recipes_ids_list
 */
async function getRecipesPreview(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    // info_res.map((recp)=>{console.log(recp.data)});
    return extractPreviewRecipeDetails(info_res);
  }

/**
 * func that get response and returns the ids on it
 * @param response
 */
function give_ids_list(response){
    let recipes= response.data.recipes
    list_id=[]
    recipes.map((recipe)=>{list_id.push(recipe.id);
    })
    return list_id;
  }
/**
 * func that return recipes ids from the search response
 * @param response
 */
  function give_ids_list_by_search(response){
    let results= response.data.results
    list_id=[]
    results.map((result)=>{list_id.push(result.id);
    })
    return list_id;
  }
/**
 * Func that return list of 3 randoms precipices
 * @returns {Promise<*>}
 */
async function getRandomRecipes() {
    let response_back;
    let counter=0;
    let counter_check=0;
    let good_result=false;
    while(!good_result){
        response_back=await axios.get(`${api_domain}/random?number=3`, {
            params: {
                apiKey: process.env.spooncular_apiKey
            }
        })
        counter_check++;
        for(let i=0;i<response_back.data.recipes.length;i++){
            if(response_back.data.recipes[i].analyzedInstructions.length>0){
                counter=counter+1;
            }
        }
        if(counter===3){
            good_result=true;
        }
    }
 
    // let recipe_previ=extractPreviewRecipeDetails(response_back);
    // const recipe_list_id= give_ids_list(response_back);
    // let recipe_previ= getRecipesPreview(recipe_list_id);
    let recipe_previ=extractRandomPreview(response_back.data.recipes);

    return recipe_previ;
}

 /** function that extract preview information for the random recipes
 *  * @param search_respone
 *  *@returns  {id,title,readyInMinutes,image,aggregateLikes,vegan,vegetarian,glutenFree}
 */
function extractRandomPreview(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        // if (recipe_info.data) {
        //     data = recipe_info.data;
        // }
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

 /** Func that get recipe information by id. that's for page 7 after the user clicked on the picutre of ingredient
 * @param recipe_id
 * @returns {Promise<{readyInMinutes: *, image: *, servings: *, popularity: *, analyzedInstructions: *, vegetarian: *, glutenFree: *, id: *, vegan: *, title: *, extendedIngredients: *}>}
 */
async function getRecipeInfoClicking(recipe_id){
    let search_info= await getRecipeInformation(recipe_id)
    let recipes_information=GetFullDataRecipe(search_info);
    extract_ingerdients(recipes_information);
    analyzedInstruction(recipes_information);
    return recipes_information;
}

/**
 * func that extract ingredients from the search query
 * @param search_info
 */
 function extract_ingerdients(search_info){
    let ingredientsList= search_info.extendedIngredients;
    let ingredients=[]
    ingredientsList.map((ingredient)=>{ingredients.push(ingredient.original)})
    search_info.extendedIngredients=ingredients;
}
/**
 * func that analyzed insturctions
 * @param search_info
 */
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

/**
 * Func that return the full format of the Recipe
 * @param recipe_info
 * @returns {{readyInMinutes: *, image: *, servings: *, popularity: *, analyzedInstructions: *, vegetarian: *, glutenFree: *, id: *, vegan: *, title: *, extendedIngredients: *}}
 * @constructor
 */
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

/**
 * Func that ExtractParameters extract the parameters below in the complete_info list
 * @param query
 * @param searching_parameters
 * @constructor
 */
function ExtractParameters(query,searching_parameters){
    // change the name of the variable below
const complete_info_list=["cuisine","diet","intolerance"];
for(let i=0;i<complete_info_list.length;i++){
    if(query[complete_info_list[i]]){
        searching_parameters[complete_info_list[i]]=query[complete_info_list[i]]
    }
}
}

/**
 * Func that Search Recipes by the query that get from the user and return list of all recipes
 * @param search_params
 */
async function SearchRecipes(search_params){
    let searchResponse = await axios.get(`${api_domain}/complexSearch?${process.env.apiKey}`,
    {
        params: search_params
    });
   const id_list= give_ids_list_by_search(searchResponse);
   return await getRecipesPreview(id_list);

}

/**
 * exports all the function that need for the user routes
 */
module.exports={getRecipeDetails:getRecipeDetails,
    getRecipesPreview:getRecipesPreview,
    getRandomRecipes:getRandomRecipes,
    ExtractParameters:ExtractParameters,
    SearchRecipes:SearchRecipes,
    getRecipeInfoClicking:getRecipeInfoClicking
}
