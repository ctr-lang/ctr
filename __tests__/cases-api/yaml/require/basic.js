const fs   = require('fs');
const path = require('path');
const CTR  = require('ctr').js;
const exp  = fs.readFileSync(path.join(__dirname, 'basic.css'), 'utf-8');
const ctr  = new CTR();

//need to use all-require-extention to properly require a yaml file
require('require-yaml');
//require file
const yamlFile = require('./basic.yml');

//The yaml method is not used here since the require
//yaml file is already parsed and in an object format
const style = ctr.create(yamlFile).getResult();

module.exports = {
  res: style,
  exp: exp
};
