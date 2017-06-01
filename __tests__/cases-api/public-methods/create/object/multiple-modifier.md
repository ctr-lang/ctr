__Description__: Since object keys must be unique and there may be time when you want seperate out your logic a bit you can do so by preprending a modifier onto the end of the selector. Syntax: `<selector>:::[anything]`, what will happen is `:::` and eveything that follows after it will be chopped of leaving only the selector to be processed

__Notes__

+ `ctr(<{data}>, <{option}>)`

```js
<selector>: {
  <data>
}
```

