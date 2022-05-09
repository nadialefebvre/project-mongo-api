import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import allEndpoints from "express-list-endpoints"

import chocolatesData from "./data/chocolates.json"

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

const Chocolate = mongoose.model("Chocolate", {
  company: String,
  company_location: String,
  review_date: Number,
  country_of_bean_origin: String,
  specific_bean_origin_or_bar_name: String,
  cocoa_percentage: Number,
  rating: Number,
  count_of_ingredients: Number,
  has_cocoa_butter: Boolean,
  has_vanilla: Boolean,
  has_lecithin: Boolean,
  has_salt: Boolean,
  has_sugar: Boolean,
  has_other_sweetener: Boolean,
  first_taste: String,
  second_taste: String,
  third_taste: String,
  fourth_taste: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Chocolate.deleteMany()
    chocolatesData.forEach(singleChocolate => {
      const newChocolate = new Chocolate(singleChocolate)
      newChocolate.save()
    })
  }
  seedDatabase()
}

const pagination = (data, pageNumber = 1, res) => {
  const pageSize = 50
  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const itemsOnPage = data.slice(startIndex, endIndex)
  const totalOfPages = Math.ceil(data.length / pageSize)

  if (pageNumber < 1 || pageNumber > totalOfPages && data.length > 0) {
    res.status(400)
      .json({
        success: false,
        status_code: 400,
        message: `Bad request: this page doesn't exist, page ${totalOfPages} is the last one.`
      })
  } else {
    const returnObject = {
      page: pageNumber,
      page_size: pageSize,
      items_on_page: itemsOnPage.length,
      total_of_pages: totalOfPages,
      total_of_results: data.length,
      success: true,
      results: itemsOnPage
    }

    return returnObject
  }
}

app.get("/", (req, res) => {
  res.send(
    {
      "Welcome": "Sweetest API Mongo is all about chocolate. 🍫 Enjoy!",
      "Routes (can all be combined with query parameter: page=page": {
        "/": "Documentation",
        "/endpoints": "All endpoints",
        "/chocolates": "Get all chocolates.",
        "/chocolates/latest_reviews": "Get the chocolates with the latest reviews (>= 2019).",
        "/chocolates/oldest_reviews": "Get the chocolates with the oldest reviews (<= 2006).",
        "/chocolates/best_ratings": "Get the chocolates with the best ratings (>= 4).",
        "/chocolates/worst_ratings": "Get the chocolates with the worst ratings (<= 2).",
        "/chocolates/highest_in_cocoa": "Get the chocolates with the highest percentage of cocoa (>= 90).",
        "/chocolates/lowest_in_cocoa": "Get the chocolates with the lowest percentage of cocoa (<= 55).",
        "/chocolates/most_ingredients": "Get the chocolates with the most ingredients (>= 6).",
        "/chocolates/least_ingredients": "Get the chocolates with the least ingredients (== 1).",
        "/chocolates/without_sweetener": "Get the chocolates without any sweetener (no sugar or other_sweetener)."
      },
      "Routes with path parameters": {
        "/chocolates/name/${name}": "Get a chocolate by name.",
        "/chocolates/id/${id}": "Get a chocolate by ID."
      },

      "Query parameters (can be combined together)": {
        "/chocolates?company=string": "Filter the chocolates from a specific company.",
        "/chocolates?company_location=string": "Filter the chocolates from a specific company location.",
        // "/chocolates?review_date=number": "Filter the chocolates from a specific review date.",
        "/chocolates?country_of_bean_origin=string": "Filter the chocolates from a specific country of bean origin.",
        // "/chocolates?count_of_ingredients=number": "Filter the chocolates with a specific count of ingredients.",
        // "/chocolates?has_cocoa_butter=boolean": "Filter the chocolates with cocoa butter or not.",
        // "/chocolates?has_vanilla=boolean": "Filter the chocolates with vanilla or not.",
        // "/chocolates?has_lecithin=boolean": "Filter the chocolates with lecithin or not.",
        // "/chocolates?has_sugar=boolean": "Filter the chocolates with sugar or not.",
        // "/chocolates?has_other_sweetener=boolean": "Filter the chocolates with other sweetener or not.",
        "/chocolates?first_taste=string": "Filter the chocolates with a first taste that includes the string.",
        "/chocolates?second_taste=string": "Filter the chocolates with a second taste that includes the string.",
        "/chocolates?third_taste=string": "Filter the chocolates with a third taste that includes the string.",
        "/chocolates?fourth_taste=string": "Filter the chocolates with a fourth taste that includes the string.",
        // "Combination example": "/chocolates?company_location=France&review_date=2019&has_vanilla=true"
      }
    }
  )
})

// cant get it to work when combining boolean and number together or with others
app.get("/chocolates", async (req, res) => {
  const {
    company,
    company_location,
    // review_date,
    country_of_bean_origin,
    // count_of_ingredients,
    // has_cocoa_butter,
    // has_vanilla,
    // has_lecithin,
    // has_salt,
    // has_sugar,
    // has_other_sweetener,
    first_taste,
    second_taste,
    third_taste,
    fourth_taste,
    page
  } = req.query


  // how to implement the following part?

  // if (company === "" ||
  // company_location === "" ||
  // review_date === "" ||
  // country_of_bean_origin === "" ||
  // count_of_ingredients === "" ||
  // has_cocoa_butter === "" ||
  // has_vanilla === "" ||
  // has_lecithin === "" ||
  // has_salt === "" ||
  // has_sugar === "" ||
  // has_other_sweetener === "" ||
  // first_taste === "" ||
  // second_taste === "" ||
  // third_taste === "" ||
  // fourth_taste === "" ||
  //   page === "") {
  //   res.status(400).json({
  //     success: false,
  //     status_code: 400,
  //     message: "At least one of the query parameters in the path has no value, please make sure that you use property=value."
  //   })
  // }

  try {
    const allChocolatesData = await Chocolate.find({
      company: new RegExp(company, "i"),
      company_location: new RegExp(company_location, "i"),
      // review_date: { $eq: review_date },
      country_of_bean_origin: new RegExp(country_of_bean_origin, "i"),
      // count_of_ingredients: { $eq: count_of_ingredients },
      // has_cocoa_butter: has_cocoa_butter,
      // has_vanilla: has_vanilla,
      // has_lecithin: has_lecithin,
      // has_salt: has_salt,
      // has_sugar: has_sugar,
      // has_other_sweetener: has_other_sweetener,
      first_taste: new RegExp(first_taste, "i"),
      second_taste: new RegExp(second_taste, "i"),
      third_taste: new RegExp(third_taste, "i"),
      fourth_taste: new RegExp(fourth_taste, "i"),
      page: page,
    })

    res.status(200).json(pagination(allChocolatesData, page, res))

  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request."
    })
  }
})

app.get("/chocolates/id", (req, res) => {
  res.status(200).json({
    success: true,
    status_code: 200,
    message: "Type an ID at the end of the path if you want to find a specific chocolate."
  })
})

app.get("/chocolates/id/:id", async (req, res) => {
  const { id } = req.params

  try {
    const chocolateByID = await Chocolate.findById(id)
    if (chocolateByID) {
      res.status(200).json({
        success: true,
        results: chocolateByID,
      })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        message: `No chocolate found with the id: ${id}`
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Invalid id."
    })
  }
})

app.get("/chocolates/name", (req, res) => {
  res.status(200).json({
    success: true,
    status_code: 200,
    message: "Type a name at the end of the path if you want to find a specific chocolate."
  })
})

app.get("/chocolates/name/:name", async (req, res) => {
  const { name } = req.params

  try {
    const chocolateByName = await Chocolate.findOne({
      specific_bean_origin_or_bar_name: new RegExp(name, "i")
    })

    if (chocolateByName) {
      res.status(200).json({
        success: true,
        results: chocolateByName,
      })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        message: `No chocolate found with the name: ${name}`
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/latest_reviews", async (req, res) => {
  const { page } = req.query

  try {
    const latestReviewedChocolates = await Chocolate.find({
      review_date: { $gte: 2019 }
    })
    res.status(200).json(pagination(latestReviewedChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/oldest_reviews", async (req, res) => {
  const { page } = req.query

  try {
    const oldestReviewedChocolates = await Chocolate.find({
      review_date: { $lte: 2006 }
    })
    res.status(200).json(pagination(oldestReviewedChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/best_ratings", async (req, res) => {
  const { page } = req.query

  try {
    const bestRatedChocolates = await Chocolate.find({ rating: { $gte: 4 } })
    res.status(200).json(pagination(bestRatedChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/worst_ratings", async (req, res) => {
  const { page } = req.query

  try {
    const worstRatedChocolates = await Chocolate.find({ rating: { $lte: 2 } })
    res.status(200).json(pagination(worstRatedChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/highest_in_cocoa", async (req, res) => {
  const { page } = req.query

  try {
    const highestCocoaChocolates = await Chocolate.find({
      cocoa_percentage: { $gte: 90 }
    })
    res.status(200).json(pagination(highestCocoaChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/lowest_in_cocoa", async (req, res) => {
  const { page } = req.query

  try {
    const lowestCocoaChocolates = await Chocolate.find({
      cocoa_percentage: { $lte: 55 }
    })
    res.status(200).json(pagination(lowestCocoaChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/most_ingredients", async (req, res) => {
  const { page } = req.query

  try {
    const mostIngredientsChocolates = await Chocolate.find({
      count_of_ingredients: { $gte: 6 }
    })
    res.status(200).json(pagination(mostIngredientsChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/least_ingredients", async (req, res) => {
  const { page } = req.query

  try {
    const leastIngredientsChocolates = await Chocolate.find({
      count_of_ingredients: 1
    })
    res.status(200).json(pagination(leastIngredientsChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/chocolates/without_sweetener", async (req, res) => {
  const { page } = req.query

  try {
    const withoutSweetenerChocolates = await Chocolate.find({
      has_sugar: false, has_other_sweetener: false
    })
    res.status(200).json(pagination(withoutSweetenerChocolates, page, res))
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.get("/endpoints", (req, res) => {
  res.send(allEndpoints(app))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
