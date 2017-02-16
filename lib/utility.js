'use babel';

import { Range, Point } from 'atom'
import path from 'path';
import os from 'os';

const ROOT_DIR = "/";

const CHAR_CODE = {
  ZERO: '0'.charCodeAt(),
  NINE: '9'.charCodeAt(),
  A: 'A'.charCodeAt(),
  Z: 'Z'.charCodeAt()
};

const SMALL_ALPHABET_OFFSET = 32;

export class Utilities {

  root = () => ROOT_DIR;
  home = () => os.homedir();

  editor() {
    return atom.workspace.getActiveTextEditor();
  }

  fileName(path) {
    var filePath = path || this.path();
    return filePath ? filePath.split('/').pop() : undefined;
  }

  dir(path) {
    const pathParts = path.split('/');
    const currentDirPathParts = pathParts.slice(0, pathParts.length - 1);
    return currentDirPathParts.join('/');
  }

  dirName(path) {
    return path.split('/').pop();
  }

  path() {
    return this.unixPath();
  }

  ext(fileName) {
    const name = fileName || this.fileName();
    return name.split('.').pop();
  }

  lines() {
    return this.editor().getBuffer().getLines();
  }

  unixPath() {
    const file = atom.workspace.getActivePaneItem().file;
    const path = file ? file.path : this.editor().getPath();
    return this.resolveToUNIX(path);
  }

  select(range) {
    this.editor().setSelectedBufferRange(range);
  }

  resolveToUNIX(filePath) {
    if (filePath === null) {
      return null;
    } else if (this.isWindows()) {
      // Get drive letter ('C:'Foo\Bar\baz.txt)
      const driveLetter = filePath.charAt(0);
      // Get rest (C:'Foo\Bar\baz.txt')
      const rest = filePath.slice(2);
      // Convert 'Foo\Bar\baz.txt' to 'Foo/Bar/baz.txt'
      const replaced = rest.replace(/\\/g, '/');
      // Make '/Foo/Bar/baz.txt'
      return ROOT_DIR + driveLetter + replaced;
    } else {
      return filePath;
    }
  }

  resolveToPlatformed(unixPath) {
    if (unixPath === null) {
      return null;
    } if (this.isWindows()) {
      const filePathParts = unixPath.slice('/'.length).split('/');

      const driveLetter = filePathParts[0];
      const rest = filePathParts.slice(1);
      return driveLetter + ':\\' + rest.join(path.sep);
    } else {
      return unixPath;
    }
  }

  resolveHome(path) {
    return path.replace(/\$\{home\}/g, this.home()).replace(/^~/, this.home());
  }

  pwd() {
    return this.dir(this.path());
  }

  isWindows() {
    return path.sep === '\\';
  }

  cursorRow(row) {
    this.cursorPosition(new Point(row, 0));
  }

  cursorPosition(position) {
    if (position) {
      this.editor().setCursorBufferPosition(position);
    } else {
      return this.editor().getCursorBufferPosition();
    }
  }

  currentRow() {
    return this.cursorPosition().row;
  }

  insertLineAt(line, text) {
    const insertAt = new Range(line.start, line.start);
    this.editor().setTextInBufferRange(insertAt, `${text}\n`);
  }

  replaceLineText(line, text) {
    this.editor().setTextInBufferRange(line.range(), `${text}`);
  }

  insertText(text) {
    this.editor().insertText(text);
  }

  lineText(row) {
    return this.editor().lineTextForBufferRow(row);
  }

  repeat(char, length) {
    var res = '';
    while (res.length < length) {
      res += char;
    }
    return res;
  }

  open(unixPath, point) {
    this.openWithCallback(unixPath, () => this.cursorPosition(point));
  }

  openWithDefaultContent(unixPath, defaultContent) {
    this.openWithCallback(unixPath, () => {
      const lines = this.lines();
      if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
        this.insertText(defaultContent);
      } else {
        // none
      }
    });
  }

  openWithCallback(unixPath, callback) {
    const osPath = this.resolveToPlatformed(unixPath);
    atom.workspace.open(osPath).then(callback);
  }

  ordinal(number) {
    const secondDigit = (number + '').substr(-2, 1);
    if (secondDigit === '1') {
      return number + 'th';
    } else {
      switch ((number + '').substr(-1, 1)) {
        case '1': return number + 'st';
        case '2': return number + 'nd';
        case '3': return number + 'rd';
        default: return number + 'th';
      }
    }
  }

  generateRandomString(length) {
    var name = '';
    while (name.length < length) {
      name += this.generateRandomNumberOrAphabet();
    }
    return name;
  }

  generateRandomNumberOrAphabet() {
    while (true) {
      const random = Math.floor(Math.random() * 100);
      if (CHAR_CODE.ZERO <= random && random <= CHAR_CODE.NINE) {
        // Number
        return String.fromCharCode(random);
      } else if (CHAR_CODE.A <= random && random <= CHAR_CODE.Z) {
        // Alphabet
        return String.fromCharCode(toSmallCaseCharCode(random));
      }
    }
  }

}

function toSmallCaseCharCode(largeAlphabetCharCode) {
  return largeAlphabetCharCode + SMALL_ALPHABET_OFFSET;
}

export default new Utilities();
