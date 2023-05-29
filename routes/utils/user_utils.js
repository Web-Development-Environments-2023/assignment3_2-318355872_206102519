const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
    // recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    DButils.execQuery(`SELECT '${user_id}' from users`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}
// add recipe to watched recipe table
async function AddToWatchedRecipes(user_id,recipe_id){
    const currentDate = new Date().toISOString().split('T')[0];
    await DButils.execQuery(`INSERT INTO watchedrecipes VALUES ('${recipe_id}','${user_id}', '${currentDate}')`);
    DButils.execQuery(`SELECT '${user_id}' from users`);
}
// get indication for recipe if it has been watched or add to my favorite
async function CheckIfRecipeWatchedOrFavorite(recipe_id,user_id){
  result_return={};
  try {
    const query = `
    SELECT *
    FROM mydb2.watchedRecipes
    WHERE user_id='${user_id}' AND recipe_id='${recipe_id}'
    `;
    const result = await DButils.execQuery(query);
    console.log(result);
    if(result.length>0){
      result_return.watched=true;
    }
    else{
      result_return.watched=false;
    }
    // check if recipe in favorite
    const query_2 = `
    SELECT *
    FROM mydb2.favoriterecipes
    WHERE id='${user_id}' AND recipe_id='${recipe_id}'
    `;
    const result_2 = await DButils.execQuery(query_2);
    if(result_2.length>0){
      result_return.favorite=true;
    }
    else{
      result_return.favorite=false;
    }
    return result_return;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to check');
  }
}
// Define the getRecentWatchedRecipes function
async function getRecentWatchedRecipes(user_id) {
    try {
      const query = `
      SELECT recipe_id
      FROM mydb2.watchedRecipes
      WHERE user_id='${user_id}'
      ORDER BY date_watched DESC
      LIMIT 3
      `;
      list_return_id=[]
      const result = await DButils.execQuery(query);
      console.log(result);
      for(let i=0;i<result.length;i++){
        list_return_id.push(result[i].recipe_id)
      }
      return list_return_id;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve recent watched recipes');
    }
  }
  // add personal recipes to DB
  async function AddPersonalRecipes(recipe_details){
    await DButils.execQuery(`INSERT INTO mypersonalrecipes VALUES (default,'${recipe_details.user_id}','${recipe_details.title}',
     '${recipe_details.readyInMinutes}','${recipe_details.image}','${recipe_details.servings}','${recipe_details.popularity}',
     '${recipe_details.vegan}','${recipe_details.vegetarian}','${recipe_details.glutenFree}','${recipe_details.extendedIngredients}',
     '${recipe_details. instructions}')`);
    DButils.execQuery(`SELECT '${recipe_details.user_id}' from users`);
  }
  // get personal recipes from DB
  async function GetPreviePersonalRecipes(user_id){
    const query = `
      SELECT title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree
      FROM mydb2.mypersonalrecipes
      WHERE user_id='${user_id}'
      `;
      let result = await DButils.execQuery(query);
      for(let row in result){

        if(result[row].glutenFree===0){
          result[row].glutenFree=false;
        }
        else{
          result[row].glutenFree=true
        }
        if( result[row].vegan===0){
          result[row].vegan=false;
        }
        else{
          result[row].vegan=true
        }
        if( result[row].vegetarian===0){
          result[row].vegetarian=false;
        }
        else{
          result[row].vegetarian=true
        }


      }
      return result;


  }
  // function the give the full information about personal recipes
  async function GetfullPersonalRecipes(user_id){
    const query = `
      SELECT title,readyInMinutes,image,servings,popularity,vegan,vegetarian,glutenFree,extendedIngredients,instructions
      FROM mydb2.mypersonalrecipes
      WHERE user_id='${user_id}'
      `;
      let result = await DButils.execQuery(query);
      for(let row in result){

        if(result[row].glutenFree===0){
          result[row].glutenFree=false;
        }
        else{
          result[row].glutenFree=true
        }
        if( result[row].vegan===0){
          result[row].vegan=false;
        }
        else{
          result[row].vegan=true
        }
        if( result[row].vegetarian===0){
          result[row].vegetarian=false;
        }
        else{
          result[row].vegetarian=true
        }


      }
      return result;


  }
  // get family recipes function. function returns list of all family recipt by user name
  async function GetFamilyRecipes(user_name){
    const query= `
    SELECT title,readyInMinutes,image,about,servings,vegan,vegetarian,glutenFree,extendedIngredients,instructions
    FROM familyrecipes
    WHERE username='${user_name}'
    `;
    let result = await DButils.execQuery(query);
    for(let row in result){

      if(result[row].glutenFree===0){
        result[row].glutenFree=false;
      }
      else{
        result[row].glutenFree=true
      }
      if( result[row].vegan===0){
        result[row].vegan=false;
      }
      else{
        result[row].vegan=true
      }
      if( result[row].vegetarian===0){
        result[row].vegetarian=false;
      }
      else{
        result[row].vegetarian=true
      }

  }
  return result;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.AddToWatchedRecipes=AddToWatchedRecipes,
exports.getRecentWatchedRecipes=getRecentWatchedRecipes;
exports.AddPersonalRecipes=AddPersonalRecipes;
exports.GetPreviePersonalRecipes=GetPreviePersonalRecipes;
exports.GetfullPersonalRecipes=GetfullPersonalRecipes;
exports.CheckIfRecipeWatchedOrFavorite=CheckIfRecipeWatchedOrFavorite
exports.GetFamilyRecipes=GetFamilyRecipes