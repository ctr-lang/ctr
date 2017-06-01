__Description__: A `animation` should be able to be defined using a the following hyphenated key notation: `animation-<timeline name>: {}`. If there's no `name` value/pair specified within the `animation` `object` then assume that the user wants to use the hyphenated value as their `animation-name`.

__Notes__

+ For reference, the `animation-` part of the key will just be chopped off and what's remaining will be used as the `animation-name` if one is not specified
+ Regex key: `/^animation-/i`