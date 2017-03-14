"use strict"

const ProductPersistService = require("../../services/product-persist-service")

describe("ProductPersistService", () => {

  it("add a new click", function*() {
  	try {
  	  let resp = yield ProductPersistService.clickProduct("userId1", { price: 10.0, id: 123456 })
  	} catch(err) {
  	}
  })
})