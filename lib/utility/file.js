'use babel';

import { createAdaptedPath } from './path';
import { lines, setCursorPosition } from './editor/editor';

export default class File {

  path = null;

  constructor(path) {
    this.path = createAdaptedPath(path);
  }

  /**
   * @returns AtomFileOpenPromise
   */
  open() {
    return new FileOpenPromise(atom.workspace.open(this.path.absolute));
  }

  static open(path) {
    return new File(path).open();
  }

}

class FileOpenPromise {

  delegate = null;

  constructor(promise) {
    this.delegate = promise;
  }

  then(callback) {
    this.delegate.then(callback);
    return this;
  }

  /**
   * ファイルを開いた後、引数で指定された位置または関数で計算された位置にカーソルを移動します。
   */
  setCursor(position) {
    if (typeof position === 'function') {
      this.then(editor => {
        const pos = position(editor);
        setCursorPosition(pos);
      });
    } else {
      this.then(() => setCursorPosition(position));
    }

    return this;
  }

  /**
   * ファイルを開いた後、ファイルが空である場合に引数で渡した文字列をファイルに書き込みます。
   */
  setContentIfEmpty(content) {
    this.then(() => {
      const lines = lines();
      if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
        insertText(content);
      } else {
        // none
      }
    });

    return this;
  }

}
