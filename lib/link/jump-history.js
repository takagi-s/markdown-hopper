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
  histories.push(new JumpHistory(path, point, line));
}

export const setCurrentHistory = history => currentIndex = histories.indexOf(history);

export const getJumpHistories = () => {
  return histories;
}

export const getCurrentHistoryIndex = () => currentIndex;

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
