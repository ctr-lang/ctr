__Description__: If the `raw` option is passed it should return a raw Javascript `Set` with the last set results

__Notes__

+ `getLastResult(reset = false, raw = false)`
+ `getLastResult({reset, raw})`
+ Internally, the non-raw return just `[...map.values()].join('')`
+ Set -> `index: <css string results>`