const _          = require('lodash');
const Immutable  = require('immutable');
const _M         = require('./../manager/manager-index.js');

/**
 * Takes the extracted data and composes it into a object which can then
 * be complied by stylus which in tern will output css to put a smile on
 * the faces of young kids who are fuckin their brain with all this exposure
 * to the all-mighty screen. A screen which has turned into the parent and
 * transformed the parent into a merge shell of the medium. Fuck.
 * @param  {set} transSet -> A set of respectable trans props
 * @return {set}          -> Respecatble and assinged trans props
 */
const transCompose = function (transList) {

  //formate/convert to string so we don't have to pull some
  //jank ass phrasing bullshit since stylus struggles with excaped chars
  const assign = function (extractMgr) {
    const formated = {};
    //if empty throw error, fix, pr-#85
    if (!extractMgr.get('property').length) {
      // throwErr('emptyTransition', extractMgr.get('data'));
      return formated;
    }
    const property = extractMgr.get('property');
    let willChange = extractMgr.getOption('will-change');

    //will-change option
    if (willChange) {
      if (willChange === true) {
        formated['will-change'] = property.join(', ').toString();
      }else {
        //user specified
        willChange = _.isArray(willChange) ? willChange : [willChange];
        formated['will-change'] = willChange.join(', ').toString();
      }
    }

    //format props to be joined
    const duration = extractMgr.get('duration');
    const ease = extractMgr.get('ease');
    const delay = extractMgr.get('delay');

    //check for shorthand option property
    if (_M._option.getIn(['global', 'transitionShorthand']) || extractMgr.option.getIn(['specific', 'transitionShorthand'])) {
      //reduce and resue in life to create the shorthand prop syntax
      formated.transition = _.reduce(property, function (prv, val, index) {
        const du = _.get(duration, index);
        const ea = _.get(ease, index);
        const de = _.get(delay, index);
        //create shorthand
        if (_.every([val, du, ea, de], (v) => !_.isUndefined(v))) {
          const trans = `${val} ${du} ${ea} ${de}`;
          // property name | duration | timing function | delay
          prv.push(trans);
        }
        return prv;
      }, []);
      //format
      formated.transition = formated.transition.join(', ');
    }else {
      //property
      formated['transition-property'] = property.join(', ').toString();
      //duration
      formated['transition-duration'] = duration.join(', ').toString();
      //ease
      formated['transition-timing-function'] = ease.join(', ').toString();
      //delay
      formated['transition-delay'] = delay.join(', ').toString();
    }

    //return
    return formated;
  };

  //cycle through
  transList = transList.reduce(function (prv, extractMgr) {
    //assing
    const trans = Immutable.fromJS(assign(extractMgr));
    //update target with new trans data
    const target = extractMgr.updateTarget(trans);
    //get raw data
    const data = extractMgr.getRaw('data');
    //push to return list
    return prv.push({
      data: data,
      trans: trans,
      target: target
    });
  }, Immutable.List());

  return {
    transList
  };
};

module.exports = transCompose;
