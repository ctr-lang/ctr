module.exports = function(errorObject, callback) {
  console.log(errorObject.toString().split(': ').join(':\n'));
  // Keep gulp from hanging on this task
  if (typeof this.emit === 'function') { this.emit('end'); }
};
