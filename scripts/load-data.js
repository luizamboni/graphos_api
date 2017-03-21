"use strict"

let app = require("../app")
const ProductPersistService = require("../services/product-persist-service")
const parseQs = require("../helpers/parse-qs")

let co = require('co')
let mongojs = require('mongojs')

let db = mongojs(process.env.AFP_MONGO_URL)
let countClicks = 0
let countImpressions = 0

const extractClick = doc => {
  try{

    ProductPersistService
    .addClickProduct(doc.b2wUID, 
      parseQs({price: 100.0, id: doc.productInfo[0].pit })
    )
    console.log(++countClicks)
  } catch (err){
    console.log(err)
  }
}

const extractImpressions = doc => {
  try{

    for(let product of doc.productInfo){
      ProductPersistService
      .addViewProduct(doc.b2wUID, 
        parseQs({price: 100.0, id: product.pit })
      )
    }

    console.log(++countImpressions)
  } catch (err){
    console.log(err)
  }
}


const cleanDB = () => ProductPersistService.session
                      .run(`MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r`)


co(function*(){
  yield cleanDB()

  let clickCursor = db.impression.find({b2wUID: { $ne: null }})
  clickCursor.forEach( (err, doc) => {
    extractClick(doc)
  })


  let impressionCursor = db.impression.find({b2wUID: { $ne: null }})
  impressionCursor.forEach( (err, doc) => {
    extractImpressions(doc)
  })

})

