const _          = require('lodash');
const teFlow     = require('te-flow');
const Immutable  = require('immutable');
const transition = require('./../transition/trans-index.js');
const _T         = require('./../target/target-index.js');
const _M         = require('../manager/manager-index.js');

/**
 * Processes any global trans on the root object called via index.
 * It will pass along the raw data to `transtion` to get our
 * trans list which then we will process and add to the queue.
 * @param  {obj} _data   -> The data obj
 * @param  {map} _target -> Current Target instance
 * @return {---}         -> Will queue the results from the list
 */
const processTrans = function (_trasKey, _data, _target) {
  /**
   * Throws the data off to be procced by the trans
   * @param  {obj} data   -> data obj
   * @param  {map} target -> target instance
   * @return {---}        -> transList: list, target: map
   */
  const getTrans = function (transKey, data, target) {

    const transList = transition(transKey, data, target, {
      stackProcess: true
    });

    return {
      transList,
      target,
      data
    };
  };

  /**
   * Cycles the results from the transition by cycling the list.
   * It will then merge the target instance from the trans with the
   * origianl target ref.
   * @param  {list} transList -> list res of the trans
   * @param  {map} target     -> orig target instance ref
   * @return {---}            -> queues the data to be further processed
   */
  const cycleRes = function (transList, target, data) {
    //cycle res
    transList.forEach(function (transRes) {
      const transTarget = transRes.target;
      const targetCopy = target;

      let transData;
      if (!data.option || (data.option && !data.option._nonGen)) {
        transData = transRes.data.mergeDeep(transRes.trans);
      }else {
        //If its `_nonGen` we have to do a bit of a workaround here.
        //First get all the properites that the trans was applied to.
        const transProps = transRes.trans.get('transition-property').split(', ');

        //redue the data, and remove any data with a key matching that which
        //is in the transProps array
        transData = transRes.data.reduce(function (map, val, key) {
          if (_.includes(transProps, key)) {
            return map.delete(key);
          }
          return map;
        }, transRes.data);

        //merge the transProps data into the transData to be set
        transData = transData.mergeDeep(transRes.trans);
      }

      let mergedTarget = Immutable.Map();
      //merge original target with
      mergedTarget = mergedTarget.withMutations(function (map) {
        return map
               .set('data', transData)
               .set('target', _T.merge(targetCopy, transTarget));
      });

      //throw back into extractor to have the values prcessed
      _M._queue.add(mergedTarget);
    });
  };

  //-> Main call for `processTrans`
  teFlow.call({
    args: {
      transKey: _trasKey,
      data: _data,
      target: _target
    }},
    getTrans,
    cycleRes
  );
};

module.exports = processTrans;
