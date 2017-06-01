# Benchmark

This is an environment benchmark, in that it measures the performance of `ctr` against the running environment and not individual use cases. The reason I’m not benching against individual `ctr` cases is because all results are memoized. Is `ctr` “fast”? No, it’s a damn turtle, and you will experience its turtle speed upon booting up your toolchain. For example, it takes around 9 seconds for `ctr` to compile the initial CSS for the documentation which is around 18,000 lines of CSS. However, since every `ctr` style instance is memoized the compile time thereon out is around 800ms which is not too shabby. In fact, creating styles using `ctr` in stylus will almost always compile faster compared to creating those same styles using “native” stylus.


__Benchmark Results__

```bash
~~~~~ Stylus ~~~~~~
  Native Stylus (no ctr) x   210 ops/sec ±2.84% (73 runs sampled)
  Stylus ctr Non-Memoize x 38.89 ops/sec ±7.65% (52 runs sampled)
  Stylus ctr Memoize     x   275 ops/sec ±2.83% (79 runs sampled)

~~~~~ Javascript ~~~~~~
  Non-Memoize x  45.17 ops/sec ±6.83% (58 runs sampled)
  ctr Memoize x 14,369 ops/sec ±5.84% (81 runs sampled)
```
