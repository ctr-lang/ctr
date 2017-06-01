__Description__: A user should be able to define local private variables for a `ctr` instance through the `$$` object in the typical key/value pair format. The property variables that are declared within the `$$` object then can be referenced throughout the `ctr` instance using the following string syntax: `"$$.<key>"` or `"$$[<key>]"`

Notation
Dot
```
ctr({
  $$: {
    <key1>: <value>
  }
  <key>: '$$.<key1>'
})
```
Bracket
```
ctr({
  $$: {
    <key1>: <value>
  }
  <key>: '$$[<key1>]'
})
```


__Notes__

- When used properly these private variables can be hella powerful since you only need to declare a common or shared varible once and then when you do with to change that variable the change will be reflected thought your `ctr` instance
- For clarity I will be using the dot notation for the rest of these tests