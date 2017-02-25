'use babel';

import { Range, Point } from 'atom'

import { getActiveEditor } from '../atom-aliases';
import Line from './line';

export const setCursorPosition = pos => getActiveEditor().setCursorBufferPosition(pos);

export const getCursorPosition = () => getActiveEditor().getCursorBufferPosition();

/**
 * 引数で指定されたrangeを選択します。
 */
export const selectRange = range => getActiveEditor().setSelectedBufferRange(range);

export const getCurrentLine = () => {
  const row = getCursorRow();
  return new Line(row, getLineText(row));
};

/**
 * 現在アクティブになっているTextEditorのBufferの行の配列を返します。
 */
export const getLines = () => getActiveEditor().getBuffer().getLines().map((text, index) => new Line(index, text));

export const setCursor = pos => getActiveEditor().setCursorBufferPosition(pos);

export const getCursor = () => getActiveEditor().getCursorBufferPosition();

export const setCursorRow = row => setCursor(new Point(row, 0));

export const getCursorRow = () => getCursor().row;

export const insertText = text => getActiveEditor().insertText(text);

export const getLineText = row => getActiveEditor().lineTextForBufferRow(row);

export const insertLineAt = (line, text) => {
  const insertAt = new Range(line.start, line.start);
  getActiveEditor().setTextInBufferRange(insertAt, `${text}\n`);
};

export const replaceLineText = (line, text) => getActiveEditor().setTextInBufferRange(line.range(), `${text}`);
