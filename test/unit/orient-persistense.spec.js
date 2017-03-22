"use strong"

const request = require("../setup")

const OrientDBService = require("../../services/persistence/orientdb-persistence-service")


describe("OrientDBPersistenceService", () => {

  
  describe(".addclickProduct", () => {

    before(function*() {
      yield OrientDBService.cleanDB()

      yield [
        OrientDBService.buildUserNode("userId1", { price: 2.0, id: 10 }, "buy"),
        OrientDBService.buildUserNode("userId1", { price: 1.0, id: 11 }, "buy")
      ]
    })

    it("1 user node", function*() {
      let resp = yield OrientDBService.run("SELECT FROM User")
      expect(resp).to.have.lengthOf(1)
    })

  })
})
