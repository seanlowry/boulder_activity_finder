var express = require("express")
var app = express()
var bodyParser = require("body_parse")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

var pgp = require('pg-promise')();
