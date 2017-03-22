"use strong"

const OrientDB = require('orientjs')
const Promise = require("bluebird")
const config = require("../../config/persistense")[ENV].orient

const server = OrientDB(config.server)

const logger = config.logger

const db = server.use(config.database.name)
const upperCamelCase = require('uppercamelcase');
const log = (params) => logger ? logger(params) : null


const OrientDBPersistenceService = {

  cleanDB(){
    return Promise.all([
      OrientDBPersistenceService.run("DELETE VERTEX Product"),
      OrientDBPersistenceService.run("DELETE VERTEX User"),
      OrientDBPersistenceService.run("DELETE EDGE E")
    ])
  },

  run(query, params){
    log(query)
    return db.query(query)
  },

  getRelation(productId, relType, relType2){
    /* 
      who buy product with id 1
      only cid
      SELECT in( 'Buy' ) FROM Product WHERE id = 1
      expand attributes
      SELECT EXPAND( in( 'Buy' ) ) FROM Product WHERE id = 1
    
      get vertex Buy out User
      SELECT outE('Buy') FROM User 

    */
    relType = upperCamelCase(relType)
    relType2 = upperCamelCase((relType2) ? relType2 : relType)
    let q = `SELECT FROM 
               (SELECT EXPAND(out('${relType2}')) 
               FROM 
               (SELECT EXPAND(in('${relType}')) 
               FROM Product WHERE id = ${productId})) 
               WHERE id != ${productId}`
    return OrientDBPersistenceService.run(q)
  },

  buildUserNode(userId, productData, relType) {
    let { id } = productData
    let updateUser = `UPDATE User SET user_id="${userId}" UPSERT WHERE user_id="${userId}"`
    let updateProd = `UPDATE Product SET id=${id} UPSERT WHERE id=${id}`
    let selectUser = `SELECT FROM User WHERE user_id="${userId}" LIMIT 1`
    let selectProd = `SELECT FROM Product WHERE id=${id} LIMIT 1`

    return Promise.all([
      OrientDBPersistenceService.run(updateUser),
      OrientDBPersistenceService.run(updateProd),
    ])
    .then(() => {
      return Promise.all([
        OrientDBPersistenceService.run(selectUser),
        OrientDBPersistenceService.run(selectProd)
      ])
    })
    .spread((users, products) => {
      let [ from, to ] = [users[0]['@rid'], products[0]['@rid']]
      let klassName = upperCamelCase(relType)
      let createEdge = `CREATE EDGE ${klassName} FROM ${from} TO ${to}`

      return OrientDBPersistenceService.run(createEdge)
    })
  } 

}

module.exports = OrientDBPersistenceService