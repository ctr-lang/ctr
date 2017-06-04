# `ctr` /// The CSS Framework

[![npm](https://img.shields.io/npm/l/ctr.svg)](https://github.com/ctr-lang/ctr/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/ctr.svg)](https://www.npmjs.com/package/ctr)
[![wercker status](https://app.wercker.com/status/84c092950c198fdbb5507431dd9f77f5/s/master "wercker status")](https://app.wercker.com/project/byKey/84c092950c198fdbb5507431dd9f77f5)
[![David](https://img.shields.io/david/ctr-lang/ctr.svg)](https://github.com/ctr-lang/ctr/blob/master/package.json)


<p align="center">
  <img src="https://cdn.rawgit.com/ctr-lang/ctr/ca577675/ctr-logo.svg" width="256">
</p>


## Description

There are many words you can read in the [documentation](https://docs.ctr-lang.com/) that detail what, why, and how, but I’ll give a brief overview. `ctr` is a CSS framework built with JavaScript to provide object oriented functionality to allow for a rich hierarchy of inherited CSS components to better facilitate a CSS architecture similar to [OOCSS](https://github.com/stubbornella/oocss/wiki). Albeit `ctr` and OOCSS differ vastly in application and you construct your CSS in `ctr` using true objects which allows for `ctr` to be constructed in [YAML](http://yaml.org/), JavaScript, and [Less](http://lesscss.org/). Although `ctr` shares the same goal of OOCSS - encouraging code reuse as well as maintainable CSS styles.

The object oriented architecture of `ctr` also allows for a rich hierarchy of inherited CSS components so that it’s not required to list each class in your HTML every single time. A functionality that is encompassed through the [class](https://docs.ctr-lang.com/class/general/) feature of `ctr`. An idea presented by [Philip Walton](philipwalton.com/about/) and his article [The Future of OOCSS: A Proposal](https://philipwalton.com/articles/the-future-of-oocss-a-proposal/). However, to accomplish this, there has to be a supporting framework, and that is what `ctr` and all its various features provide.

My favorite feature of `ctr` is its ability to abstract away the tedium and pain-points from creating complex CSS logic for pseudo-classes such as `hover`, `focus`, and `active`. All you need to do is list the CSS properties and values in the [state](https://docs.ctr-lang.com/state/general/) object, and `ctr` automatically configures the proper pseudo-class and the corresponding negation CSS pseudo-class (`:not()`). It also configures the `transition-property`, `transition-duration`, `transition-delay`, and `transition-timing-function` for all CSS properties. Furthermore, `ctr` provides similar abstractions for [animation](https://docs.ctr-lang.com/animation/general/), [elements](https://docs.ctr-lang.com/element/general/) such as `before` and `after`, as well as [media queries](https://docs.ctr-lang.com/media/general/), and much much more.

Finally, `ctr` comes pre-packed with some of the best CSS libraries such as:
+ Animate.css for animation presets
    * [Library website](https://daneden.github.io/animate.css/)
    * [Documentation](https://docs.ctr-lang.com/animation/animate.css/)
+ LostGrid for a grid framework
    * [Library website](http://lostgrid.org/)
    * [Documentation](https://docs.ctr-lang.com/grid/general/)
+ Responsive text for creating responsive type - `font-size`, `line-height`, and `letter-spacing`
    * [Library website](https://github.com/seaneking/postcss-responsive-type)
    * [Documentation](https://docs.ctr-lang.com/helpers/responsive-text/)
+ Rupture for easy media queries
    * [Library website](http://jescalan.github.io/rupture/)
    * [Documentation](https://docs.ctr-lang.com/media/mixin/)
+ Hover.css for state presets
    * [Library website](http://ianlunn.github.io/Hover/)
    * [Documentation](https://docs.ctr-lang.com/state/hover.css/)
+ CSSgram for image preset filters
    * [Library website](https://una.im/CSSgram/)
    * [Documentation](https://docs.ctr-lang.com/helpers/filter/)
+ Family.scss - :nth-child helpers
    * [Library website](http://lukyvj.github.io/family.scss/)
    * [Documentation](https://docs.ctr-lang.com/element/nth-key/)


## Status

As I've outlined over at [ctr-lang.com](https://ctr-lang.com) and in the [documentation](https://docs.ctr-lang.com), the code base is extended way past its means. <s>That being said, the hope is that I'll be able to secure funding to embark on a rewrite from the ground up.</s> At the same time, things are pretty solid, so it goes without saying I believe and hope it will be nothing but smooth sailing for you as well.


## Bugs & Contributions

I'm on the fence as to how I want to handle bug and contributions, but I'll lay down my current thoughts. I initially had hoped to raise funding for a rewrite but that obviously was wishful thinking, although, not all is lost because the code base is workable up to a point. I'll gladly spend the time fixing bugs if they warrant the time. However, if it's a complex edge case I doubt I will spend the time. So if you think it warrants my time and yours by all accounts, please pull an issue.


## Structure

For the time being, all `ctr` assets reside under this repository, that is the, Stylus plugin, Less plugin, YAML API, and the JavaScript API. Hopefully, the rewrite will materialize, and if that's the case, I'll separate assets out to create a much cleaner structure.


+ `/lib` -> Allz the magic
    * `ctr-stylus.js` -> Stylus Plugin Logic
    * `ctr-less.js` -> Less Plugin Logic
    * `ctr-js.js` -> Js API class constructor
    * `/ctr-js-nodes` -> All Js methods for the `ctr-js.js` class
    * `/ctr-js-nodes` -> The actual logic behind `ctr`
+ `/dist`
    * `ctr.styl` -> The most important file, which is both embarrassing and impressive in its own right. This Stylus file contains two Stylus Functions that act as a janky templating solution to provide the proper syntactical structure. Along the lines of mustache but for CSS. Removing this file; thus the Stylus dependency is one of the main reasons for the rewrite.
+ `__tests__` -> Allz the test, and it has it's own `README.md`


---

Best, te
