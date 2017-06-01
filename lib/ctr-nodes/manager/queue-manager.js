const _         = require('lodash');
const Immutable = require('immutable');
const defclass  = require('defclass');

const QueueManager = defclass({
  constructor: function (indexRef, option) {
    const self = this;
    //index Ref
    self.index = indexRef;
    //style stores
    self.queue           = Immutable.List();
    self.mediaQueue      = Immutable.List();
    self.animationQueue  = Immutable.List();
    self.stack           = Immutable.List();
    self.deflateQueue    = Immutable.List();
    //controll options
    self.processBy       = option.processBy;
    self.processStyle    = option.processStyle;
    self.processMedia    = option.processMedia;
    self.processTimeline = option.processTimeline;
    self.queueMedia      = option.queueMedia;
    self.queueAnimation  = option.queueAnimation;

    if (self.queueMedia !== false) {
      self.mediaStack = Immutable.List();
      self.queueMedia = _.isNumber(self.queueMedia) ? self.queueMedia : 0;
    }
    if (self.queueAnimation !== false) {
      self.animationStack  = Immutable.List();
      self.queueAnimation = _.isNumber(self.queueAnimation) ? self.queueAnimation : 1;
    }

    self.stackIsMerged = false;
  },

  /**
   * Wrapper to help us push to the stack
   */
  addToStack: function (type) {
    const self = this;

    if (type === 'style') {
      self.stack = self.stack.push(type);
    }else if (type === 'media') {
      //push to normal stack if not queuing
      if (self.queueMedia === false) {
        self.stack = self.stack.push(type);
      }else {
        self.mediaStack = self.mediaStack.push(type);
      }
    }else if (type === 'animation') {
      //push to normal stack if not queuing
      if (self.queueAnimation === false) {
        self.stack = self.stack.push(type);
      }else {
        self.animationStack = self.animationStack.push(type);
      }
    }
  },

  /**
   * Mergers stack depending on what we are working with
   */
  mergeStack: function () {
    const self = this;

    //nothing to merge
    if (!self.animationStack && !self.mediaStack) {
      //indicated merged
      self.stackIsMerged = true;
      return;
    }

    //one yes other no
    if (!self.animationStack || !self.mediaStack) {
      if (self.mediaStack) {
        self.stack = self.stack.concat(self.mediaStack);
      }else if (self.animationStack) {
        self.stack = self.stack.concat(self.animationStack);
      }
      //indicated merged
      self.stackIsMerged = true;
      return;
    }

    //config concat order, lowest num first
    const firstStack = self.queueMedia < self.queueAnimation
                     ? self.mediaStack : self.animationStack;
    const lastStack = self.queueMedia < self.queueAnimation
                    ? self.animationStack : self.mediaStack;
    //concat
    if (firstStack.size) {
      self.stack = self.stack.concat(firstStack);
    }
    if (lastStack.size) {
      self.stack = self.stack.concat(lastStack);
    }
    //indicated merged
    self.stackIsMerged = true;
  },

  /**
   * Our main boy, adds both styles and media styles to their respected
   * queues. Does the heavy lifting
   * @param {map} dataMap -> map of the data
   * @param {obj} option  -> options to work with
   */
  add: function (dataMap, option = {}) {
    const self = this;
    //set default
    const type = option.type || 'style';

    const target = dataMap.get('target');
    const data = dataMap.get('data');
    const processNow = option.processNow || false;
    const processType =    type === 'style' && self.processStyle
                        || type === 'media' && self.processMedia;
    //make sure we want to process
    if (!processType) { return; }

    /**
     * Process by order, aka process immediately
     */
    if (self.processBy === 'order') {
      if (processNow) {
        self.deflateQueue = self.deflateQueue.push({
          data: data,
          target: target
        });
      }else {
        self.index.extractStyle(
          data.toJS(),
          target,
          type
        );
      }
    }

    /**
     * Proccess by leve, aka process by selector nest level
     */
    if (self.processBy === 'level') {
      if (processNow) {
        self.deflateQueue = self.deflateQueue.push({
          data: data,
          target: target
        });
      }else {
        //set stack ref
        self.addToStack(type);
        if (type === 'style') {
          //add to queue
          self.queue = self.queue.push({
            data: data,
            target: target
          });
        }else {
          self.mediaQueue = self.mediaQueue.push({
            data: data,
            target: target
          });
        }
      }
    }


  },

  /**
   * Handles the timeline queue
   */
  addTimeline: function (data) {
    const self = this;
    //@todo not sure if this is the best way to handle this
    //pr-#53
    if (self.processTimeline) {

      const hasTl = self.animationQueue.find(function (val) {
        if (data.tlName === val.tlName) {
          return val;
        }
      });

      //only add the tl if the tl is not present
      if (!hasTl) {
        //set stack ref
        self.addToStack('animation');
        //add to animationQueue
        self.animationQueue = self.animationQueue.push(data);
      }
    }

  },

  /**
   * Defalte, handles the processing of specific features that are pre-build
   * and thrown back into the queue like the grid column. If you look at the
   * column code you will see we "genChild" that is we create ctr code to
   * compose the various elements. The problem is, if we don't daflate these
   * column ctr elements will not be processed untill the next cycle which then
   * fucks the compilation order.
   */
  deflateNext: function () {
    const self = this;
    if (!self.deflateQueue.size) { return true; }

    //pick from the end to perserve the proper order
    const nextQueue = self.deflateQueue.last();
    self.deflateQueue = self.deflateQueue.pop();
    // const nextQueue = self.deflateQueue.first();
    // self.deflateQueue = self.deflateQueue.shift();

    //funk calls
    if (nextQueue) {
      //invoke extractStyle with params
      self.index.extractStyle(
        nextQueue.data.toJS(),
        nextQueue.target,
        nextQueue
      );
    }

    if (self.deflateQueue.size) {
      self.deflateNext();
    }
  },


  /**
   * Grab the next in line
   */
  next: function () {
    const self = this;

    //if stack is empty we then need to merge see if we need
    //to merge in our other media and animation stack
    if (!self.stack.size) {
      self.mergeStack();
    }

    //get next in line
    const nextQueue = self.stack.first();
    self.stack = self.stack.shift();

    if (nextQueue === 'animation') {
      //anim calls
      const nextAnim = self.animationQueue.first();
      self.animationQueue = self.animationQueue.shift();
      if (nextAnim) {
        self.index.indexMgr.addTimeline(nextAnim);
        return false;
      }
    }

    let nextParams;
    if (nextQueue === 'style') {
      nextParams = self.queue.first();
      self.queue = self.queue.shift();
    }else if (nextQueue === 'media') {
      nextParams = self.mediaQueue.first();
      self.mediaQueue = self.mediaQueue.shift();
    }

    //funk calls
    if (nextParams) {
      //invoke extractStyle with params
      self.index.extractStyle(
        nextParams.data.toJS(),
        nextParams.target,
        nextQueue
      );
      return false;
    }

    if (self.stack.size) {
      self.next();
    }

    return true;
  }
});

module.exports = QueueManager;
