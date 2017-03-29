"use strong"

process.env.NODE_ENV = "test"
global.ENV = process.env.NODE_ENV 
global._ = require("underscore")
global.expect = require("chai").expect