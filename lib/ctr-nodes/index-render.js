const invokeStylus   = require('./index-stylus.js');
const _M             = require('./manager/manager-index.js');
const _T             = require('./target/target-index.js');
const createTimeline = require('./animation/timeline-render.js');

/**
 * Gets the formated data and applies that data to `callStylusFn`
 * @todo, better docs on this guy to
 * @return {[type]} [description]
 */
const renderStyle = function (indexMgr, cache = false, _target) {

  /**
   * Configs the styles, it will first compile the selector and then
   * pass off that data to callStylusFn to push the data to the stylus block
   * @param  {obj} data          -> compiled css data
   * @param  {map} target        -> target instance
   * @param  {bln} selectorCache -> if there is a cache to work with
   * @return {---}               -> none, inkoves `callStylusFn`
   */
  const configStyle = function (data, target, selectorCache = false) {
    let selector;
    let selectorCar;
    let selectorCdr;
    let selectorMedia;
    let selectorOverride;

    //No cache present
    if (!selectorCache) {
      //get/set selector components
      ({selector,
        selectorCar,
        selectorCdr,
        selectorMedia,
        selectorOverride
      } = _T.selector.get(target));

    }else {
      //set selector catch
      ({selector,
        selectorCar,
        selectorCdr,
        selectorMedia,
        selectorOverride
      } = selectorCache);

      //edge case when user is using override option, then we leave the
      //selector unchanged since it already has override val
      if (!selectorOverride) {
        //if its not the inherit selector we need to set the selector to the new val
        selector = _M._option.getIn(['inheritSelector'])
                   ? '__ctrImparative__'
                   : _M._option.getIn(['selector']);
      }
    }

    //config the selector shit
    let imparative = selector === '__ctrImparative__';

    //convert the selectors to empty string need be
    selector = selector = imparative ? '' : selector;

    //combind the selectors
    selector = selectorCar + selector + selectorCdr;

    //Need to remove first space on imparative
    if (imparative) {
      selector = selector.charAt(0) === ' '
                 ? selector.slice(1)
                 : selector;
    }

    //invoke stylus func
    invokeStylus(data, selector, selectorMedia);
  };

  /**
   * Sends the timeline data off to be processed and rendered. We are doing
   * this like this becuase to compose the timeline we have to do a bit of
   * a walkaround.
   * @param  {obj} data -> timeline data
   * @return {---}      -> none, its will push the resulting values to our block
   */
  const configTimeline = function (data) {
    //gen timeline
    data = createTimeline(data.tlName, data.timeline, _target);
  };


  /*-----------------------------*/
  /// The Render If Gate
  /*-----------------------------*/
  //If cache is avalible
  if (cache) {
    //Note: We are actually working with a stack here not a list thats called
    //a stack.
    let cycleCache = true;
    let stackSize = indexMgr.size - 1;
    //cycle stack
    while (cycleCache) {
      let next = indexMgr.get(stackSize);
      if (!next) { return; }
      //check type and procced
      if (next.type === 'animation') {
        //animation
        configTimeline(next.data);
      }else {
        //style
        configStyle(next.data, null, next);
      }
      --stackSize;
      cycleCache = stackSize === -1 ? false : cycleCache;
    }
  }else {
    //fetch data to be proccessed
    let {data, target, type} = indexMgr.next();
    //loop js objs to be converted back into stylus
    while (data) {
      if (type === 'style') {
        configStyle(data, target);
      }else {
        //animation
        configTimeline(data, target);
      }
      //get next set
      ({data, type, target} = indexMgr.next());
    }
  }

};

module.exports = renderStyle;
