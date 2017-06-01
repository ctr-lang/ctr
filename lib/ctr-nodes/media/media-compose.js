const _         = require('lodash');
const _T        = require('../target/target-index.js');
const _M        = require('../manager/manager-index.js');


/**
 * #mediaCompose
 * Takes the mediaMgr and composes the actual media query in its
 * entirerty and creates a set to either be returned to the caller
 * or added into the queue and set in the target
 * @param  {mgr} mediaMgr -> The media manager
 * @param  {map} target   -> Target map
 * @return {set}          -> A set to be consumed
 */
const mediaCompose = function (mediaMgr) {
  /**
   * Composed the various query keys such as `min-width: 200px` with other
   * queries if any
   * @param  {str} mediaType  -> Type to be prefixin onto the start
   * @param  {obj} mediaQuery -> The various queries
   * @param  {str} addOn      -> And or Conditions
   * @return {str}            -> Composed media query string
   */
  const composeMediaString = function (mediaType, mediaQuery, addOn = ' and ') {
    let mediaString = mediaType ? mediaType : '';
    if (!_.isEmpty(mediaQuery)) {
      mediaString += mediaString.length ? addOn : '';
      //cycle through and gen stylus mediaQ's
      _.forEach(_.sortBy(_.keys(mediaQuery)).reverse(), function (val, key, list) {
        //replaces, ___i keys
        const str = ' (' + val.replace(/___\d/, '') + ': ' + mediaQuery[val] + ')';
        if (list.length !== key + 1) {
          mediaString += str + addOn;
        }else {
          //last of index no comma
          mediaString += str;
        }
      });
    }
    return mediaString;
  };

  /**
   * This guy will take both andCond and orCond and compose media query
   * string and then set it as the new meida target and add it to the set
   * @param  {obj} mediaQ   -> The configed media object to be composed
   * @param  {set} mediaSet -> The set to add it to for return
   * @return {set}          -> The media set
   */
  const mediaComposeQuery = function (target) {
    //get query instance
    let query = target.get('media').last();

    let andQuery = query.getIn(['option', 'specific', 'andQuery']).toJS();
    //add up the and quuery
    andQuery = _.reduce(andQuery, function (prvStr, val) {
      if (prvStr.length) {
        //tack on and if multiple to join
        prvStr += 'and' + composeMediaString(val.queryType, val.query);
      }else {
        prvStr += composeMediaString(val.queryType, val.query);
      }
      return prvStr;
    }, '');

    let orQuery = query.getIn(['option', 'specific', 'orQuery']).toJS();
    //add up the or query
    orQuery = _.reduce(orQuery, function (prvStr, val, index, list) {
      const addOn = index !== 0 && index < list.length ? ' and ' : '';
      prvStr += (addOn + composeMediaString(val.queryType, val.query, ', '));
      return prvStr;
    }, andQuery.length && orQuery.length ? 'and ' : '');

    //update target
    const mediaId = query.get('id');

    //update mediaTarget val with the query val since it was initlized
    //with an empty key val
    target = _T.util.update(target, {
      type: 'media',
      id: mediaId,
      key: 'key',
      val: (andQuery + orQuery),
      overwrite: true
    });

    //Hacky fix for pr-#327 to put quotes around content string
    if (query.hasIn(['data', 'content'])) {
      query = query.updateIn(['data', 'content'], function (val) {
        if (_.isString(val) && val.charAt(0) !==  '"') {
          //check to make sure we don't dub quote
          val = '"' + val + '"';
        }
        return val;
      });
    }

    //update query with target
    query = query.set('target', target);

    return query;
  };

  /**
   * Run the data that we set in the class manager and
   * composet the media query for the data
   */
  let target = mediaMgr.next();
  while (target) {
    const query = mediaComposeQuery(target);
    //add to the queue
    _M._queue.add(query, {
      type: 'media'
    });
    target = mediaMgr.next();
  }

};

module.exports = mediaCompose;
