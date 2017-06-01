__Description__: The `setYamlTransform` method allows for the transformation of the YAML data once its parsed and before its sent off to be rendered. This mehtod accepts a Function or an Array of Functions.

```js
function (yamlObj) {
  //make your transfomation and return
  return yamlObj;
}
```

This is how the transform functions process the data, pretty simple.
```js
yamlObj = _.reduce([Transform Functions], function (obj, funk) {
  return funk(obj);
}, yamlObj);
```


__Note__

+ This differs from `setTransform` in that it alters the data before its rendered with `setTransform` transforms the data after
+ You don't nessicarly need to return the res, and if you don't it will be omited.
+ `this` is binded to the instance
+ `setYamlTransform(<Function>, {reset: false, once: false})`