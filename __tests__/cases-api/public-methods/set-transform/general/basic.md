__Description__: The `setTransform` method allows for the transformation of the results via a function or an array of functions. This allows for a cleaner method of transforming the result data compared to `setCallback`. The function will be passed the result.

```js
function (res) {
  //make your transfomation and return
  return res;
}
```

This is how the transform functions process the data, pretty simple.
```js
res = _.reduce([Transform Functions], function (str, funk) {
  return funk(str);
}, res);
```


__Note__

+ You don't nessicarly need to return the res, and if you don't it will be omited.
+ `this` is binded to the instance
+ `setTransform(<Function>, {reset: false, once: false})`