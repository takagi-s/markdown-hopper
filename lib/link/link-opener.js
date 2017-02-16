'use babel';

import { Point } from 'atom';
import Anchor from './anchor';
import { Events } from './notifier';
import Header from '../core/markdown/header';
import LinkNotifier from './notifier';
import util from '../utility';

export default class LinkOpener {

  cursorMoveHistoryRegistry = null;
  notifier = null;

  constructor(cursorMoveHistoryRegistry) {
    this.cursorMoveHistoryRegistry = cursorMoveHistoryRegistry;
    this.notifier = new LinkNotifier();
  }

  open(filePath, anchorName) {
    const targetOsPath = util.resolveToPlatformed(filePath);
    this.cursorMoveHistoryRegistry.save(util.path(), util.cursorPosition());

    // XXX: Refactor
    // Open the path
    if (targetOsPath) {
      return atom.workspace.open(targetOsPath).then(editor => {
        if (anchorName) {
          const headers = Header.all();

          var couldFindAnchor = false;
          headers.forEach(header => {
            if (header.line.row === 0) return;

            const anchorLine = editor.lineTextForBufferRow(header.line.row - 1);
            const name = anchorLine.replace(Anchor.REGEXP, '$1');
            if (name && name === anchorName) {
              couldFindAnchor = true;
              util.cursorPosition(new Point(header.line.row, 0));
            }
          });

          if (!couldFindAnchor) {
            this.notifier.anchorNotFound(anchorName);
          }
        }
      });
    } else {
      if (anchorName) {
        const headers = Header.all();

        var couldFindAnchor = false;
        headers.forEach(header => {
          if (header.line.row === 0) return;

          const anchorLine = util.editor().lineTextForBufferRow(header.line.row - 1);
          const name = anchorLine.replace(Anchor.REGEXP, '$1');
          if (name && name === anchorName) {
            couldFindAnchor = true;
            util.editor().setCursorBufferPosition(new Point(header.line.row, 0));
          }
        });

        if (!couldFindAnchor) {
          this.notifier.anchorNotFound(anchorName);
        }
      }
    }
  }

}
