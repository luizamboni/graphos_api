"use strict"
const Promise = require("bluebird")

const { createClient , makeTemplateTag } = require('gremlin')

const client = createClient()
const gremlin = makeTemplateTag(client)

// const log = (params) => logger ? logger(params) : null


const log = (params) => console.log(params)

// client.execute('tx=graph.newTransaction();tx.addVertex(T.label,"product","id",991);tx.commit()', {}, (err, results) =>{
//   if (err) {
//     return console.error(err)
//   }
//   console.log(results)
// })

// client.execute('g.V().has("id")', {}, (err, results) => { console.log(err); console.log(results) }) 

const TitanPersistenceService = {

  cleanDB(){
    return TitanPersistenceService.run("g.V().drop(); g.E().drop()")
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

  },

  buildUserNode(userId, productData, relType) {

    let createVertices = `u0 = g.V().has('user_id', '${userId}');
                 u1 = (u0.hasNext()) ? u0.next() : graph.addVertex(label, 'user', 'user_id', '${userId}');
                 p0 = g.V().has('id', '${productData.id}');
                 p1 = (p0.hasNext()) ? p0.next() : graph.addVertex(label, 'product', 'id', '${productData.id}');`
    // createVertices += `u1.addEdge('${relType}', p1); graph.tx().commit()`

    return Promise.all(
      TitanPersistenceService.run(createVertices)
    ).then(() => {
      // return 
      let ins = `u = g.V().has('user_id', '${userId}').next();
                 p = g.V().has('id', '${productData.id}').next()
                 u.addEdge('${relType}', p);`
      return TitanPersistenceService.run(ins)
    })
  }
}

module.exports = TitanPersistenceService