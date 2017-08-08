"use strong"

class ProductPersistService {
  
  constructor(adapterService) {
    this.adapterService = adapterService
  }

  run(pattern, params){
    return this.adapterService.run(pattern, params)
  }

  clickClickToo(productId){
    return this.adapterService.getRelation(productId, "click")
  }

  whoClickInBuy(productId){
    return this.adapterService.getRelation(productId, "click", "buy")
  }

  addViewProduct(userId, productData) {
    return this.adapterService.buildUserNode(userId, productData, "view")
  }

  addBuyProduct(userId, productData) {
    return this.adapterService.buildUserNode(userId, productData, "buy")
  }

  addClickProduct(userId, productData) {
    return this.adapterService.buildUserNode(userId, productData, "click")
  }
}

module.exports = ProductPersistService
