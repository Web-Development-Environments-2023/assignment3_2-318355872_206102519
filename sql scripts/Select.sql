SELECT * FROM mydb2.users;
-- SELECT TOP (3) recipe_id 
-- FROM mydb2.watchedRecipes
-- WHERE user_id = 4  
-- order by watchedTime DESC
SELECT recipe_id
FROM mydb2.watchedRecipes
WHERE user_id=4
ORDER BY date_watched DESC
LIMIT 3
    