"use strong"

let app = require("express")()

global.ENV = process.env.NODE_ENV || "development"

let parseQs = require("./helpers/parse-qs")
let ProductPersistence = require("./services/product-persist-service")

app.get("/action/view.png", (req, res) => {
  let { user_id, id, price } = parseQs(req.query)

  ProductPersistence.addClickProduct(user_id, { id, price} )
  res.send(202)
})

app.get("/action/buy.png", (req, res) => {
  let { user_id, id, price } = parseQs(req.query)

  ProductPersistence.addBuyProduct(user_id, { id, price} )
  res.send(202)
})

app.get("/recommend/who-view-view-too", (req, res) => {
  let { id } = parseQs(req.query)

  ProductPersistence
  .clickClickToo(id)
  .then( products => res.json(products) )

})

app.get("/recommend/who-view-buy", (req, res) => {
  let { id } = parseQs(req.query)

  debugger
  ProductPersistence
  .whoClickInBuy(id)
  .then( products => res.json(products) )
})

module.exports = app