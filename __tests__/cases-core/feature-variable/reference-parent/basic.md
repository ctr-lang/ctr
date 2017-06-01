__Description__: The eval-variable `eval` object is defined in the `$$` local-variable object. The concept behind the `eval` object variables is there are times when the user will need variables to be evaluated and or reference other dynamic variables. All `eval` variables must be wrapped in strings if they reference other variables and they can only reference variables that are declared above their declaration

Notation
```
ctr({
  $$: {
    <key1>: <value>
    eval: {
      <key2>: '<key1>'
    }
  }
  <key>: <key2>
})
```

__Notes__

- This concept as you may have already assumed is limited due to the inherent limitations of Stylus so hopefully I have to opportunity to do a full rewrite to give this concept the justice it deserves. Nevertheless, even with all the limitations, you can do some pretty cool things
- Reference variables can use either use the bracket `$$[<var>]` or dot `$$.<var>` notation
- `eval` variables can only reference variables above their declaration. `eval` variables can even reference other `eval` variable as long as it abids by this syntax
- `eval` variables will overwrite local-variables if they they share the same key
- `eval` variables really shine when it comes to `CtrClass`'s