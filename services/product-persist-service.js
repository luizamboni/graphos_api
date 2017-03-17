"use strong"

const neo4j = require('neo4j-driver').v1

const { url, user, pass , logger } = require("../config/persistense")[ENV]

const driver = neo4j.driver(url, neo4j.auth.basic(user, pass ))

const session = driver.session()

const log = (params) => logger ? logger(params) : null

const ProductPersistService = {

	session, 
	getUser(userId){
   	return session.run(`MATCH (u:User { uuid: {userId} }) return u`, { userId })
  },

  clickClickToo(productId){
    return this.getRelation(productId, "click")
  },

  whoClickInBuy(productId){
    return this.getRelation(productId, "click", "buy")
  },

  addViewProduct(userId, productData) {
  	return this.buildUserNode(userId, productData, "view")
  },

  addBuyProduct(userId, productData) {
  	return this.buildUserNode(userId, productData, "buy")
  },

  addClickProduct(userId, productData) {
  	return this.buildUserNode(userId, productData, "click")
  },

  getRelation(productId, relType, relType2){
    relType2 = (relType2) ? relType2 : relType

    let pattern = `MATCH ()-[:${relType}]->(p:Product {id: { productId }})<-[:${relType}]-(users) 
                    MATCH (users)-[:${relType2}]->(products) 
                    WHERE NOT products.id = {productId}
                    RETURN products`
    let params = { productId } 
    log(pattern, params )
    return session.run(pattern, params)
    .then( resp => 
      resp.records.map(r => r.get("products").properties  )
    )   
  },

  buildUserNode(userId, productData, nodeType) {
  	let { price , id } = productData
  	let pattern = `MERGE (u:User {uuid: {userId} }) 
             MERGE (p:Product { price: {price} , id: {id} }) 
             MERGE (u)-[c:${nodeType}]->(p)`
    let params =  { userId , price, id }
    log(pattern, params )

   	return session.run(pattern, params)
  }
}

module.exports = ProductPersistService
