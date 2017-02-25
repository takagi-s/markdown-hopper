'use babel';

import { getCurrentFilePath } from '../utility/path';
import { getCursorPosition } from '../utility/editor/editor';

const histories = [];
let backwardIndex = 0;

export const withJumpHistoryRegister = f => {
  save(getCurrentFilePath().absolute, getCursorPosition());
  f();
};

const save = (path, point) => {
  histories.push(new JumpHistory(path, point));
}

export const getPreviousHistory = () => {
  const index = histories.length - 1 - backwardIndex++;
  const history = histories[index];

  if (this.callbackOnPop) {
    this.callbackOnPop(history);
  }

  return history;
}
//
// onPop(callback) {
//   this.callbackOnPop = callback;
// }

class JumpHistory {

  filePath: null;
  point: null;

  constructor(filePath, point) {
    this.filePath = filePath;
    this.point = point;
  }

}
