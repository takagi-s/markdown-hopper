'use babel';

import { getActiveEditor } from '../utility/atom-aliases';
import { getLines } from '../utility/editor/editor';
import { fold } from '../utility/editor/fold';
import Anchor from '../link/anchor';
import Link from '../link/link';

class FoldManager {

  isAnchorFolding = false;

  foldAll() {
    this.foldAnchors();
    this.foldLinks();
  }

  toggleFold(context) {
    const line = getLines();
    if (Anchor.isAnchor(line)) {
      this.toggleFoldAnchor(line);
    } else if (Link.isLink(line)) {
      this.toggleFoldLink(line);
    } else {
      if (getActiveEditor().isFoldedAtCursorRow()) {
        getActiveEditor().unfoldCurrentRow();
      } else {
        getActiveEditor().foldCurrentRow();
      }
    }
  }

  toggleFoldAnchor(line) {
    if (getActiveEditor().isFoldedAtCursorRow()) {
      getActiveEditor().unfoldCurrentRow();
    } else {
      fold(line);
    }
  }

  toggleFoldLink(line) {
    fold(line, /^.*[!]?\[.*\]\((.*)\).*$/);
  }

  toggelFoldAnchors() {
    if (this.isAnchorFolding) {
      // unfold
      this._unfoldAnchors();
    } else {
      // fold
      this.foldAnchors();
    }

    this.isAnchorFolding = !this.isAnchorFolding;
  }

  foldLinks() {
    fold(getLines().filter(line => line.isLink()), /^.*[!]?\[.*\]\((.*)\).*$/);
  }

  foldAnchors() {
    fold(getLines().filter(line => Anchor.REGEXP.test(line.text)));
  }

  _unfoldAnchors() {
    const anchorLines = getLines().filter(line =>
      Anchor.REGEXP.test(line.text)
    );
    FoldHelper.unfoldLines(anchorLines);
  }

}

export default new FoldManager();
