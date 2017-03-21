"use strong"

const request = require("../setup")

const OrientDBPersistenceService = require("../../services/persistence/orientdb-persistence-service")


describe("OrientDBPersistenceService", () => {

  
  describe(".addclickProduct", () => {

    it("add 3 nodes", function*() {
      yield OrientDBPersistenceService.cleanDB()

      let res = yield OrientDBPersistenceService.buildUserNode("userIdx", { price: 10.0, id: 10 }, "buy")
      debugger
    })
  })
})
