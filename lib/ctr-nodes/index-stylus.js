const styl    = require('./../stylus.js');
const convert = require('./convert/convert-index.js');
const _M      = require('./manager/manager-index.js');
const Nodes   = styl.nodes;

/**
 * Makes a call to ctr.styl fn to handle the interpolation
 * and then pushes it to the block which is to be returned to make magical css.

 */

const invokeStylusFn = function (data, selector, selectorMedia) {
  //convert data from js object to stylus
  data = convert.toStylus(data);

  //convert seletor to stylus
  selector = new Nodes.Literal(selector);

  //convert media to stylus
  selectorMedia = selectorMedia.length
                  ? new Nodes.Literal(selectorMedia)
                  : new Nodes.Boolean(false);
  //push to args
  let params = new Nodes.Arguments();
  //push indv to ensure order
  params.push(data);
  params.push(selector);
  params.push(selectorMedia);

  //call stylus funciton and push to block
  const visitCall = function (fn) {
    let call = new Nodes.Call(fn, params);
    _M._stylus.return++;
    call = _M._stylus.visit(call);
    _M._stylus.return--;
    return call;
  };

  //Complies the style through stylus funk "CTR_CreateStyle" -> ¯\_(ツ)_/¯
  //Bascially, CTR_CreateStyle acts as a janky template like handlebars,
  //and converting to a pure js solution is do-able, it would just be a
  //protracted process. Further, it does fix the broken core data struc, so
  //we are rollin' high with Stylus till the rewrite
  _M._block.push(visitCall('CTR_CreateStyle'));

  //@note anim is handled in animation/timeline
};

module.exports = invokeStylusFn;
