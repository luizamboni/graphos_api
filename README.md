Graphos recommedation
===

this project is a study from avaible graph persistenses to build a recomendation with express


# Coreved
 - Neo4j 
 - OrientDB (to implement)
 - Titan (to implement)

# Neo4j
  - build on jvm
  - not have TTL resource
  - not have resource to work with date
  - cypher query language


# OrientDB
  - xml configs
  - need define schema
  - lightweight edges (optional)
 

Config

1) open file **$ORIENTDB_HOME/config/orientdb-server-config.xml**
and add this user for development purpouse

```xml
<users>
  <user name="root" password="pwd" resources="*" />
</users>
``` 

2) open in browser
**http://localhost:2480**


3) create a database **recommend_test** and also **recommend_development**
  type => graph
  local

4) create Vertices classes User and Product

5) create Edges classes click, buy and view