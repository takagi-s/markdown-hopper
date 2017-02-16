'use babel';

import Line from '../core/line';
import Anchor from '../link/anchor';
import Link from '../link/link';
import FoldHelper from './fold';
import util from '../utility';

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
      FoldHelper.foldLine(line);
    }
  }

  toggleFoldLink(line) {
    FoldHelper.foldLinkLines(line);
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
    const linkLines = Line.lines().filter(line => line.isLink());
    FoldHelper.foldLinkLines(linkLines);
  }

  foldAnchors() {
    const anchorLines = Line.lines().filter(line =>
      Anchor.REGEXP.test(line.text)
    );
    FoldHelper.foldLines(anchorLines);
  }

  _unfoldAnchors() {
    const anchorLines = Line.lines().filter(line =>
      Anchor.REGEXP.test(line.text)
    );
    FoldHelper.unfoldLines(anchorLines);
  }

}

export default new FoldManager();
