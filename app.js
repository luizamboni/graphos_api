"use strong"

let app = require("express")()

global.ENV = process.env.NODE_ENV || "development"

/* helpers */
let parseQs = require("./helpers/parse-qs")

/* services */
let ProductPersistence = require("./services/product-persist-service")
const Neo4jStrategy = require("./services/persistence/neo4j-persistence-service")
let productPersistence = new ProductPersistence(Neo4jStrategy)

/* midleware*/
let cors = require("cors")

app.use(cors())

app.get("/action/view.png", (req, res) => {
  let { user_id, id, price } = parseQs(req.query)

  productPersistence.addClickProduct(user_id, { id, price} )
  res.send(202)
})

app.get("/action/buy.png", (req, res) => {
  let { user_id, id, price } = parseQs(req.query)

  productPersistence.addBuyProduct(user_id, { id, price} )
  res.send(202)
})

app.get("/recommend/who-view-view-too", (req, res) => {
  let { id } = parseQs(req.query)

  productPersistence
  .clickClickToo(id)
  .then( products => res.json(products) )

})

app.get("/recommend/who-view-buy", (req, res) => {
  let { id } = parseQs(req.query)

  productPersistence
  .whoClickInBuy(id)
  .then( products => res.json(products) )
})

module.exports = app