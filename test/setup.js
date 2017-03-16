

global.rmAllNodes = () => `MATCH (n)
OPTIONAL MATCH (n)-[r]-()
DELETE n,r`

global.expect = require("chai").expect