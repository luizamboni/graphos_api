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

const db = server.use('products_test')

const log = (params) => logger ? logger(params) : null


const OrientDBPersistenceService = {

  cleanDB(){
    return []
  },

  run(pattern, params){
  },

  getRelation(productId, relType, relType2){

  },

  buildUserNode(userId, productData, relType) {
    return Promise.all([
      db.class.get('User'),
      db.class.get('Product'),
      db.class.get(relType)
    ])
    .spread(( User, Product ,RelType ) => {
      return Promise.all([
        User.create({ user_id: userId }),
        Product.create(productData),
        RelType
      ])
    })
    .spread((user, product,RelType) => {
      console.log( user['@rid'], product["@rid"].toString())
      return RelType.create({
        out: user['@rid'],
        in: product['@rid']
      })
    })
  }

}

module.exports = OrientDBPersistenceService