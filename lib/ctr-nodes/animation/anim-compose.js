const _          = require('lodash');
const Immutable  = require('immutable');
const _M         = require('./../manager/manager-index.js');

/**
 * Takes the extracted data and composes it into a object which can then
 * be complied by stylus which in tern will output css to put a smile on
 * the faces of young kids who are fuckin their brain with all this exposure
 * to the all-mighty screen. A screen which has turned into the parent and
 * transformed the parent into a merge shell of the medium. Fuck.
 * @param  {set} animSet -> A set of respectable anim props
 * @return {set}          -> Respecatble and assinged trans props
 */
const animCompose = function (animList) {
  //formate/convert to string so we don't have to pull some
  //jank ass phrasing bullshit since stylus struggles with excaped chars
  const assign = function (animMap) {
    const formated = {};
    //name
    const name = animMap.get('name');
    //no length return empty
    if (!name.length) {
      return formated;
    }

    //format props to be joined
    const duration = animMap.get('duration');
    const ease = animMap.get('ease');
    const count = animMap.get('count');
    const delay = animMap.get('delay');
    const direction = animMap.get('direction');
    const mode = animMap.get('mode');
    const state = animMap.get('state');

    //check for shorthand option property
    if (_M._option.getIn(['global', 'animationShorthand']) || animMap.option.getIn(['specific', 'animationShorthand'])) {
      //reduce and resue in life to create the shorthand prop syntax
      formated.animation = _.reduce(name, function (prv, val, index) {
        // @keyframes duration | timing-function | delay |  iteration-count | direction | fill-mode | play-state | name
        const du = _.get(duration, index);
        const ea = _.get(ease, index);
        const de = _.get(delay, index);
        const co = _.get(count, index);
        const di = _.get(direction, index);
        const fi = _.get(mode, index);
        const pl = _.get(state, index);
        //create shorthand
        if (_.every([val, du, ea, de, co, di, fi, pl], (v) => !_.isUndefined(v))) {
          const anim = `${du} ${ea} ${de} ${co} ${di} ${fi} ${pl} ${val}`;
          // property name | duration | timing function | delay
          prv.push(anim);
        }
        return prv;
      }, []);
      //format
      formated.animation = formated.animation.join(', ');
    }else {
      formated['animation-name'] = name.join(', ').toString();
      //duration
      formated['animation-duration'] = duration.join(', ').toString();
      //ease
      formated['animation-timing-function'] = ease.join(', ').toString();
      //count
      formated['animation-iteration-count'] = count.join(', ').toString();
      //delay
      formated['animation-delay'] = delay.join(', ').toString();
      //direction
      formated['animation-direction'] = direction.join(', ').toString();
      //mode
      formated['animation-fill-mode'] = mode.join(', ').toString();
      //state
      formated['animation-play-state'] = state.join(', ').toString();
    }

    //return
    return formated;
  };


  //cycle through
  animList = animList.reduce(function (prv, extractMgr) {
    let anim = assign(extractMgr);
    let target;
    //set data in target and get back target and updated trans
    ({anim, target} = extractMgr.setAndGet(anim));
    //convert data
    const data = Immutable.fromJS(anim);
    //push to return
    return prv.push({
      data: data,
      target: target
    });
  }, Immutable.List());

  return {
    animList
  };
};

module.exports = animCompose;
