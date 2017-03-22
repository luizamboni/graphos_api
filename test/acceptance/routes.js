"use strong"

require("../setup")

// modules
const supertest = require("supertest")
const qs = require("qs")

const ProductPersistService = require("../../services/product-persist-service")
const Neo4jStrategy = require("../../services/persistence/neo4j-persistence-service")


const app = require("../../app")


describe("ROUTES", () => {

  let productPersistService = new ProductPersistService(Neo4jStrategy)

	beforeEach(function*(){
    yield Neo4jStrategy.cleanDB()
  })

	describe("GET /action/view.png", () => {
    let res
    let q = {
      user_id: "111", 
      id: 1,
      price: 15
    }

    before(function*(){
      res = yield supertest(app).get(`/action/view.png?${qs.stringify(q)}`)
    })

    it("responds 202 status", () =>
      expect(res.status).to.be.equal(202)
    )
  })

	describe("GET /action/buy.png", () => {
    let res
    let q = {
      user_id: "111", 
      id: 1,
      price: 15
    }

    before(function*(){
      res = yield supertest(app).get(`/action/buy.png?${qs.stringify(q)}`)
    })

    it("responds 202 status", () =>
      expect(res.status).to.be.equal(202)
    )
  })

  describe("GET /recommend/who-view-view-too", () => {
    let res
    before(function*(){
      yield Neo4jStrategy.cleanDB()

      yield [
         productPersistService.addClickProduct("userId2", { price: 10.0, id: 1 }),
         productPersistService.addClickProduct("userId2", { price: 10.0, id: 3 }),
         productPersistService.addClickProduct("userId3", { price: 10.0, id: 1 }),

         productPersistService.addBuyProduct("userId2", { price: 10.0, id: 3 }),
         productPersistService.addBuyProduct("userId2", { price: 10.0, id: 2 }),
         productPersistService.addBuyProduct("userId3", { price: 10.0, id: 1 })
      ]

      res = yield supertest(app).get("/recommend/who-view-view-too?id=1")

    })

    it("responds 200 status", () =>
      expect(res.status).to.be.equal(200)
    )

    it("respond product with id [3]", () =>
      expect(_(res.body).pluck("id")).to.be.eqls([3])
    )

  })

	describe("GET /recommend/who-view-buy", () => {
    let res
    before(function*(){
      yield Neo4jStrategy.cleanDB()

      yield [
         productPersistService.addClickProduct("userId2", { price: 10.0, id: 1 }),
         productPersistService.addClickProduct("userId2", { price: 10.0, id: 3 }),
         productPersistService.addClickProduct("userId3", { price: 10.0, id: 1 }),

         productPersistService.addBuyProduct("userId2", { price: 10.0, id: 3 }),
         productPersistService.addBuyProduct("userId2", { price: 10.0, id: 2 }),
         productPersistService.addBuyProduct("userId3", { price: 10.0, id: 1 })
       ]   
      res = yield supertest(app).get("/recommend/who-view-buy?id=1")

    })
    it("responds 200 status", () =>
      expect(res.status).to.be.equal(200)
    )

    it("respond product with id [3,2]", () =>{
      expect(_(res.body).pluck("id").sort()).to.be.eqls([2,3])
    })
  })
})