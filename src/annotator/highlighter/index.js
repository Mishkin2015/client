'use strict';

const domWrapHighlighter = require('./dom-wrap-highlighter');
const overlayHighlighter = require('./overlay-highlighter');
const features = require('../features');

let overlayFlagEnabled;

const _getCurrentHighlighter = () => {
  // lazy check the value but we will
  // use that first value as the rule throughout
  // the in memory session
  if(overlayFlagEnabled === undefined){
    overlayFlagEnabled = features.flagEnabled('overlay_highlighter');
  }

  return overlayFlagEnabled ? overlayHighlighter : domWrapHighlighter;
};

module.exports = {

  /**
   *  Given an normalized range, create all of the highlight elements
   *  that create the full highlight effect for an anchor.
   *
   *  Note: this is a required function to be implemented by the different
   *  highlighters
   *
   *  @param normedRange A NormalizedRange to be highlighted.
   *  @returns Array of HTMLElement references.
   */
  highlightRange: (normedRange) => {
    return _getCurrentHighlighter().highlightRange(normedRange);
  },

  /**
   *  Register a callback to be notified when a set of highlights changes
   *  for a range. This could happen in situations where the page size changes
   *  resulting in more or less highlight elements needed to accomplish the
   *  full highlight.
   *
   *  Note: this is optional to be implemented by the different highlighters.
   *    If not implemented, it will do nothing.
   *
   *  @param cb callback to be invoked when a change in highlight
   *    elements happens.
   */
  onHighlightsChanged: (cb) => {
    const highlighter = _getCurrentHighlighter();
    if('onHighlightsChanged' in highlighter){
      highlighter.highlightRange(cb);
    }
  },

  /**
   * Remove a set of highlights from the page.
   *
   * @param highlights An Array of HTMLElements that need to be removed.
   */
  removeHighlights: (highlights = []) => {
    // Note for overlay highlighting we are deleting the
    // <rect /> elements here and could eventually remove
    // all of them for a range. This will leave <svg> and <g>
    // elements remaining. At this point, those artifacts
    // should have no effects by staying around after.
    highlights.forEach((el)=>{
      el.remove();
    });
  },

  /**
   *  Given a set of highlights, toggle the necesssary levers to
   *    make the highlight look focused or unfocused.
   *
   *  @param highlights Array of highlight elements to toggle focus state
   *  @param focusOn boolean to decide if focus should be applied or taken
   */
  toggleFocusForHighlights: (highlights = [], focusOn = false) => {
    highlights.forEach((el)=>{
      el.classList.toggle('annotator-hl-focused', focusOn);
    });
  },
};
