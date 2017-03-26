"use strict"
const Promise = require("bluebird")

const { createClient , makeTemplateTag } = require('gremlin')

const { port , host, logger} = require("../../config/persistense")[ENV].gremlin


const client = createClient(port, host, { session: true })
const gremlin = makeTemplateTag(client)

const log = (params) => logger ? logger(params) : null

const TitanPersistenceService = {
 
  cleanDB(){
    let rmAll = `graph.traversal().V().drop().iterate(); 
                 graph.traversal().E().drop(); 
                 graph.tx().commit()`
    return TitanPersistenceService.run(rmAll)
  },

  run(query, params={}){

    log(query)
    return new Promise( (resolve, reject) => 
      client.execute(query, params, (err, results) => { 
        err ? reject(err) : resolve(results) 
      })
    )
  },

  getRelation(productId, relType, relType2){
    relType2 = (relType2) ? relType2 : relType
    let q = `q = g.V().as('h').has('id',${productId}).in('${relType}').out('${relType2}').where(neq('h')).valueMap()`
    return TitanPersistenceService.run(q)
  },

  buildUserNode(userId, productData, relType) {

    let { id } = productData
    let createVertices = `
                 g = graph.traversal();
                 u0 = g.V().has('user_id','${userId}');
                 u1 = (u0.hasNext()) ? u0.next() : graph.addVertex(T.label, 'user', 'user_id' , '${userId}');
                 p0 = g.V().has('id', ${id});
                 p1 = (p0.hasNext()) ? p0.next() : graph.addVertex(T.label, 'product', 'id' , ${id});
                 u1.addEdge('${relType}', p1);
                 `

    return TitanPersistenceService.run(createVertices)
  }
}

module.exports = TitanPersistenceService