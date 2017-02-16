'use babel';

import AnchorHelper from './anchor-helper';

import Line from '../core/line';
import util from '../utility';

/**
 * Represents an anchor.
 */
export default class Anchor {

  static REGEXP = /^.*<a\s+name="(.+)"\s+class="markdown-hopper"><\/a>.*$/;

  name = null;
  targetHeader = null;
  tag = null;
  line = null;

  constructor(targetHeader, name) {
    this.targetHeader = targetHeader;
    this.name = name ? name : 'header-' + util.generateRandomString(10);

    this.tag = `<a name="${this.name}" class="markdown-hopper"></a>`;
  }

  shiftTargetHeader1LineDown() {
    this.targetHeader = this.targetHeader.shiftDown();
  }

  setLine(line) {
    this.line = line;
  }

  static isAnchor(line) {
    return Anchor.REGEXP.test(line.text);
  }

}
