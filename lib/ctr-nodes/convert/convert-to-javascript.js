const throwErr = require('./../helpers/helper-throw-err.js');

/**
 * Converts Stylus hash object to Js object
 * @return {obj} -> converted js object
 */
const toJavascript = function(_data) {
  let convertData = null;

  const convertExpression = function (arr) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      res.push(convertData(arr[i]));
    }
    return res.length === 1 ? res[0] : res;
  };
  const convertObject = function (obj) {
    const res = {};
    //processing object - loop de loop
    for (const node in obj) {
      if (obj.hasOwnProperty(node)) {
        res[node] = convertData(obj[node]);
      }
    }
    return res;
  };

  /**
   * Converts stylus into js
   */
  convertData = function (data) {
    const nodeName = data.nodeName;
    if (nodeName === 'object') {
      return convertObject(data.vals);
    }else if (nodeName === 'expression') {
      return convertExpression(data.nodes);
    }else if (nodeName === 'string') {
      return data.val;
    }else if (nodeName === 'unit') {
      return data.toString();
    }else if (nodeName === 'rgba') {
      return data.toString();
    }else if (nodeName === 'hsla') {
      return data.toString();
    }else if (nodeName === 'boolean') {
      return data.val;
    }else if (nodeName === 'call') {
      return data.first.toString();
    }else if (nodeName === 'ident') {
      return data.toString();
    }else if (nodeName === 'literal') {
      return data.toString();
    }else if (nodeName === 'null') {
      return null;
    }
    throwErr({
      type: 'Stylus Converting Error',
      msg: `If you get this error you should pull an issue on github to let me
            know that: "${nodeName}" could not convert, plus your code, since
            you are not supposed to get here. In the mean time I will attempt to
            convert the value into a String.`
    });
    return data.toString();
  };

  return convertData(_data);
};

module.exports = toJavascript;

