const _        = require('lodash');
const throwErr = require('./element-module-errors.js');


const familyHelper = {

  /**
   * Error checker
   */
  argCheck (args, aNum, errArg, raw) {
    if (args.length !== aNum) {
      throwErr('family-args', {
        raw: raw,
        exp: errArg
      });
      return false;
    }
    if (!_.every(args, Number)) {
      throwErr('format', {
        raw: raw,
        exp: errArg
      });
      return false;
    }
    return true;
  },

  /**
   * Extracts and formats string args
   */
  extractArg (key, reg, aNum, errArg) {
    const raw = key;
    key = key.replace(reg, '');
    key = key.replace(/\)$/, '');
    key = key.match(/,/g) ? key.split(',') : [key];
    //short
    if (errArg === false) { return key; }
    key = _.map(key, function (val) {
      return Number.parseInt(val);
    });
    if (!this.argCheck(key, aNum, errArg, raw)) {
      return null;
    }
    return key;
  },


  //Select all children from the first to "n"
  first (key, reg) {
    const args = this.extractArg(key, reg, 1, 'first(num)');
    if (!args) { return null; }
    const arg = args[0];
    if (arg === 1) {
      return 'first-child';
    }
    return `nth-child(-n+${arg})`;
  },

  //Select all children from the last to **n**
  last (key, reg) {
    const args = this.extractArg(key, reg, 1, 'last(num)');
    if (!args) { return null; }
    return `nth-last-child(-n+${args[0]})`;
  },

  //Select all children after the first to **n**
  afterFirst (key, reg) {
    const args = this.extractArg(key, reg, 1, 'after-first(num)');
    if (!args) { return null; }
    return `nth-child(n+${args[0] + 1})`;
  },

  //Select all children before **n** from the last
  fromEnd (key, reg) {
    const args = this.extractArg(key, reg, 1, 'from-end(num)');
    if (!args) { return null; }
    return `nth-last-child(${args[0]})`;
  },

  //Select all children between **first** and **last**
  between (key, reg) {
    const args = this.extractArg(key, reg, 2, 'between(first, last)');
    if (!args) { return null; }
    return `nth-child(n+${args[0]}):nth-child(-n+${args[1]})`;
  },

  //Select all even children between **first** and **last**.
  evenBetween (key, reg) {
    const args = this.extractArg(key, reg, 2, 'even-between(first, last)');
    if (!args) { return null; }
    return `nth-child(even):nth-child(n+${args[0]}):nth-child(-n+${args[1]})`;
  },

  //Select all odd children between **first** and **last**
  oddBetween (key, reg) {
    const args = this.extractArg(key, reg, 2, 'odd-between(first, last)');
    if (!args) { return null; }
    return `nth-child(odd):nth-child(n+${args[0]}):nth-child(-n+${args[1]})`;
  },

  //Select all **n** children between **first** and **last**
  nBetween (key, reg) {
    const args = this.extractArg(key, reg, 3, 'n-between(num, first, last)');
    if (!args) { return null; }
    return `nth-child(${args[0]}n):nth-child(n+${args[1]}):nth-child(-n+${args[2]})`;
  },

  //Select all children but **n**
  allBut (key, reg) {
    const args = this.extractArg(key, reg, 1, 'all-but(num)');
    if (!args) { return null; }
    return `not(:nth-child(${args[0]}))`;
  },

  //Select children each **n**
  each (key, reg) {
    const args = this.extractArg(key, reg, 1, 'each(num)');
    if (!args) { return null; }
    return `nth-child(${args[0]}n)`;
  },

  //Select children each **n**
  every (key, reg) {
    const args = this.extractArg(key, reg, 1, 'every(num)');
    if (!args) { return null; }
    return `nth-child(${args[0]}n)`;
  },

  //Select the **n** child from the start and the **n** child from the last
  fromFirstLast (key, reg) {
    const args = this.extractArg(key, reg, 1, 'from-first-last(num)');
    if (!args) { return null; }
    return [`nth-child(${args[0]})`, `nth-last-child(${args})`];
  },

  //Select the item in the middle of **n** child.
  //Only works with odd number chain.
  middle (key, reg) {
    const args = this.extractArg(key, reg, 1, 'middle(num)');
    if (!args) { return null; }
    return `nth-child(${Math.round(args[0] / 2)})`;
  },

  //Select all children between the **n** first and the **n** last
  allButFirstLast (key, reg) {
    const args = this.extractArg(key, reg, 1, 'all-but-first-last(num)');
    if (!args) { return null; }
    return `nth-child(n+${args[0]}):nth-last-child(n+${args[0]})`;
  },

  //This I/O mixin will only select the first of **x** items.
  //It will not work if there is not as much as item as you set in **$limit**
  firstOf (key, reg) {
    const args = this.extractArg(key, reg, 1, 'first-of(limit)');
    if (!args) { return null; }
    return `nth-last-child(${args[0]}):first-child`;
  },

  //This I/O mixin will only select the last of **x** items.
  //It will not work if there is not as much as item as you set in **$limit**
  lastOf (key, reg) {
    const args = this.extractArg(key, reg, 1, 'last-of(limit)');
    if (!args) { return null; }
    return `nth-of-type(${args[0]}):nth-last-of-type(1)`;
  },

  //Select all even children
  even () {
    return 'nth-child(even)';
  },

  //Select all odd children
  odd () {
    return 'nth-child(odd)';
  },

  //Select only the first and last child
  firstLast () {
    return ['first-child', 'last-child'];
  },

  //Will only select the child if it's unique
  unique () {
    return 'only-child';
  },

  //Will only select the child if it's unique
  only () {
    return 'only-child';
  },

  //Will only select children if they are not unique.
  //Meaning if there is at least 2 children, the style is applied.
  notUnique () {
    return 'not(:only-child)';
  }

  //https://github.com/nusu/family.styl/blob/master/source/family.styl#L173

  // childIndex (key, reg) {
  //   const args = this.extractArg(key, reg, 3, false);
  //   if (!args || args.length === 0) { return null; }
  //   const num = Number.parseInt(args[0]);
  //   const dir = args[1] || 'forward';
  //   const ind = Number.parseInt(args[2]) || 1;

  //   const childElm = [];
  //   for (let i = 0; i < num; i++) {
  //     childElm.push(dir === 'forward'
  //                   ? `nth-child(${i + ind})`
  //                   : `nth-last-child(${i + ind})`
  //     );
  //   }
  //   return childElm;
  // }

  //child-index

  //meh, this HAS to be inside a componed to work
  //or index.... hmm... is it work it? probs

  //thoughts. ||| or just make the user specify parent
  // 1. need to get parent selector
  // 2. need to set selector if inherit with stylus.selectorStack index.js
  // 2a. if -> target.get('stack').last().get('type') === selector stack
  // 3.  target.get(target.get('stack').last().get('type')).last().toJS()
  //

  // fm-at-least(num)
  // fm-at-most(num)
  // fm-in-between(minimum, maximum)
};

module.exports = familyHelper;
