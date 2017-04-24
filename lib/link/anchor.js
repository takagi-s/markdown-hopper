'use babel';

import AnchorHelper from './anchor-helper';

import Line from '../utility/editor/line';
import { generateRandomString } from '../utility/random';

/**
 * Represents an anchor.
 */
export default class Anchor {

  static REGEXP_OLD = /^.*<a\s+name="(.+)"\s+class="markdown-hopper"><\/a>.*$/;
  static REGEXP = /^.*<a\s+name="(.+)"><\/a>.*$/;

  name = null;
  targetHeader = null;
  tag = null;
  line = null;

  constructor(targetHeader, name) {
    this.targetHeader = targetHeader;
    this.name = name ? name : 'header-' + generateRandomString(10);

    this.tag = `<a name="${this.name}"></a>`;
  }

  shiftTargetHeader1LineDown() {
    this.targetHeader = this.targetHeader.shiftDown();
  }

  setLine(line) {
    this.line = line;
  }

  static isAnchor(line) {
    return Anchor.REGEXP_OLD.test(line.text) || Anchor.REGEXP.test(line.text);
  }

  static fromText(anchorName) {
    return anchorName ? new Anchor(null, anchorName) : null;
  }

}
