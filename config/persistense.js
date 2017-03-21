"use strong"

module.exports = {
  development: {
    neo4j: {
      url: "bolt://localhost:7687", 
      user: "neo4j",
      pass:  "test"
    }
  }, 
  test: {
    neo4j: {
      url: "bolt://localhost:7687", 
      user: "neo4j",
      pass:  "test"
    }
  },
  production: {

  }
}
