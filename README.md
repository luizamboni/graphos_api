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

```sql
> CREATE Class User extends V;
> CREATE Class Product extends V;
```

5) create Edges classes Click, Buy and View

```sql
> CREATE Class Click extends E;
> CREATE Class Buy extends E;
> CREATE Class View extends E;

```

6) Examples

create Vertice

```sql
> INSERT INTO User SET name = "test";
```

create Edge

```sql
> CREATE EDGE Buy FROM #10:3 TO #11:4
```

update

```sql
> UPDATE User SET name = "test" WHERE user_id = 1;
```

update with upsert

```sql
> UPDATE User SET user_id = 1 UPSERT WHERE user_id = 1;
```