const _         = require('lodash');
const defclass  = require('defclass');
const Immutable = require('immutable');
const throwErr  = require('./target-errors.js');
const _M        = require('../manager/manager-index.js');


const StackManager = defclass({
  constructor: function (target) {
    const self = this;
    //set list
    self.car      = Immutable.List();
    self.cdr      = Immutable.List();
    self.media    = Immutable.List();
    self.override = Immutable.List();
    //set refs
    self.target = target;
    self.appendToIndex = false;
    self.attachToOption = false;
    self.stackSize = target.get('stack').size;
    self.inheritSelector = _M._option.getIn(['inheritSelector']);
    //swap keys when we are checking key order
    self.elmNotSwap = ['after', 'before', 'first-letter', 'first-line', 'selection',
    'backdrop', 'placeholder', 'marker', 'spelling-error', 'grammar-error'];
  },

  /**
   * Wrapper to see if last in statck
   * @return {bln} -> Only sith lords deal in absolutes
   */
  isLastStack: function () {
    const self = this;
    return self.cdr.size === (self.stackSize - 1);
  },

  /**
   * Configs media, with one catch. If there is more than one media, as in
   * if there is a media within a media we will want to `and` that shit
   * together.
   * @param  {str} curMedia -> current Media
   * @param  {str} newMedia -> new Media
   * @return {str}          -> media
   */
  configMedia: function (curMedia, newMedia) {
    if (!curMedia.length) {
      return newMedia;
    }
    //@test
    //join this shit up, inception type media
    //need to slice it to remove any prefix like screen
    curMedia = curMedia + ' and ' + newMedia.slice(newMedia.indexOf('('));

    return curMedia;
  },

  /**
   * AppendTo target Option, this guy is a bit tricky just depepending
   * on if we are dealing with a inheritSelector we have to make some
   * extra adjustments. But typlicall just appendsTo
   * @param  {str} cdr       -> cdr key
   * @param  {map} optionMap -> option map
   * @return {str}           -> cdr key
   */
  appendTo: function (cdr, optionMap) {
    const self = this;
    if (optionMap.has('appendTo')) {
      // we only need to append with `&` which is done in the
      // get fn when we are inheriting the selector
      if (self.appendToIndex === false && self.inheritSelector) {
        self.appendToIndex = self.cdr.size;
        cdr += optionMap.get('appendTo');
      }else {
        cdr += optionMap.get('appendTo');
      }
    }

    if (optionMap.get('appendKey')) {

      if (self.appendToIndex === false && self.inheritSelector) {
        self.appendToIndex = self.cdr.size;
      }else {
        cdr = '&' + cdr;
      }
    }

    return cdr;
  },

  /**
   * ApplyTo target option, just adds a "safe space" cus you know applyTo
   * @param  {str} cdr       -> cdr key
   * @param  {map} optionMap -> option map
   * @return {str}           -> key with applyTo if present
   */
  applyTo: function (cdr, optionMap) {
    if (optionMap.has('applyTo')) {
      cdr = cdr + ' ' + optionMap.get('applyTo');
    }

    return cdr;
  },

  /**
   * AttachTo target option, the impotant part here is that is will set
   * the attachToOption upstairs, to the constructor.
   * @param  {str} cdr       -> cdr key
   * @param  {map} optionMap -> opt map
   * @param  {str} id        -> instance ref for lookup
   * @return {srt}           -> cdr key
   */
  attachTo: function (cdr, optionMap, id) {
    if (optionMap.has('attachTo')) {
      //get option
      let attachTo = optionMap.get('attachTo');
      //check if true, if so assing to root str
      attachTo = (attachTo === true || attachTo === 0) ? 'root' : attachTo;
      //set in the updstairs constructor scrope for pickup on composer
      this.attachToOption = {
        id: id,
        key: cdr,
        index: attachTo
      };
    }
    return cdr;
  },

  /**
   * Calles the target options in the order we want
   * @param  {str} cdr       -> cdr key, empty string
   * @param  {map} optionMap -> optiion map
   * @param  {str} id        -> instace id ref
   * @return {str}           -> cdr with options applied if any
   */
  configCdr: function (cdr, optionMap, id) {
    const self = this;

    //list order
    cdr = self.appendTo(cdr, optionMap);
    cdr = self.applyTo(cdr, optionMap);
    cdr = self.attachTo(cdr, optionMap, id);

    return cdr;
  },

  /**
   * This dude, deals with any interal `_appendTo`s that come his way.
   * The gist behing this is states are set with an internal `_appendTo`
   * since we will need to append it to whatever its parent key is
   * and this does just that if that makes any sense
   * @return {---} -> none, just sets global need be
   */
  setInternal: function (dataMap) {
    const self = this;
    //note: _appendTo if interally comes from state
    const append = dataMap.getIn(['option', 'specific', '_appendTo'])
                 && self.appendToIndex === false
                 && self.inheritSelector
                 && dataMap.get('type') !== 'transition';

    const appendToIndex = append ? self.cdr.size : false;
    if (appendToIndex !== false) {
      //set global
      self.appendToIndex = appendToIndex;
    }
  },

  /**
   * Our config man, who configs all the options from all the lands
   * @param  {map} dataMap -> data ref to what we are configing
   * @param  {str} id      -> id ref
   * @return {obj}         -> the configed parts
   */
  config: function (dataMap, id) {
    const self = this;

    //set internal, if any
    self.setInternal(dataMap);

    //assign
    const type = dataMap.get('type');
    let car = '';
    let cdr = type !== 'media' ? dataMap.get('key') : '';
    let media = false;
    let override = false;
    const optionMap = dataMap.getIn(['option', 'target']);

    //only config these two on last stack
    if (self.isLastStack()) {
      //config car
      car = optionMap.has('root') ? optionMap.get('root') : car;
      //config override
      override = optionMap.has('override') ? optionMap.get('override') : override;
    }

    //config cdr
    cdr = self.configCdr(cdr, optionMap, id);

    //config media
    if (type === 'media') {
      media = self.configMedia(self.media.reduce(function (str, val) {
        if (val.key) {
          str += val.key;
        }
        return str;
      }, ''), dataMap.get('key'));
    }

    return {
      car,
      cdr,
      media,
      override
    };
  },

  /**
   * Sets the data, in da lists. It will first config the data though.
   * @param {map} dataMap -> data map ref to be configed and set
   */
  set: function (dataMap) {
    const self = this;

    //get type
    const type = dataMap.get('type');
    const typeIndex = dataMap.get('index');
    const id = dataMap.get('id');

    //reassing dataMap from type stack
    dataMap = self.target.getIn([type, typeIndex]);

    //config keys
    const {car, cdr, override, media} = self.config(dataMap, id);

    //set in list
    self.car = self.car.push({
      key: car,
      type: type,
      id: id
    });
    self.cdr = self.cdr.push({
      key: cdr,
      type: type,
      id: id
    });
    self.override = self.override.push({
      key: override,
      type: type,
      id: id
    });
    self.media = self.media.push({
      key: media,
      type: type,
      id: id
    });
  },

  /**
   * This bad boy configes the source order of the cdr list. Its a big hitter.
   * Its primary purpose is to check if any `elements` and `states` need
   * to be swaped. For example `.class:hover:first-child` needs to be swaped
   * to `.class:first-child:hover`. This will also config attachTo target option
   * if needed.
   * @param  {list} cdr -> cdr list
   * @return {list}     -> cdr list sorted all out
   */
  composeCdrOrder: function (cdr) {
    const self = this;

    //config attachTo if needed
    if (self.attachToOption) {
      //get vals
      let {id, index} = self.attachToOption;

      //check to see if the same as appendToIndex
      let equalsAppendIndex = false;
      if (_.isNumber(self.appendToIndex)) {
        equalsAppendIndex = cdr.get(self.appendToIndex).id === id;
      }

      /**
       * wrapper funk to get index
       * @param  {str} id -> id we are looking for
       * @return {num}    -> index number
       */
      const getCurIndex = function (_id) {
        return cdr.findIndex(function (val) {
          return val.id === _id;
        });
      };

      /**
       * wrapper funk to get index reffrance used in sort
       * @param  {num} indexNum -> index num we are looking for
       * @return {obj}          -> index
       */
      const getIndexRef = function (indexNum) {
        const indexRef = cdr.get(indexNum);
        //make sure its not a trans, cant attachTo
        return indexRef.type !== 'transition'
               ? indexRef
                   //pick before or affter that is the question
               : cdr.get(indexNum - 1);
      };

      //assing index reff in not root, can be an index or key
      let indexRef;
      if (index !== 'root') {
        if (index === 'prv' || index === 'previous') {
          //get current index
          const curIndex = getCurIndex(id);
          //assing ref, we use two here, since we are assume the
          //user is in a state which is index, so we have to lookup
          //outside of the state to the next component
          indexRef = getIndexRef(curIndex - 2);
        }else {
          const indexNum = Number.parseInt(index);
          //num ref
          if (!_.isNaN(indexNum) && _.isNumber(indexNum)) {
            // assing ref
            indexRef = getIndexRef(indexNum);
          }else {
            //if user used a string, literally
            indexRef = cdr.find(function (val) {
              //probs need to cycle to this to make sure its an exsact match
              const reg = new RegExp(index + '(?!.{1})');
              if (val.type !== 'transition' && reg.test(val.key)) {
                return val;
              }
            });
          }
        }
      }else {
        indexRef = {
          id: 'root'
        };
      }

      //assing key
      if (indexRef) {
        index = indexRef.id;
        // sort to new order
        cdr = cdr.sort(function (valA, valB) {
          if (valA.id === id) {
            //foward
            if (index === 'root') {
              return -1;
            }else if (index === valB.id) {
              return 0;
            }
            return -1;
          }else if (valB.id === id) {
            //backward
            if (index === 'root') {
              return 1;
            }else if (index === valA.id) {
              return 0;
            }
            return 1;
          }
          return 0;
        });

        //reassing the appendTo index
        if (equalsAppendIndex) {
          self.appendToIndex = cdr.findIndex(function (val) {
            return val.id === id;
          });
        }

      }else {
        //throw error attachTo Key not found
        const keyOptions = cdr.map(function (val, i) {
          const key = i === 0 ? 'root' : val.key;
          return ('[Key ' + i + ']: ' + key);
        }).toJS();

        throwErr('attachTo', {
          key: index,
          keyOptions: keyOptions
        });
      }
    }

    //reduce to seperate non vals
    return cdr.reduce(function (map, val, index) {
      if (val.key.length) {
        return map.update('val', function (list) {
          return list.push({
            val: val,
            index: index
          });
        });
      }
      return map.update('non', function (list) {
        return list.push({
          val: val,
          index: index
        });
      });
    }, Immutable.Map({
      val: Immutable.List(),
      non: Immutable.List()
    }))
    //sort val values
    .update('val', function (list) {
      return list.sort(function (valA, valB) {
        //checks to see if element is next to state to see if we
        //need to change the sorce order
        if (valB.val.type === 'element' && valA.val.type === 'state') {
          const cleanKey = valB.val.key.replace(/:/g, '');
          if (!_.includes(self.elmNotSwap, cleanKey)) {
            //swap indexes
            const valAdex = valA.index;
            const valBdex = valB.index;
            valA.index = valBdex;
            valB.index = valAdex;
            return 1;
          }
        }else if (valA.val.type === 'element' && valB.val.type === 'state') {
          const cleanKey = valA.val.key.replace(/:/g, '');
          if (_.includes(self.elmNotSwap, cleanKey)) {
            //swap indexes
            const valAdex = valA.index;
            const valBdex = valB.index;
            valA.index = valBdex;
            valB.index = valAdex;
            return -1;
          }
        }
        return 0;
      });
    })
    //re-compose
    .reduce(function (list, valList) {
      return valList.reduce(function (_list, val) {
        return _list.set(val.index, val.val);
      }, list);
    }, Immutable.List());
  },

  /**
   * This will compose and get the key for out output. This pretty damn important
   * for two reasons, first this is the key output, but secondly, this is how
   * we merge like data. Since all the data is complied before its applied. And
   * as you prbly assumed all the data is stored via a immutable map you can check
   * index-manager if some more insight or confusion, it depends.
   * @return {obj} -> key
   */
  get: function () {
    const self = this;

    //compose cdr
    const composedCdr = self.composeCdrOrder(self.cdr);

    //compose the family
    const selectorList = composedCdr.reduce(function (map, val, index) {

      //override
      const override = self.override.get(index).key;
      if (override) {
        return map.set('override', override);
      }

      //media
      const media = self.media.get(index).key;
      if (media) {
        map = map.set('media', media);
      }

      //car
      const car = self.car.get(index).key;
      if (car.length) {
        map = map.set('car', car);
      }

      //cdr
      let cdr = val.key;
      //no reson to map if val empty
      if (cdr.length && val.type !== 'media') {
        map = map.update('cdr', function (str) {
          //appendTo reffrence
          if (self.appendToIndex === index && !str.includes('&')) {
            str = '&' + str;
          }else if (str.includes('&') && cdr.startsWith('&')) {
            //remove '&' which occurs on multi level comp chains appnedKey
            cdr = cdr.slice(1);
          }

          str += cdr;
          return str;
        });
      }

      return map;
    }, Immutable.Map({
      cdr: '',
      car: '',
      media: false,
      override: false
    }));

    //grab results out of map
    const res = {
      override: selectorList.get('override'),
      selectorCar: selectorList.get('car'),
      selectorCdr: selectorList.get('cdr'),
      selectorMedia: selectorList.get('media')
    };

    return res;
  }
});

module.exports = StackManager;
