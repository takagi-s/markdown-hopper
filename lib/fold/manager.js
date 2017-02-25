'use babel';

import { getLines } from '../utility/editor/editor';
import Line from '../utility/editor/line';
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
    const line = Line.current();
    if (Anchor.isAnchor(line)) {
      this.toggleFoldAnchor(line);
    } else if (Link.isLink(line)) {
      this.toggleFoldLink(line);
    } else {
      if (util.editor().isFoldedAtCursorRow()) {
        util.editor().unfoldCurrentRow();
        // atom.commands.dispatch(util.editor(), 'editor:unfold-current-row');
      } else {
        util.editor().foldCurrentRow();
        // atom.commands.dispatch(util.editor(), 'editor:fold-current-row');
      }
    }
  }

  toggleFoldAnchor(line) {
    if (util.editor().isFoldedAtCursorRow()) {
      util.editor().unfoldCurrentRow();
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
    const anchorLines = Line.lines().filter(line =>
      Anchor.REGEXP.test(line.text)
    );
    FoldHelper.unfoldLines(anchorLines);
  }

}

export default new FoldManager();
