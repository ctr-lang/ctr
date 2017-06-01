__Description__: Oh boy, da bomb.com of ctr features. The basic gist is that the user should be able to assign a `CtrClass` to a Stylus variable and then invoke said `CtrClass` anywhere in their project as long as the `CtrClass` has been declared before the invocation. The syntax is as follows.

---
Initlize class
```
ctrSetClass('<class>', {
  <key>: <value>
})
```
---

---
Impartitive: Invoke (apply) a `CtrClass`
```
<selector>
  ctr({
    extend: {
      class: <Stylus-Varible>
    }
  })
```
---

Declaritive: Invoke (apply) a `CtrClass`
```
ctr(<selector>, {
  extend: {
    class: <Stylus-Varible>
  }
})
```
---


__Notes__

+ Can use the class Literal varble or a String representation
+ Under the hood, all that is happeneing is the `CtrClass` is being added to the `ctr` instance, via the `setClass` method
