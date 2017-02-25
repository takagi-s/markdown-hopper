'use babel';

import Anchor from './anchor';
import util from '../utility/editor/line';

const RESULT = {
  SUCCESS: true,
  FAIL: false
}

const EMPTY_LINE = /^$/;

class AnchorHelper {

  createAnchorFor(targetHeader) {
    return new Anchor(targetHeader);
  }

  write(anchor) {
    util.insertLineAt(anchor.targetHeader.line, anchor.tag);
    anchor.shiftTargetHeader1LineDown();
    anchor.setLine(new Line(anchor.targetHeader.line.row - 1, anchor.tag));

    return RESULT.SUCCESS;
  }

  getAnchorFor(header) {
    const editor = atom.workspace.getActiveTextEditor();

    for (var i = header.line.row - 1; i > 0; i--) {
      const maybeAnchorLine = new Line(i, editor.lineTextForBufferRow(i));

      if (Anchor.REGEXP.test(maybeAnchorLine.text)) {
        const name = maybeAnchorLine.text.replace(Anchor.REGEXP, '$1'); // Anchor line
        return new Anchor(header, name);
      } else if (EMPTY_LINE.test(maybeAnchorLine.text)) {
        continue; // Empty line
      } else {
        return null; // Other line
      }
    }

    return null; // Could not find the anchor before the head line.
  }

}

export default new AnchorHelper();
