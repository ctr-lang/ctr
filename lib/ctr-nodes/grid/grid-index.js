const _          = require('lodash');
const Immutable  = require('immutable');
const teFlow     = require('te-flow');
const gridModule = require('./module/grid-module-index.js');
const _T         = require('../target/target-index.js');
const _M         = require('../manager/manager-index.js');
const _H         = require('../helpers/helper-index.js');

const gridGenerate = function (_data, _target) {

  /**
   * Configs the data, the most important part is really assigning any
   * aliases. Ps, this is how you would add other alaias for the grid.
   * @param  {obj} data   -> Raw grid data obj
   * @param  {map} target -> Target instance
   * @return {obj}        -> Objs need to extract said data
   */
  const config = function (data, target) {
    //get/remove option
    let option = data.option || data.global;
    const defaultOpt = _M._option.getIn(['grid']);
    option = _H.util.merge(option, defaultOpt);

    const aliasList = {
      container: 'flex-container',
      parent: 'flex-container',
      masonryW: 'masonry-wrap',
      masonryC: 'masonry-column'
    };

    //pick up and alias
    data = _.reduce(data, function (prv, val, key) {
      if (aliasList[key]) {
        prv[aliasList[key]] = val;
      }
      return prv;
    }, data);

    return {
      data,
      option,
      target
    };
  };


  /**
   * @hacky, but fixes #pr-331, so that media can be processed inside grid objs,
   * by throwing the media with grid back into the mixer via the queue
   * @param {str} mediaKey   -> media key to use
   * @param {obj} childStruc -> strucutre of media data
   */
  const addTmplToQueue = function (mediaKey, childStruc, targetCopy) {
    const dataMap = Immutable.fromJS({
      [mediaKey]: childStruc
    });
    _M._queue.add(Immutable.Map({
      data: dataMap,
      target: targetCopy
    }), {
      processNow: true
    });
  };


  /**
   * Extracts any grid data. The moduleList is an array of all the functions
   * in the gridModule obj.
   * @param  {obj} data   -> The raw grid data obj
   * @param  {obj} option -> Any opts from the grid obj
   * @param  {map} target -> Target instance
   * @return {obj}        -> Extracted grid data, which is now composed as well
   */
  const extract = function (data, option, target) {
    //hacky check for column alias col
    data.column = data.col ? data.col : data.column;
    //our grid modules
    const moduleList = ['flex-container', 'center', 'align', 'column',
                      'row', 'waffle', 'offset', 'move', 'masonry-wrap', 'masonry-column'];

    //cycle modules, and queue res
    _.forEach(moduleList, function (mod) {
      //check if present in data
      if (!_.isUndefined(data[mod])) {
        const _mod = gridModule[mod];
        const dataOption = data[mod].option || data[mod].global;

        //needed to cut ref
        let _option = _.cloneDeep(option);

        //check for local options
        if (dataOption) {
          _option = _H.util.merge(dataOption, _option);
        }

        const targetCopy = target;
        //pass the data onto the grid mod funk
        const res = _mod(data[mod], _option, targetCopy);

        //@hacky, but fixes #pr-331, needed for edge case strucs like
        //grid: {column: {media-sm: {...}}}
        _.forEach(data[mod], function (val, key) {
          if (_.isString(key) && key.match(/^media|^customMe/)) {
            if (_H.util.sortObjectType(val).nonObj.length) {
              addTmplToQueue(key, {grid: {[mod]: val}}, targetCopy);
            }else {
              //so silly, I betz about three people will actually use this
              //grid: {column: {frac: x, media: {sm: {frac: x}}}}
              //test -> grid/feature/media/mixin.styl
              _.forEach(val, function (_val, _key) {
                const genHash = () => Math.random().toString(36).substr(2, 5);
                const mKey = `customMedia_${genHash()}`;
                addTmplToQueue(mKey, {[_key]: {grid: {[mod]: _val}}}, targetCopy);
              });
            }
          }
        });

        if (res) {
          const gridId = _H.util._id.gen('grid');

          let dataMap = Immutable.fromJS({
            key: '',
            data: res,
            option: _option,
            type: 'grid',
            id: gridId
          });

          dataMap = dataMap.set('target',
            _T.util.set(dataMap, targetCopy)
          );

          //add to the queue
          _M._queue.add(dataMap);
        }


      }
    });

    //@hacky, but fixes #pr-331, which is processing media in a grid
    //shit, is fucked, but it works-ish
    //First, filter out object by media key to see if there is anything to work with
    data = _.reduce(data, function (prv, val, key) {
      if (_H.util.regularExp.keyTest(key, 'media')) {
        prv[key] = val;
      }
      return prv;
    }, {});

    //if data is not empty we gotz media baby
    if (!_.isEmpty(data)) {
      /**
       * Helper to pull out non grid props
       * @return {obj}  -> non grid props and source without gird props
       */
      const seperateGridProps = function (source) {
        let gridProps = {};
        //make sure both have options and query
        const options = _.has(source, 'option') ? _.get(source, 'option') : false;
        if (options) {
          source.option = _.cloneDeep(options);
          gridProps.option = _.cloneDeep(options);
        }
        if (_.has(source, 'query')) {
          gridProps.query = _.cloneDeep(_.get(source, 'query'));
        }

        //pull out non-grid props to be processed as well
        const pullOutKeys = [
          'center', 'container', 'align', 'column', 'row', 'move', 'offset',
          'waffle', 'masonry-wrap', 'masonry-column'
        ];
        gridProps = _.reduce(pullOutKeys, function (prv, key) {
          if (_.has(source, key)) {
            prv[key] = _.get(source, key);
            _.unset(source, key);
          }
          return prv;
        }, gridProps);
        return {
          source,
          gridProps
        };
      };
      /**
       * Process the various types of media, and has to cycle through
       * various seniroes, that is also why its recursive
       * @param  {obj} mData -> media data to process
       * @return {---}       -> sends off media to be processed
       */
      const processMedia = function (mData, common = false) {
        //cycle process
        _.forEach(mData,  function (val, key) {
          const targetCopy = target;
          //pull out common
          const commonData = val.common || val.global || false;
          //remove
          if (commonData) {
            _.forEach(['common', 'global'], (i)=> _.unset(val, i));
          }

          //check sort if we are working with all sub objs
          const sortObj = _H.util.sortObjectType(val, {
            addOnKeys: ['mixin', 'query']
          });

          if (!sortObj.nonObj.length) {
            //assume sub objs, recursive process again
            _.forEach(val, function (_val, _key) {
              processMedia({[_key]: _val}, commonData);
            });
          }else {
            //pull out non-grid props to be processed as well
            let nonGridProps = null;
            ({gridProps: val, source: nonGridProps} = seperateGridProps(val));

            //merge in common if present
            val = common ? _.defaultsDeep(val, common) : val;
            //merge in any option if they are present
            if (!_.isEmpty(option)) {
              val = _.defaultsDeep(val, {option: option});
            }

            //pull out query
            if (_.has(val, 'query')) {
              const query = _.get(val, 'query');
              val = {grid: _.omit(val, 'query')};
              val.query = query;
            }else {
              val = {grid: val};
            }

            /**
             * Depending on key formats and adds to queue
             * 1. media--md: {}
             * 2. media: {query:{}}
             */
            if (key.match(/^media|^customMe/)) {
              addTmplToQueue(key, _.defaultsDeep(val, nonGridProps), targetCopy);
            }else {
              const genHash = () => Math.random().toString(36).substr(2, 5);
              const mKey = `customMedia_${genHash()}`;
              const struc = {[key]: _.defaultsDeep(val, nonGridProps)};
              addTmplToQueue(mKey, struc, targetCopy);
            }

          }
        });

      };

      //process media data recusivly unforunatly
      processMedia(data);
    }
  };


  teFlow.call({
    args: {
      data: _data,
      target: _target
    }},
    config,
    extract
  );
};

module.exports = gridGenerate;
