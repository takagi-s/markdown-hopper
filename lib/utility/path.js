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

  calculateRelativePathTo(other) {
    const otherPath = (typeof other === 'string') ? other : other.absolute;

    const commonPath = this.getCommonPath(this.absolute, otherPath);

    const targetDiffPath = otherPath.replace(commonPath, '');

    if (targetDiffPath.length === 0) {
      return null;
    } else {
      // currentPathとCommonpathとの差分
      const currentDiffPath = otherPath.replace(commonPath, '');
      const distanceToCommonPath = currentDiffPath.slice(ROOT_DIR.length).split('/').slice(1).map(pathPart => '..');
      if (distanceToCommonPath.length) {
        return distanceToCommonPath.join('/') + '/' + targetDiffPath.slice(ROOT_DIR.length);
      } else {
        return targetDiffPath.slice(ROOT_DIR.length);
      }
    }
  }

  calculateRelativePathFrom(other) {
    const otherPath = (typeof other === 'string') ? other : other.absolute;

    const commonPath = this.getCommonPath(this.absolute, otherPath);

    const targetDiffPath = this.absolute.replace(commonPath, '');

    if (targetDiffPath.length === 0) {
      return null;
    } else {
      // currentPathとCommonpathとの差分
      const currentDiffPath = this.absolute.replace(commonPath, '');
      const distanceToCommonPath = currentDiffPath.slice(ROOT_DIR.length).split('/').slice(1).map(pathPart => '..');
      if (distanceToCommonPath.length) {
        return distanceToCommonPath.join('/') + '/' + targetDiffPath.slice(ROOT_DIR.length);
      } else {
        return targetDiffPath.slice(ROOT_DIR.length);
      }
    }
  }

  getCommonPath(path1, path2) {
    const root = [ROOT_DIR];
    const path1Parts = root.concat(path1.split('/'));
    const path2Parts = root.concat(path2.split('/'));

    const commonPathParts = [];

    for (var i = 0; i < path1Parts.length; i++) {
      if (path1Parts[i] && path2Parts[i]) {
        if (path1Parts[i] === path2Parts[i]) {
          commonPathParts.push(path1Parts[i]);
          continue;
        } else {
          return commonPathParts.length === 1 ? '/' : '/' + commonPathParts.slice(1).join('/');
        }
      } else if (path2Parts[i]) {
        break;
      } else if (path1Parts[i]) {
        break;
      }
    }
    return '/' + commonPathParts.slice(1).join('/');
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
