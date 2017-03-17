"use strong"

module.exports = {
  development: {
    url: "bolt://localhost:7687", 
    user: "neo4j",
    pass:  "test"
  }, 
  test: {
    url: "bolt://localhost:7687", 
    // logger: console.log, 
    user: "neo4j",
    pass:  "test"
  },
  production: {

  }
}
