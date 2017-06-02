# `ctr` /// The CSS Framework

[![npm](https://img.shields.io/npm/l/ctr.svg)](https://github.com/ctr-lang/ctr/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/ctr.svg)](https://www.npmjs.com/package/ctr)
[![wercker status](https://app.wercker.com/status/84c092950c198fdbb5507431dd9f77f5/s/master "wercker status")](https://app.wercker.com/project/byKey/84c092950c198fdbb5507431dd9f77f5)
[![David](https://img.shields.io/david/ctr-lang/ctr.svg)](https://github.com/ctr-lang/ctr/blob/master/package.json)


<p align="center">
  <img src="https://cdn.rawgit.com/ctr-lang/ctr/ca577675/ctr-logo.svg" width="256">
</p>


## Description

There are many words you can read in the [documentation](https://docs.ctr-lang.com/) that detail what, why, and how so I'll spare the keystrokes. In short, `ctr` is a new kind of CSS framework that leverages an Objects oriendated structure to make CSS'ing righteous.

## Status

As I've outlined over at [ctr-lang.com](https://ctr-lang.com) and in the [documentation](https://docs.ctr-lang.com), the code base is extended way past its means. That being said, the hope is that I'll be able to secure funding to embark on a rewrite from the ground up. At the same time, things are pretty damn solid, or at least things have been damn solid in my exclusive use of `ctr` over the past year or so. So it goes without saying I believe and hope it will be nothing but smooth sailing for you as well.


## Bugs & Contributions

I'm on the fence as to how I want to handle bug and contributions, but I'll lay down my current thoughts. Assuming I'm able to secure funding I'll be embarking on a rewrite, and if that's the case, outside of major bugs, there's no reason for both of us to spend time chasing them. The same can be said about contributions since I'll be throwing away this whole code base more or less. Nonetheless, need be I'll gladly spend the time fixing bugs if they warrant the time. So if you think it warrants my time and yours by all accounts, please pull an issue.


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
