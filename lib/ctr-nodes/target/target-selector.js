const StackManager  = require('./target-stack-manager.js');

/*
Hmm so here is the current thought. There are three parts to the selector,
selectorRoot -> before selector, only the rootKey
selector -> the actual selector
selectorAttach -> all the shit that will be attached to selector, the whole show
 */
const targetSelector = {
  setAndGetStack: function (target) {

    //filter out non-porocesses
    target = target.update('stack', function (list) {
      return list.filter(function (map) {
        if (map.get('process')) {
          return true;
        }
      });
    });

    const stackManager = new StackManager(target);
    //cylce set stack
    target.get('stack').forEach(function (dataMap) {
      stackManager.set(dataMap);
    });

    const {
      override,
      selectorCar,
      selectorCdr,
      selectorMedia
    } = stackManager.get();

    return {
      override,
      selectorCar,
      selectorCdr,
      selectorMedia
    };
  },
  compose: function (target) {
    const selector = target.get('selector');
    const {
      override,
      selectorCar,
      selectorCdr,
      selectorMedia
    } = this.setAndGetStack(target);

    if (override) {
      return {
        selectorOverride: true,
        selector: override,
        selectorCar: '',
        selectorCdr: '',
        selectorMedia: ''
      };
    }

    return {
      selector,
      selectorCar,
      selectorCdr,
      selectorMedia
    };
  },
  get: function (target) {
    //pluck
    const selector         = target.get('selector');
    const selectorCar      = target.get('selectorCar');
    const selectorCdr      = target.get('selectorCdr');
    const selectorMedia    = target.get('selectorMedia');
    const selectorOverride = target.get('selectorOverride') || false;
    return {
      selectorCar,
      selector,
      selectorCdr,
      selectorMedia,
      selectorOverride
    };
  }
};

module.exports = targetSelector;
