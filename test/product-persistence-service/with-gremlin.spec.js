"use strong"

require("../setup")
const sleep = require('sleep')

const ProductPersistService = require("../../services/product-persist-service")
const titanStrategy = require("../../services/persistence/titandb-persistence-service")


describe("ProductPersistService", () => {

  context("with Gremlin for Titandb", () => {
    
    let productPersistService = new ProductPersistService(titanStrategy)
    
    describe(".addclickProduct", () => {

      before(function*() {
        yield titanStrategy.cleanDB()

        yield [
          productPersistService.addClickProduct("userIdx", { price: 10.0, id: 10 }),
          productPersistService.addClickProduct("userIdx", { price: 10.0, id: 20 }),
          productPersistService.addClickProduct("userIdx", { price: 10.0, id: 30 }),

          productPersistService.addClickProduct("userId1", { price: 10.0, id: 1 }),
          productPersistService.addClickProduct("userId1", { price: 10.0, id: 2 }),
          productPersistService.addClickProduct("userId1", { price: 10.0, id: 3 })
        ]

      })

      it.only("2 user nodes", function*() {

        let nodes = yield titanStrategy.run(`g.V().hasLabel("user").valueMap()`)
        debugger
        expect(nodes).to.have.lengthOf(2)
      })
   })

    describe(".clickClickToo", () => {

      let products

      before(function*(){
         yield titanStrategy.cleanDB()

         yield [
           productPersistService.addClickProduct("userId2", { price: 10.0, id: 1 }),
           productPersistService.addClickProduct("userId2", { price: 10.0, id: 3 }),
           productPersistService.addClickProduct("userId3", { price: 10.0, id: 1 })
         ]

         products  = yield productPersistService.clickClickToo(1)
      })

      it("who click product 1 click too product 3", () => {
        expect(products).to.have.lengthOf(1)
        expect(products[0].id).to.be.equal(3)
      })
    })

    describe(".whoClickInBuy", () => {
      let products

      before(function*(){
         yield titanStrategy.cleanDB()

         yield [
          productPersistService.addClickProduct("userId2", { price: 10.0, id: 1 }),
          productPersistService.addClickProduct("userId2", { price: 10.0, id: 3 }),
          productPersistService.addClickProduct("userId3", { price: 10.0, id: 1 }),

          productPersistService.addBuyProduct("userId2", { price: 10.0, id: 3 }),
          productPersistService.addBuyProduct("userId2", { price: 10.0, id: 2 }),
          productPersistService.addBuyProduct("userId3", { price: 10.0, id: 1 })
        ]

         products  = yield productPersistService.whoClickInBuy(1)
      })

      it("who click product 1 buy [3,2]", () => {
        expect(_(products).pluck("id").sort() ).to.be.eqls([2,3])
      })
    })
  })
})
