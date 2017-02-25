'use babel';

import { Point } from 'atom';
import { getLines } from '../../utility/editor/editor';
import PreformattedArea from './preformatted-area';

export default class MarkdownHeader {

  static REGEXP = /^#+.*$/;

  level = null;
  title = null;
  line = null;

  ancestors = null;

  constructor(line) {
    this.level = line.text.replace(/^(#+)\s+.*$/, '$1').length;

    this.title = line.text.replace(/^#+\s+(.*)$/, '$1').replace(/^#+/, '');

    this.line = line;

    this.position = new Point(line.row, 0);
  }

  shiftDown(shiftNum) {
    const newLine = this.line.shiftDown(shiftNum);
    return new MarkdownHeader(newLine);
  }

  setAncestors(ancestors) {
    this.ancestors = ancestors;
  }

  isRoot() {
    return this.ancestors.length === 0;
  }

  static all() {
    const headers = HeaderHelper.getHeaders();
    return HeaderHelper.hierarchize(headers);
  }

  static first() {
    return MarkdownHeader.all()[0];
  }

  static at(position) {
    return HeaderHelper.getHeaderAt(position);
  }

  static isParentOf(parent, child) {
    const childParent = child.ancestors[child.ancestors.length - 1];
    return childParent && parent.line.row === childParent.line.row;
  }

  static isAncestorOf(ancestor, descendant) {
    return descendant.ancestors.some(dAncestor => dAncestor.line.row === ancestor.line.row);
  }
}

class HeaderHelper {

  static getHeaders() {
    var inPreFormattedArea = false;

    const headers = getLines().filter(line => {
      if (PreformattedArea.REGEXP.test(line.text) && !inPreFormattedArea) {
        // Start line of Preformatted area
        inPreFormattedArea = !inPreFormattedArea;
        return false;
      } else if (PreformattedArea.REGEXP.test(line.text) && inPreFormattedArea) {
        // End line of Preformatted area
        inPreFormattedArea = !inPreFormattedArea;
        return false;
      } else if (MarkdownHeader.REGEXP.test(line.text) && !inPreFormattedArea) {
        // Header line (Not in preformatted area)
        return true;
      } else {
        // NOOP
      }
    }).map(headerLine => new MarkdownHeader(headerLine));

    return HeaderHelper.hierarchize(headers);
  }

  static getFirstHeader() {
    return this.getHeaders()[0];
  }

  static getHeaderAt(position) {
    const headers = this.getHeaders();
    const currentCursorRow = position.row;

    if (headers.length === 0) {
      HeaderHelper.warnNoHeadersInTheFile();
      return null;
    }

    const nextHeaderLineIndex = headers.findIndex(header => header.line.row > currentCursorRow);

    return headers[nextHeaderLineIndex === -1 ? headers.length - 1 : nextHeaderLineIndex - 1];
  }

  static warnNoHeadersInTheFile() {
    atom.notifications.addWarning(`THERE IS NO MARKDOWN HEADER. (ex. '### Exapmple')`);
  }

  static hierarchize(headers) {
    const results = [];

    var prev = null;
    var ancestors = [];

    for (var i = 0; i < headers.length; i++) {
      const current = headers[i];

      if (!prev) {
        current.setAncestors(ancestors.concat());
      } else if (current.level > prev.level) {
        ancestors.push(prev);
        current.setAncestors(ancestors.concat());
      } else if (current.level === prev.level) {
        current.setAncestors(ancestors.concat());
      } else if (current.level < prev.level) {
        ancestors = ancestors.slice(0, current.level - 1);
        current.setAncestors(ancestors.concat());
      }
      results.push(current);

      prev = current;
    }
    return results;
  }

}
