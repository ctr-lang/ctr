__Description__: If the `raw` option is passed it should return a raw Javascript `Set` with the set results

__Notes__

+ `getResult(reset = false, raw = false)`
+ `getResult({reset, raw})`
+ Internally, the non-raw return just `[...map.values()].join('')`
+ Set -> `index: <css string results>, ..., ...`