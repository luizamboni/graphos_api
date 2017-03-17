"use strong"

const neo4j = require('neo4j-driver').v1

const { url, user, pass } = require("../config/persistense")[ENV]

const driver = neo4j.driver(url, neo4j.auth.basic(user, pass ))
const session = driver.session()

const ProductPersistService = {

	session, 
	getUser(user){
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
    return session.run(pattern, { productId })
    .then( resp => 
      resp.records.map(r => r.get("products").properties  )
    )   
  },

  buildUserNode(userId, productData, nodeType) {
  	let { price , id } = productData
  	let pattern = `MERGE (u:User {uuid: {userId} }) 
             MERGE (p:Product { price: {price} , id: {id} }) 
             MERGE (u)-[c:${nodeType}]->(p)`
   	return session.run(pattern, { userId , price, id })
  }
}

module.exports = ProductPersistService
