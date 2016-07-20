/**
* @module Seed the Database
*/

'use strict';

/**
* Requires the mongoose-seeder module
* @requires mongoose-seeder
*/
var seeder = require('mongoose-seeder');
/**
* Requires the data.json to use as seed data
* @requires data.json file
*/
var data = require('./data/data.json');

// seed the mongoose / mongodb databse
seeder.seed(data).then(function (dbData) {
  // The database objects are stored in dbData
  console.log('Success!: ' + dbData);
// catch any errors
}).catch(function (err) {
  // handle error
  if (err) {
    console.log(err);
  }
});
