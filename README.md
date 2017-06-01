# `ctr` /// The CSS Framework

[![npm](https://img.shields.io/npm/l/ctr.svg)](https://github.com/ctr-lang/ctr/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/ctr.svg)](https://www.npmjs.com/package/ctr)
[![wercker status](https://app.wercker.com/status/db6eee30ce78421dbd53da4bfc319364/s/master "wercker status")](https://app.wercker.com/project/byKey/db6eee30ce78421dbd53da4bfc319364)
[![David](https://img.shields.io/david/ctr-lang/ctr.svg)](https://github.com/ctr-lang/ctr/blob/master/package.json)


<p align="center">
  <img src="https://cdn.rawgit.com/ctr-lang/ctr/ca577675/ctr-logo.svg" width="256">
</p>


## Description

There are many words you can read in the [documentation](https://docs.ctr-lang.com/) that detail what, why, and how so I'll spare the keystrokes. In short, `ctr` is a new kind of CSS framework that leverages an Objects oriendated structure to make CSS'ing righteous.

## Status

As I've outlined over at [ctr-lang.com](https://ctr-lang.com) and in the [documentation](https://docs.ctr-lang.com), the code base is extended way past its means. That being said, the hope is that I'll be able to secure funding to embark on a rewrite from the ground up. At the same time, things are pretty damn solid, or at least things have been damn solid in my exclusive use of `ctr` over the past year or so. So it goes without saying I believe and hope it will be nothing but smooth sailing for you as well.

## Code Base

On all accounts, the code base is in relatively good shape all things considered. However, the fact is, when I started `ctr` I barely knew how to JavaScript let alone general programming concepts. I had a single goal, finish the first public rendition, the MVP.

The code base is riddled with anti-patterns, and the core data structure is a patchwork abomination. The style is all over the place with a pinch of functional-ish. It's glued together with a program called [teFlow](https://github.com/artisin/teFlow) that I developed during the infancy of development that may look questionable from the outside, but I can’t knock it because it works like a beautiful gem.

I could go on, but the point this code base would be best described as one big learning from ground zero. At the time I didn't know better, and I did my best every step of the way. To add — I went into this endeavor with the hopes that I would be able to re-write `ctr` with a better understanding of what I wanted to accomplished from a high-level perspective. And now that opportunity is here, and hopefully, I will have the chance to deliver a polished version of `ctr`. If you want to support `ctr` and the rewrite you can do so by investing in a token subscription and you can read about it and get one [here](https://docs.ctr-lang.com/start-here/token/).

At the end of the day, I’m a testament to the make-it-fucking-work philosophy. Never in a million years did I think I could develop something of this scope or size. I started off my coding career with the goal of being able to build a website with some fancy transitions and animations. In fact, when I look back at my daily logs there was a time when I thought I would never even be able to do that. Everything confused and overwhelmed me; there was just so much it and made me feel hopeless. But step by step I journeyed up this code mountain and I can confidently say, sticking with it was the best decision I ever made.

The next step of this journey is to travel across the sea to fantasy land where rainbows, monoids, unicorns, and functors roam free.

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


## `ctr`, Stylus, and the Future

Stylus is painfully slow, and it’s an unfortunate bottleneck. With the rewrite, `ctr` will no longer be dependent on Stylus for the syntactical structure which will make it faster, but it won’t solve the Stylus bottleneck. Back in 2015, there was [talk about](https://github.com/stylus/stylus/wiki/1.0.0) a 1.0.0 Stylus release, but after haggling with the Stylus code base, in my opinion, it’s past repair.

So the question arises whether or not the `ctr` paradigm warrants a new Stylus-YAML-like pre-processor environment. Because Stylus is not built for `ctr`, it just works with `ctr`. Accordingly, I believe `ctr` does warrant a new environment, but as to the direction, I’m a bit conflicted. Rather than sharing my thoughts I’m looking for your thoughts. I will say the focus should be on building an environment to better leverage `ctr` and that I believe there’s two distinct directions, Stylus-like or YAML-like.

The hope is `ctr` generates enough revenue to streamline the process of building a new pre-processor or augmented CSS environment. Ideally, the target investment is in the $10,000 - $30,000 range to a single individual or small group of no more than three. Moreover, for the most part, I’ll just throw money at you and be hands-off, although I’m open to all ideas at this point.

If this is something that sounds enticing, you have the skill set, have the time, and are up to the challenge then you’re my ze. I’m going to go out on a limb and visualize that `ctr` gets off to a hella successful first two weeks, and by week four/five, I’ll be reviewing applications, thoughts, and ideas so that by week six/seven you can start building the next pre-processor. If `ctr` gets off to a lackluster start and doesn’t surpass the funding goal, well then, meh, I have to start reviewing my personal employment options and not yours. (Fingers crossed it’s not the latter)

Rather than creating an application, I’m leaving this open to you. Shoot me your thoughts/ideas at `TheNextPreprocessor@ctr-lang.com`, create a video, start a public conversation on the forums, or whatever. It’s up to you - do you. Keep in mind, this whole "kickstart" "funding" idea could blow up in my face and if that's the case well, that sucks, for me and you.



---

Best, te
