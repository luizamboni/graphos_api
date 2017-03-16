"use strict"

const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "test"));
const session = driver.session()

const ProductPersistService = {

	session, 
	getUser(user){
   	return session.run(`MATCH (u:User { uuid: {userId} }) return u`, { userId })
  },

  viewViewToo(productId){
    let pattern = `MATCH ()-[:click]->(p:Product {id: { productId }})<-[:click]-(users) 
                    MATCH (users)-[:click]->(products) 
                    WHERE NOT products.id = {productId}
                    RETURN products`
    return session.run(pattern, { productId })
    .then( resp => 
      resp.records.map(r => r.get("products").properties  )
    )   
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

  buildUserNode(userId, productData, nodeType) {
  	let { price , id } = productData
  	let pattern = `MERGE (u:User {uuid: {userId} }) 
             MERGE (p:Product { price: {price} , id: {id} }) 
             MERGE (u)-[c:${nodeType}]->(p)`
   	return session.run(pattern, { userId , price, id })
  }
}

module.exports = ProductPersistService