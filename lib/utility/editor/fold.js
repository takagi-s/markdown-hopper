'use babel';

import { Range } from 'atom';

import { getActiveEditor } from '../atom-aliases';
import CursorPositionRestorer from './cursor-position-restorer';

/*
 * 引数で渡された関数を実行した後、カーソルの位置を元に戻します。
 */
const withCursorRestore = f => {
  const restorer = new CursorPositionRestorer();
  f(getActiveEditor());
  restorer.restore();
};

/**
 * 引数で渡された Line （または Line の配列）をfoldします。
 * 第２引数で正規表現が渡された場合は、行の文字列のうち、その正規表現にマッチする箇所のみをfoldします。
 */
export const fold = (line, opt_regexp) => {
  const lines = (line.length === undefined) ? [ line ] : line;

  if (lines.length === 0) return;

  foldLines(lines, opt_regexp);
};

/*
 * 引数で渡された行をfoldします。
 * 第２引数で正規表現が渡された場合は、行の文字列のうち、その正規表現にマッチする箇所のみをfoldします。
 */
const foldLines = (lines, opt_regexp) => {
  const ranges = lines.map(line => line.range(opt_regexp));

  withCursorRestore(editor => {
    editor.setSelectedBufferRanges(ranges);
    editor.getSelections().forEach(selection => selection.fold());
  });
}

export const unfoldLines = lines => {
  if (lines.length === 0) return;

  const editor = util.editor();
  lines.forEach(line => editor.unfoldBufferRow(line.row));
}
