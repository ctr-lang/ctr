const Benchmark  = require('benchmark');
const benchmarks = require('beautify-benchmark');
const CTR        = require('ctr').js;
const suite      = new Benchmark.Suite;

//!!!!!! NOTE !!!!!!!!
//jsMemoize is true by defualt and if the results cached
//There is in real reason you would want to disable jsMemoize only to bench
const styleNotMemoize = new CTR({
  jsMemoize: false
});
const styleMemoize = new CTR().setOption();

// add tests
suite.add('Non-Memoize', function() {
  styleNotMemoize.create('.test', {
    size: '200px',
    background: 'green',
    hover: {
      on: {
        color: 'red',
        'font-size': '10px',
        before: {
          conent: 'speed',
          size: '100px'
        }
      },
      non: {
        color: 'purple',
        'font-size': '8px',
        media: {
          '-sm': {
            'font-size': '8px'
          },
          '+lg': {
            'font-size': '20px'
          }
        }
      }
    }
  });
  const res = styleNotMemoize.getRes();
})
.add('ctr Memoize', function() {
  styleMemoize.create('.test', {
    size: '200px',
    background: 'green',
    hover: {
      on: {
        color: 'red',
        'font-size': '10px',
        before: {
          conent: 'speed',
          size: '100px'
        }
      },
      non: {
        color: 'purple',
        'font-size': '8px',
        media: {
          '-sm': {
            'font-size': '8px'
          },
          '+lg': {
            'font-size': '20px'
          }
        }
      }
    }
  });
  const res = styleMemoize.getRes();
})
// add listeners
.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('complete', function() {
  console.info('~~~~~ Javascript ~~~~~~');
  benchmarks.log();
}).run();
