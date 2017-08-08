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

  run(query, params={}){
    log(query)
    return db.query(query,params)
  },


  /* 
    who buy product with id 1
    only cid
    SELECT in( 'Buy' ) FROM Product WHERE id = 1
    expand attributes
    SELECT EXPAND( in( 'Buy' ) ) FROM Product WHERE id = 1
  
    get vertex Buy out User
    SELECT outE('Buy') FROM User 
  */
  getRelation(productId, relType, relType2){

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
    let klassName = upperCamelCase(relType)

    let b1 = "begin\n"
    b1 +=  `UPDATE User SET user_id="${userId}" UPSERT WHERE user_id="${userId}"\n`
    b1 +=  `UPDATE Product SET id=${id} UPSERT WHERE id=${id}\n`
    b1 +=  `commit retry 1\n`

    return OrientDBPersistenceService.run(b1, {class: 's'}).then(() => {
      let q = `CREATE EDGE ${klassName} 
              FROM (SELECT FROM User WHERE user_id="${userId}") 
              TO (SELECT FROM Product WHERE id=${id})`

      return OrientDBPersistenceService.run(q)
    })
  }
}

module.exports = OrientDBPersistenceService