__Description__: So this is an intresting option. Through the option object you can specify a `transform` or `yamlTransform` key with a function value which then is wrapped around the prased YAML data before its sent off to be rended. Unlike like `setCallback` or `setTransfom` this `yamlTransform` function is call __before__ the data is sent off the be rendered.

__Notes__

+ While you can set a transform this way you should probs use `setYamlTransform` for a bit more controll
+ `transform(<YAML Object>)` || `yamlTransform(<YAML Object>)`
+ `this` is binded to the instance
