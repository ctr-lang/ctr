const fs         = require('fs');
const Benchmark  = require('benchmark');
const benchmarks = require('beautify-benchmark');
const stylus     = require('stylus');
const CTR        = require('ctr');
const suite      = new Benchmark.Suite;

//file to test
const ctrTestFile    = fs.readFileSync('__tests__/benchmark/cases/benchmark-ctr-style.styl', 'utf-8');
const stylusTestFile = fs.readFileSync('__tests__/benchmark/cases/benchmark-style.styl', 'utf-8');

//!!!!!! NOTE !!!!!!!!
//jsMemoize is true by defualt and if the results cached
//There is in real reason you would want to disable jsMemoize only to bench
const nonMemoizeInstance = CTR.stylus({jsMemoize: false});
const memoziedInstance   = CTR.stylus();

/**
 * "Native" stylus, not using ctr but the stylus compile results are the same
 * as our ctr bench
 */
suite
.add('Native Stylus (no ctr)', function() {
  const nativeStylus = stylus(stylusTestFile);
  nativeStylus.render(function (err) {
    if (err) {
      throw err;
    }
  });
})
/**
 * ctr stylus, not memozing
 */
.add('Stylus ctr Non-Memoize', function() {
  const nonMemoizeStylus = stylus(ctrTestFile).use(nonMemoizeInstance);
  nonMemoizeStylus.render(function (err) {
    if (err) {
      throw err;
    }
  });
})
/**
 * ctr stylus, memozing
 */
.add('Stylus ctr Memoize', function() {
  const memoizeStylus = stylus(ctrTestFile).use(memoziedInstance);
  memoizeStylus.render(function (err) {
    if (err) {
      throw err;
    }
  });
})
// add listeners
.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('complete', function() {
  console.info('~~~~~ Stylus ~~~~~~');
  benchmarks.log();
}).run();
