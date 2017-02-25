'use babel';

import path from 'path';
import os from 'os';

import { getActiveEditor, getActivePaneItem } from './atom-aliases';
import { IS_WINDOWS } from './platform';

const ROOT_DIR = '/';
export const root = () => ROOT_DIR;

export const home = () => os.homedir();

export const getCurrentFilePath = () => {
  const file = getActivePaneItem().file;
  const path = file ? file.path : getActiveEditor().getPath();

  return createAdaptedPath(path);
};

export const createAdaptedPath = path => {
  return new AdaptedPath(path);
}

const resolveHome = path => path.replace(/^~/, home());

export const pwd = () => getActiveEditor().getDirPath();

class AdaptedPath {

  original = null;

  homeResolved = null;

  //
  absolute = null;

  windowsProperties = null;

  constructor(path) {
    this.original = path;

    this.homeResolved = path ? resolveHome(path) : getCurrentFilePath();

    if (IS_WINDOWS) {
      const parts = this.homeResolved.split(':');

      const driveLetter = parts[0]; // drive letter ('C':Foo\Bar\baz.txt)
      const rest = parts[1]; // rest (C:'Foo\Bar\baz.txt')

      // Convert 'C:\Foo\Bar\baz.txt' to '/c/Foo/Bar/baz.txt'
      this.absolute = `${ROOT_DIR}${driveLetter}${rest.replace(/\\/g, '/')}`;

      this.windowsProperties = { driveLetter, rest };
    } else {
      this.absolute = this.homeResolved
    }
  }

  isEmpty() {
    return !this.absolute;
  }

  getFileName() {
    return this.absolute ? this.absolute.split('/').pop() : null;
  }

  getDirPath() {
    const pathParts = this.absolute.split('/');
    const dirPathParts = pathParts.slice(0, pathParts.length - 1);
    return dirPathParts.join('/');
  }

  getExt() {
    const name = this.getFileName();
    return name ? name.split('.').pop() : null;
  }

  isExt(fileExtension) {
    const ext = this.getExt();
    return ext && ext.endsWith(fileExtension);
  }

  // resolveToPlatformed(unixPath) {
  //   if (unixPath === null) {
  //     return null;
  //   } if (this.isWindows()) {
  //     const filePathParts = unixPath.slice('/'.length).split('/');
  //
  //     const driveLetter = filePathParts[0];
  //     const rest = filePathParts.slice(1);
  //     return driveLetter + ':\\' + rest.join(path.sep);
  //   } else {
  //     return unixPath;
  //   }
  // }

}
