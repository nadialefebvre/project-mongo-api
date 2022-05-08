import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})


const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
})

const House = mongoose.model('House', {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal'
  },
  type: String
})

// watch again codealong about that, around 10:00
if (process.env.RESET_DATABASE) {
  console.log("resetting database!")

  const seedDatabase = async () => {
    await Animal.deleteMany()
    await House.deleteMany()

    const minou = new Animal({ name: 'Alfons', age: 2, isFurry: true })
    await minou.save()

    const pitou = new Animal({ name: 'Lucy', age: 5, isFurry: false })
    await pitou.save()

    const fido = new Animal({ name: 'Goldy', age: 10, isFurry: true })
    await fido.save()

    await new House({ type: 'Cottage', owner: minou }).save()
    await new House({ type: 'Tent', owner: minou }).save()
    await new House({ type: 'Duplex', owner: pitou }).save()
    await new House({ type: 'Triplex', owner: fido }).save()
    await new House({ type: 'Bungalow', owner: pitou }).save()

  }
  seedDatabase()
}

// Animal.deleteMany().then(() => {
//   new Animal({ name: 'Alfons', age: 2, isFurry: true }).save()
//   new Animal({ name: 'Lucy', age: 5, isFurry: false }).save()
//   new Animal({ name: 'Goldy', age: 10, isFurry: true }).save()
// })

// Start defining your routes here
// app.get("/", (req, res) => {
//   fetch('...', { headers: { Authorization: 'my super secret key' } })
//   res.send(process.env.API_KEY)
// })


app.get("/animals", async (req, res) => {
  const animals = await Animal.find()
  res.json(animals)
})

app.get("/animals/:id", async (req, res) => {
  const owner = await Animal.findById(req.params.id)
  if(owner) {
  res.json(owner)
  } else {
    res.status(404).json({ error: "owner not found" })
  }
})

app.get("/animals/:id/houses", async (req, res) => {
  const owner = await Animal.findById(req.params.id)

  if(owner) {
    const houses = await House.find({ owner: mongoose.Types.ObjectId(owner.id) })
    res.json(houses)  
  } else {
    res.status(404).json({ error: "owner not found" })
  }
})



app.get("/houses", async (req, res) => {
  const houses = await House.find().populate('owner')
  res.json(houses)
})


app.get("/name/:name", (req, res) => {
  Animal.findOne({ name: req.params.name }).then(animal => {
    if (animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: "not found with this name" })
    }
  })
})

app.get("/id/:id", async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
    if (animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: "not found with this id" })
    }
  } catch (err) {
    res.status(400).json({ error: "invalid id" })
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
