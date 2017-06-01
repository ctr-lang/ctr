/**
 * Less test helper plugin
 * All this plugin does is reformat the spacing for rgba in the CSS
 * to match the spacing of that of Stylus
 */
class Helpers {
  commaSpaceRemove (str) {
    return str.replace(/rgba\(.*?\)/g, function (val) {
      return val.replace(/,\s/g, ',');
    });
  }
  process (str) {
    str = this.commaSpaceRemove(str);
    return str;
  }
}

const cleanCSS = function (option = {}) {
  const helpers = new Helpers(option);
  return {
    install: function(less, pluginManager) {
      pluginManager.addPostProcessor(helpers);
    }
  };
};

module.exports = cleanCSS;
