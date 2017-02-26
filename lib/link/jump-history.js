'use babel';

import { getCurrentFilePath } from '../utility/path';
import { getCursorPosition, getCurrentLine } from '../utility/editor/editor';

const histories = [];
let currentIndex = 0;

const historyStack = [];

export const withJumpHistoryRegister = f => {
  save(getCurrentFilePath().absolute, getCursorPosition(), getCurrentLine());
  f();
};

const save = (path, point, line) => {
  const history = new JumpHistory(path, point, line);
  histories.push(history);
  historyStack.push(history);
}

export const popJumpHistoryStack = () => historyStack.pop();

export const setCurrentHistory = history => currentIndex = histories.indexOf(history);

export const getJumpHistories = () => {
  return histories;
}

export const getCurrentHistoryIndex = () => currentIndex;

/**
 * Jumpの履歴を表現するクラス。
 */
class JumpHistory {

  filePath: null;
  point: null;
  line: null;

  constructor(filePath, point, line) {
    this.filePath = filePath;
    this.point = point;
    this.line = line;
  }

}
