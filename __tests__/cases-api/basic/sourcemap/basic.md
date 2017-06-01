__Description__: Should be able to gen sourcemaps comment ref. But... and here is the big but, while the souce map will give you the file for the style in question the refferance will point back to ctr.styl. Further, I actually recomend you do NOT use sourcemaps and if you do it will hinder your "ctr" ablities signifigantly. You want to be looking at the compiled CSS not the ctr source code becuase if you get into a situation in which you need to debug ctr styles the most pertinent asset is the raw CSS.

__Notes__

+ Rather than using sourcempas buy another screen, it's a better alternative
+ Each style creates its own source map, and if you want to do this properly you will have to use a custom callback to get acsess to the sourcemap info which is located on the stylus ref, the third callback argument. `style.sourcemap`
+ http://stylus-lang.com/docs/sourcemaps.html