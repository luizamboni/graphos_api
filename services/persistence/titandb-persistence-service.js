"use strict"

const { createClient , makeTemplateTag } = require('gremlin')

const client = createClient()
const gremlin = makeTemplateTag(client)

// client.execute('tx=graph.newTransaction();tx.addVertex(T.label,"product","id",991);tx.commit()', {}, (err, results) =>{
//   if (err) {
//     return console.error(err)
//   }
//   console.log(results)
// })

// client.execute('g.V().has("id")', {}, (err, results) => { console.log(err); console.log(results) }) 

const TitanPersistenceService = {

  cleanDB(){

  },

  run(query, params={}){

  },

  getRelation(productId, relType, relType2){

  },

  buildUserNode(userId, productData, relType) {

    let ins = `u = graph.addVertex(label, "user", user_id, "${userId}");`
    ins += `p = graph.addVertex(label, "product", id, "${productData.id}");`
    ins += `u.addEdge("${relType}",p);`
    return gremlin(ins)
  }
}

module.exports = TitanPersistenceService