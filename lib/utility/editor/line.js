'use babel';

import { Range, Point } from 'atom'

const REGEXP = {
  LINK: /\[.*\]\(.+\)/, // [xxx](yyy)
  PUBLIC_LINK: /\[.*\]\(http.+\)/, // [xxx](http://yyyy.html)
  ABSOLUTE_LINK: /\[.*\]\(\/.+\)/, // [xxx](/yyy/zzz)
  RELATIVE_LINK_WITH_DOT: /\[.*\]\(\..+\)/, // [xxx](./yyy/zzz)
  RELATIVE_LINK_WITHOUT_DOT: /\[.*\]\([\w].+\)/, // [xxx](yyy/zzz)
  LINK_TO_THE_ANCHOR: /\[.*\]\(#[\w_-].*\)/, //
  EMPTY_LINE: /^$/,
  LIST_ITEM: /^\s*-\s[^\[]*$/
};

/**
 * Represents a line.
 */
export default class Line {

  text: null;
  row: null;
  start: null;
  end: null;

  constructor(row, text) {
    this.row = row;
    this.text = text;
    this.start = new Point(row, 0);
    this.end = new Point(row, text.length);
  }

  range(opt_regexp) {
    return opt_regexp ? this.rangeByRegExp(opt_regexp) : new Range(this.start, this.end);
  }

  rangeByRegExp(regexp) {
    const matched = this.text.replace(regexp, '$1');
    const start = new Point(this.row, this.text.indexOf(matched));
    const end = new Point(this.row, this.text.indexOf(matched) + matched.length);
    return new Range(start, end);
  }

  rangeByChar(from, to) {
    const start = new Point(this.row, this.text.indexOf(from) + 1);
    const end = new Point(this.row, this.text.indexOf(to));
    return new Range(start, end);
  }

  isEmpty() {
    return REGEXP.EMPTY_LINE.test(this.text);
  }

  isLink() {
    return REGEXP.LINK.test(this.text);
  }

  isMarkdownLink() {
    return this.isOtherFileLink() || this.isSameFileLink();
  }

  isOtherFileLink() {
    return REGEXP.RELATIVE_LINK_WITH_DOT.test(this.text) || REGEXP.RELATIVE_LINK_WITHOUT_DOT.test(this.text);
  }

  isSameFileLink() {
    return REGEXP.LINK_TO_THE_ANCHOR.test(this.text);
  }

  isPublicLink() {
    return REGEXP.PUBLIC_LINK.test(this.text);
  }

  isListLine() {
    return REGEXP.LIST_ITEM.test(this.text);
  }

  shiftUp(shiftNum) {
    return this.shiftRow(shiftNum ? shiftNum : -1);
  }

  shiftDown(shiftNum) {
    return this.shiftRow(shiftNum ? shiftNum : +1);
  }

  shiftRow(shiftNum) {
    const newRow = this.row + shiftNum;
    return new Line(newRow, this.text);
  }

  setText(text) {
    return new Line(this.row, text);
  }

}
