const DButils = require("./DButils");

/**
 *  Func that add to the FavoriteRecipes Table record with the user_id and recipe_id
 */
async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

/**
 * Func that search all recipe_id that have the user_id in the FavoriteRecipes Table
 */
async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

/**
 * Func that add to the WatchedRecipes Table record with the user_id and recipe_id
 */
async function AddToWatchedRecipes(user_id,recipe_id){
    const currentDate = new Date().toISOString();
    let Value = await DButils.execQuery(`INSERT INTO watchedrecipes VALUES ('${recipe_id}','${user_id}', '${currentDate}')`);
    console.log(Value)
}

/**
 * Function that check for pair : recipe_id and user_id if the User have watch it or mark it as favorite using
 * the two tables FavoriteRecipes and WatchedRecipes
 * and return dict {watched:bool,favorite:bool}
 */
async function CheckIfRecipeWatchedOrFavorite(recipe_id,user_id){
  result_return={};
  try {
    const query = `
    SELECT *
    FROM watchedRecipes
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
    FROM favoriterecipes
    WHERE user_id='${user_id}' AND recipe_id='${recipe_id}'
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
/**
 * Function that get all Recipes that watched by the user_id
 * @returns {Promise<[]>}
 */
async function getRecentWatchedRecipes(user_id) {
    try {
      const query = `
        SELECT distinct(recipe_id), date_watched
        FROM watchedRecipes
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
/**
 * Func that get all details that necessary to create record on the recipe table ,
 * and save the recipe_id and the user_id in mypersonalrecipes table
 * @param recipe_details
 * @returns {Promise<void>}
 */
  async function AddPersonalRecipes(recipe_details){
    await DButils.execQuery(`INSERT INTO recipes VALUES (default,'${recipe_details.user_id}','${recipe_details.title}',
     '${recipe_details.readyInMinutes}','${recipe_details.image}','${recipe_details.servings}','${recipe_details.popularity}',
     '${recipe_details.vegan}','${recipe_details.vegetarian}','${recipe_details.glutenFree}','${recipe_details.extendedIngredients}',
     '${recipe_details. instructions}')`);
    var max_recipe_id = await DButils.execQuery('SELECT MAX(recipe_id) FROM recipes;');
    await DButils.execQuery(`INSERT INTO mypersonalrecipes VALUES('${max_recipe_id[0]['MAX(recipe_id)']}', '${recipe_details.user_id}')`)
  }
/**
 * Func that returns all personal recipes in preview format of the user_id from the DB
 * @returns {Promise<*>}
 */
  async function GetPreviePersonalRecipes(user_id){
    const query = `
      SELECT m.recipe_id as id,title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree
      FROM recipes re join mypersonalrecipes m on re.recipe_id = m.recipe_id
      WHERE re.user_id='${user_id}'
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
/**
 * Func that returns all personal recipes in full format of the user_id from the DB
 * @returns {Promise<*>}
 */
  async function GetfullPersonalRecipes(user_id){
    const query = `
      SELECT re.recipe_id as id,title,readyInMinutes,image,servings,popularity,vegan,vegetarian,glutenFree,extendedIngredients,instructions
      FROM recipes re join mypersonalrecipes m on re.recipe_id = m.recipe_id
      WHERE re.user_id='${user_id}'
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
/**
 * Func that returns all family recipes in full format of the user_id from the DB
 * @returns {Promise<*>}
 */
  async function GetFamilyRecipes(user_id){
    const query= `
    SELECT re.recipe_id as id, title,readyInMinutes,image,about,occasion,servings,vegan,vegetarian,glutenFree,extendedIngredients,instructions,chef
    FROM recipes re join familyrecipes f on re.recipe_id = f.recipe_id
    WHERE re.user_id='${user_id}'
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

/**
 * Func that get the username from the DB using the user_id
 * @param user_id
 * @returns {Promise<*>}
 */
async function get_username_by_id(user_id)
{
  const query= `
  SELECT username
  FROM users
  WHERE user_id='${user_id}'
    `;
      let result = await DButils.execQuery(query);
      for(let row in result){
        return result[row].username
      }
}

/**
 * exports all the function that need for the user routes
 */
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.AddToWatchedRecipes=AddToWatchedRecipes,
exports.getRecentWatchedRecipes=getRecentWatchedRecipes;
exports.AddPersonalRecipes=AddPersonalRecipes;
exports.GetPreviePersonalRecipes=GetPreviePersonalRecipes;
exports.GetfullPersonalRecipes=GetfullPersonalRecipes;
exports.CheckIfRecipeWatchedOrFavorite=CheckIfRecipeWatchedOrFavorite
exports.GetFamilyRecipes=GetFamilyRecipes
exports.get_username_by_id=get_username_by_id;
