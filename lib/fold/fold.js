'use babel';

import { Range } from 'atom';
import util from '../utility';

class FoldHelper {

  foldLine(line) {
    const editor = util.editor();

    const point = util.cursorPosition();
    editor.setSelectedBufferRange(new Range(line.start, line.end));
    editor.getLastSelection().fold();
    util.cursorPosition(point);
  }

  foldLines(lines) {
    if (lines.length === 0) return;

    const editor = util.editor();

    const anchorRanges = lines.map(line =>  {
      return new Range(line.start, line.end);
    });

    const point = editor.getCursorBufferPosition();
    editor.setSelectedBufferRanges(anchorRanges);
    editor.getSelections().forEach(selection => selection.fold());
    editor.setCursorBufferPosition(point);
  }

  foldLinkLine(linkLine) {
    const editor = util.editor();
    const point = editor.getCursorBufferPosition();
    editor.setSelectedBufferRange(linkLine.rangeByRegExp(/^.*[!]?\[.*\]\((.*)\).*$/));
    util.editor().getLastSelection().fold();
    util.cursorPosition(point);
  }

  foldLinkLines(linkLines) {
    if (linkLines.length === 0) return;

    const editor = util.editor();

    const linkRanges = linkLines.map(linkLine => linkLine.rangeByRegExp(/^.*[!]?\[.*\]\((.*)\).*$/));

    const point = editor.getCursorBufferPosition();
    editor.setSelectedBufferRanges(linkRanges);
    editor.getSelections().forEach(selection => selection.fold());
    editor.setCursorBufferPosition(point);
  }

  unfoldLines(lines) {
    if (lines.length === 0) return;

    const editor = util.editor();
    lines.forEach(line => editor.unfoldBufferRow(line.row));
  }
}

export default new FoldHelper();
