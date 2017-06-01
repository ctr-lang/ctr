const _ = require('lodash');


/**
 * Scores the matches
 * @param  {str} pattern -> patter to match against
 * @param  {str} str     -> string in question
 * @return {obj}         -> {score, render}
 */
const match = function (pattern, str) {
  const result = [];
  const len = str.length;
  const compareString = str.toLowerCase();
  let patternIdx = 0;
  let totalScore = 0;
  let currScore = 0;
  let ch = null;
  pattern = pattern.toLowerCase();
  // For each character in the string, either add it to the result
  // or wrap in template if it's the next string in the pattern
  for(let i = 0; i < len; i++) {
    ch = str[i];
    if(compareString[i] === pattern[patternIdx]) {
      patternIdx += 1;
      // consecutive characters should increase the score more than linearly
      currScore += 1 + currScore;
    } else {
      currScore = 0;
    }
    totalScore += currScore;
    result[result.length] = ch;
  }
  //return if there is any match, since we sort in res
  if(totalScore) {
    // if the string is an exact match with pattern, totalScore should be maxed
    totalScore = compareString === pattern ? Infinity : totalScore;
    return {rendered: result.join(''), score: totalScore};
  }
  return null;
};


/**
 * Basic fuzzy search
 * @param  {str} pattern -> pattern to match against
 * @param  {arr} list    -> match array
 * @param  {obj} option  -> options
 * @return {str}         -> fuzzy results
 */
const fuzzySearch = function (pattern, list, option = {count: 10, joinBy: '  ›—‹  '}) {
  //empty arg
  if(!list || list.length === 0) { return []; }
  //process
  const matchRes = _.reduce(list, function (prv, str) {
    const rendered = match(pattern, str);
    if (rendered !== null) {
      prv[str] = {
        string: rendered.rendered,
        score: rendered.score
      };
    }
    return prv;
  }, {});
  //return
  if (_.isEmpty(matchRes)) {
    return `Fuzzy search against "${pattern}" came back empty, sorry.`;
  }
  return `Fuzzy search results against "${pattern}": [${_.reduce(_.sortBy(matchRes, ['score']).reverse(), function (prv, val, index) {
    if (option.count > index) {
      prv.push(val.string);
    }
    return prv;
  }, []).join(option.joinBy)}]`;
};


module.exports = fuzzySearch;

