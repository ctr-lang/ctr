__Description__: If a  `string` is used as the `timeline` property rather than a `object` the assumption should be made that the user has already specified said `animation` elsewhere which implyies that the `string` should be used as the `animation-name`, additionaly no `@keyframs` should be created.

__Notes__

+ There is one big caveat here. If you use a Stylus `literal` and its defined as a variable elsewhere in the global scope it will pick-up and utilize that value. So if you wish to use this feature, I would recommend you either always define it as a `string` or just use the `name` key rather than the `timeline` since your intentions may become convoluted.
    + Check out `animation/general/timeline-literal-variable` if you are confused as to what I'm referring about being associated with a variable