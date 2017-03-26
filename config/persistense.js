"use strong"

module.exports = {
  development: {
    gremlin: {
      host: "localhost",
      port: 8182
    },
    neo4j: {
      url: "bolt://localhost:7687", 
      user: "neo4j",
      pass:  "test"
    },
    orient: {
      database: {
        name: "recommend_development"
      },
      server: {
        host:     "localhost",
        port:     2424,
        username: "root",
        password: "pwd",
        useToken: true
      }
    }
  }, 
  test: {
    gremlin: {
      // logger: console.log, 
      host: "localhost",
      port: 8182
    },    
    neo4j: {
      url: "bolt://localhost:7687", 
      user: "neo4j",
      pass:  "test"
    },
    orient: {
     // logger: console.log,
     database: {
       name: "recommend_test"
     },
     server: {
       host:     "localhost",
       port:     2424,
       username: "root",
       password: "pwd",
       useToken: true
     }
    }
  },
  production: {

  }
}
