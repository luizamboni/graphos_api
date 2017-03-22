"use strong"

const OrientDB = require('orientjs')
const Promise = require("bluebird")

const server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'pwd',
   useToken: true

})

const db = server.use('recommend_test')
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
    console.log(query)
    return db.query(query)
  },

  getRelation(productId, relType, relType2){

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