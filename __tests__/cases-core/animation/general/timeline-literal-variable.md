__Description__: Due to the lovely nature of Stylus the user should be able to specify `variables` which are outside a specific `ctr` instance.

__Notes__

+ While it's best practice to encapsulate variables via a `CtrClass` and then `extend` that class within a `ctr` instance this methodology does give you some flexibility. 
    + *Global Stylus variables are just like global Javascript variables in that you should not use them but I'm not your mother so do as you please.
