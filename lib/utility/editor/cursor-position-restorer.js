'use babel';

import { getCursorPosition, setCursorPosition } from './editor';

export default class CursorPositionRestorer {

  position;

  constructor() {
    this.position = getCursorPosition();
  }

  restore() {
    setCursorPosition(this.position);
  }

}
