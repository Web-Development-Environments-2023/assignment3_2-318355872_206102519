const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
require("dotenv").config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })


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
//   get 3 random recipes
async function getRandomRecipes() {
    console.log("hi")
     temp =await axios.get(`${api_domain}/random?number=3`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    })
    const recipe_list_id= give_ids_list(temp)
    console.log(recipe_list_id)
    let recipe_previ= getRecipesPreview(recipe_list_id);
    console.log(recipe_previ)
    return recipe_previ;
}
// async function get_random_recipes_with_instructions




module.exports={getRecipeDetails:getRecipeDetails,
    getRecipesPreview:getRecipesPreview,
    getRandomRecipes:getRandomRecipes
}



