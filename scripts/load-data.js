"use strict"

let app = require("../app")
const ProductPersistService = require("../services/product-persist-service")
const parseQs = require("../helpers/parse-qs")

let co = require('co')
let mongojs = require('mongojs')
let JSONStream = require('JSONStream')
let es = require('event-stream')

let db = mongojs(process.env.AFP_MONGO_URL)
let countClicks = 0
let countImpressions = 0

const extractClick = string => {
  try{
    let json = string
              .replace(/^[\[|\[]/,"")
              .replace(/[\[|\[]$/,"")
              .replace(/\n/,"")
              .replace(/^,/,"")

    let obj = JSON.parse(json)

    ProductPersistService
    .addClickProduct(obj.CP_ID, 
      parseQs({price: 100.0, id: obj.productInfo[0].pit })
    )
    console.log(++countClicks)
  } catch (err){
    console.log(err)
  }
}

const extractImpressions = string => {
  try{
    let json = string
              .replace(/^[\[|\[]/,"")
              .replace(/[\[|\[]$/,"")
              .replace(/\n/,"")
              .replace(/^,/,"")

    let obj = JSON.parse(json)
    for(let product of obj.productInfo){
      ProductPersistService
      .addViewProduct(obj.CP_ID, 
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

  db.click.find({})
  .pipe(JSONStream.stringify())
  .pipe(es.mapSync((data) => {
    extractClick(data)
    return data
  }))

  db.impression.find({})
  .pipe(JSONStream.stringify())
  .pipe(es.mapSync((data) => {
    extractImpressions(data)
    return data
  }))

})

