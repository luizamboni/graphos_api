"use strong"

const request = require("../setup")

const ProductPersistService = require("../../services/product-persist-service")

const cleanDB = () => ProductPersistService.session
                      .run(`MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r`)

describe("ProductPersistService", () => {
	
	describe(".addclickProduct", () => {

	  it("add 3 nodes", function*() {
	    	yield cleanDB()

	  	 yield [
          ProductPersistService.addClickProduct("userIdx", { price: 10.0, id: 10 }),
	  	    ProductPersistService.addClickProduct("userIdx", { price: 10.0, id: 20 }),
	  	    ProductPersistService.addClickProduct("userIdx", { price: 10.0, id: 30 }),

          ProductPersistService.addClickProduct("userId1", { price: 10.0, id: 1 }),
	  	    ProductPersistService.addClickProduct("userId1", { price: 10.0, id: 2 }),
	  	    ProductPersistService.addClickProduct("userId1", { price: 10.0, id: 3 })
       ]
	  })

    it("2 user nodes", function*() {
      let resp = yield ProductPersistService.session.run(`
        MATCH (u:User)
        return u`
      )
      expect(resp.records).to.have.lengthOf(2)
    })
 })

  describe(".clickClickToo", () => {

    let products

    before(function*(){
	     yield cleanDB()

       yield [
         ProductPersistService.addClickProduct("userId2", { price: 10.0, id: 1 }),
         ProductPersistService.addClickProduct("userId2", { price: 10.0, id: 3 }),
         ProductPersistService.addClickProduct("userId3", { price: 10.0, id: 1 })
       ]

       products  = yield ProductPersistService.clickClickToo(1)
    })

    it("who click product 1 click too product 3", () => {
      expect(products).to.have.lengthOf(1)
      expect(products[0].id).to.be.equal(3)
    })
  })

  describe(".whoClickInBuy", () => {
    let products

    before(function*(){
	     yield cleanDB()

       yield [
         ProductPersistService.addClickProduct("userId2", { price: 10.0, id: 1 }),
         ProductPersistService.addClickProduct("userId2", { price: 10.0, id: 3 }),
         ProductPersistService.addClickProduct("userId3", { price: 10.0, id: 1 }),

         ProductPersistService.addBuyProduct("userId2", { price: 10.0, id: 3 }),
         ProductPersistService.addBuyProduct("userId2", { price: 10.0, id: 2 }),
         ProductPersistService.addBuyProduct("userId3", { price: 10.0, id: 1 })
       ]

       products  = yield ProductPersistService.whoClickInBuy(1)
    })

    it("who click product 1 buy [3,2]", () => {
      expect(_(products).pluck("id").sort() ).to.be.eqls([2,3])
    })

  })
})
