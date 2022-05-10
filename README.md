# Week 18: Project Mongo API

This week's project is to start using a database with MongoDB to store data and retrieve data from it, and use that data to produce a RESTful API.

## The problem

This second project with backend was still quite easy. I used the same dataset as for express-api project, but "converted" it using MongoDB and mongoose model. I have an issue with filtering the properties with number/boolean values in query parameters but I hope to be able to make it all work..

Endpoints (can all be combined with query parameter: **page=page**):
* "**/**": Documentation,
* "**/endpoints**": All endpoints
* "**/chocolates**": Get all chocolates.
* "**/chocolates/latest_reviews**": Get the chocolates with the latest reviews (>= 2019).
* "**/chocolates/oldest_reviews**": Get the chocolates with the oldest reviews (<= 2006).
* "**/chocolates/best_ratings**": Get the chocolates with the best ratings (>= 4).
* "**/chocolates/worst_ratings**": Get the chocolates with the worst ratings (<= 2).
* "**/chocolates/highest_in_cocoa**": Get the chocolates with the highest percentage of cocoa (>= 90).
* "**/chocolates/lowest_in_cocoa**": Get the chocolates with the lowest percentage of cocoa (<= 55).
* "**/chocolates/most_ingredients**": Get the chocolates with the most ingredients (>= 6).
* "**/chocolates/least_ingredients**": Get the chocolates with the least ingredients (== 1).
* "**/chocolates/without_sweetener**": Get the chocolates without any sweetener (no sugar or other_sweetener).

With path parameters:
* "**/chocolates/name/:name**": Get a chocolate by name.
* "**/chocolates/id/:id**": Get a chocolate by ID.

Many query parameters can be used alone or combined together):
* "**/chocolates?company=string**": "Filter the chocolates from a specific company.",
* "**/chocolates?company_location=string**": "Filter the chocolates from a specific company location.",
* "**/chocolates?review_date=number**": "Filter the chocolates from a specific review date.", **needs to be fixed**
* "**/chocolates?country_of_bean_origin=string**": "Filter the chocolates from a specific country of bean origin.",
* "**/chocolates?count_of_ingredients=number**": "Filter the chocolates with a specific count of ingredients.", **needs to be fixed**
* "**/chocolates?has_cocoa_butter=boolean**": "Filter the chocolates with cocoa butter or not.", **needs to be fixed**
* "**/chocolates?has_vanilla=boolean**": "Filter the chocolates with vanilla or not.", **needs to be fixed**
* "**/chocolates?has_lecithin=boolean**": "Filter the chocolates with lecithin or not.", **needs to be fixed**
* "**/chocolates?has_sugar=boolean**": "Filter the chocolates with sugar or not.", **needs to be fixed**
* "**/chocolates?has_other_sweetener=boolean**": "Filter the chocolates with other sweetener or not.", **needs to be fixed**
* "**/chocolates?first_taste=string**": "Filter the chocolates with a first taste that includes the string.",
* "**/chocolates?second_taste=string**": "Filter the chocolates with a second taste that includes the string.",
* "**/chocolates?third_taste=string**": "Filter the chocolates with a third taste that includes the string.",
* "**/chocolates?fourth_taste=string**": "Filter the chocolates with a fourth taste that includes the string.",
* Combination example: "**/chocolates?company_location=France&review_date=2019&has_vanilla=true**"

## View it live

Project deployed here: [Sweetest API Mongo](https://sweetest-api-mongo.herokuapp.com/)

All endpoints: https://sweetest-api-mongo.herokuapp.com/endpoints
