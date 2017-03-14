"use strict"

const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "test"));
const session = driver.session()

const ProductPersistService = {

	session, 
	
  addViewProduct(userId, productData) {
  	return this.buildNode(userId, productData, "view")
  },

  addBuyProduct(userId, productData) {
  	return this.buildNode(userId, productData, "buy")
  },

  addClickProduct(userId, productData) {
  	return this.buildNode(userId, productData, "click")
  },

  buildNode(userId, productData, nodeType) {
  	let { price , id } = productData
  	let r = `CREATE r = (u:User {uuid: {userId} } )-[c:${nodeType}]->(p:Product { price: {price} , id: {id} })`
   	return session.run(r, { userId , price, id })
  }
}

module.exports = ProductPersistService