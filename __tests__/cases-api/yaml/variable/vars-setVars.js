const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  color: 'red',
  'font-size': '200px',
  array: ['.one', '.two'],
  selector: '.testOk',
  obj: {
    on: {
      width: '400px'
    }
  },
  deep: {
    as: {
      the: {
        well: {
          will: {
            go: {
              water: 'blue'
            }
          }
        }
      },
      dirt: 'brown'
    }
  }
});

ctr.yaml('./vars-setVars.yml');

const res = ctr.getRes();

module.exports = {
  res: res
};
