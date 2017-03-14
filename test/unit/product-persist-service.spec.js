"use strict"

const ProductPersistService = require("../../services/product-persist-service")

describe("ProductPersistService", () => {
	
	before(function*(){
		ProductPersistService
		.session
		.run(`MATCH (n)
					OPTIONAL MATCH (n)-[r]-()
					DELETE n,r`)
	})

	describe(".addclickProduct", () => {

	  it(".addclickProduct", function*() {
	  	 let resp = yield ProductPersistService.addclickProduct("userId1", { price: 10.0, id: 123456 })
	  })
	})
})