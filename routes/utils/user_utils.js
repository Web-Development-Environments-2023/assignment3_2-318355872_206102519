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

async function AddToWatchedRecipes(user_id,recipe_id){
    const currentDate = new Date().toISOString().split('T')[0];
    await DButils.execQuery(`INSERT INTO watchedrecipes VALUES ('${recipe_id}','${user_id}', '${currentDate}')`);
    DButils.execQuery(`SELECT '${user_id}' from users`);
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
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.AddToWatchedRecipes=AddToWatchedRecipes,
exports.getRecentWatchedRecipes=getRecentWatchedRecipes;
