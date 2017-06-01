const CTR  = require('ctr').js;
const ctr  = new CTR();

//needs to be true since by default you can not
//have duplicate CSS styles in a result

ctr.setOption({
  duplicateCSS: true
});

//should get doublicate style
const res = ctr.create({
  '.test:::part-one': {
    width: '200px',
    height: '200px'
  },
  '.test:::part-two': {
    width: '200px',
    height: '200px'
  }
}).getRes();


module.exports = {
  res: res
};
