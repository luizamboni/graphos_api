"use strong"

const neo4j = require('neo4j-driver').v1

const { url, user, pass , logger } = require("../../config/persistense")[ENV].neo4j

const driver = neo4j.driver(url, neo4j.auth.basic(user, pass ))

const session = driver.session()
const log = (params) => logger ? logger(params) : null


const Neo4jPersistenceService = {
	cleanDB(){
   	return Neo4jPersistenceService.run(`MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r`)
	},

	run(pattern, params){
    return session.run(pattern, params)
	},

	getRelation(productId, relType, relType2){
    relType2 = (relType2) ? relType2 : relType

    let pattern = `MATCH ()-[:${relType}]->(p:Product {id: { productId }})<-[:${relType}]-(users) 
                    MATCH (users)-[:${relType2}]->(products) 
                    WHERE NOT products.id = {productId}
                    RETURN products`
    let params = { productId } 
    log(pattern, params )
    return Neo4jPersistenceService.run(pattern, params)
    .then( resp => 
      resp.records.map(r => r.get("products").properties  )
    )   
  },

  buildUserNode(userId, productData, relType) {
  	let { price , id } = productData
  	let pattern = `MERGE (u:User {uuid: {userId} }) 
             MERGE (p:Product { price: {price} , id: {id} }) 
             MERGE (u)-[c:${relType}]->(p)`
    let params =  { userId , price, id }
    log(pattern, params )

   	return Neo4jPersistenceService.run(pattern, params)
  }

}

module.exports = Neo4jPersistenceService