'use babel';

import { Point } from 'atom';
import path from 'path';
import util from '../utility';
// Anchor
import Anchor from './anchor';
import aHelper from './anchor-helper';

const ROOT_DIR = '/';

export default class Link {

  fileName: null;
  filePath: null;
  title: null;
  fullpath: null;
  anchor: false;

  constructor(filePath, title, {anchor = undefined, isImageLink = false} = {}) {
    this.fileName = filePath.split('/').pop();
    this.filePath = filePath;
    this.title = title;
    this.fullpath = anchor ? filePath + '#' + anchor.name : filePath;
    this.anchor = anchor;
    this.isImageLink = isImageLink;
  }

  getPathFrom(currentPath) {
    if (currentPath) {
      const targetPathWithoutAnchor = this.fullpath.replace(/#.*$/, '');
      const commonPath = this.getCommonPath(currentPath, targetPathWithoutAnchor);

      const targetDiffPath = this.fullpath.replace(commonPath, '');
      if (targetDiffPath.startsWith('#')) {
        return targetDiffPath;
      } else if (targetDiffPath.length === 0) {
        return null;
      } else {
        // currentPathとCommonpathとの差分
        const currentDiffPath = currentPath.replace(commonPath, '');
        const distanceToCommonPath = currentDiffPath.slice(ROOT_DIR.length).split('/').slice(1).map(pathPart => '..');
        if (distanceToCommonPath.length) {
          return distanceToCommonPath.join('/') + '/' + targetDiffPath.slice(ROOT_DIR.length);
        } else {
          return targetDiffPath.slice(ROOT_DIR.length);
        }
      }
    } else {
      return this.fullpath + (this.anchor ? '#' + this.anchor.name : '');
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

  getFileLinkTitle() {
    return this.title;
  }

  toTextForPaste(currentPath) {
    const relpath = this.getPathFrom(currentPath);
    const isToSamePage = relpath === null || relpath.startsWith('#');

    const fileLinkTitle = isToSamePage ? '' : this.getFileLinkTitle();
    const anchorLinkTitle = this.anchor ? this.anchor.targetHeader.title : '';

    const seperator = fileLinkTitle && anchorLinkTitle ? ' | ' : '';
    const linkTitle = fileLinkTitle + seperator + anchorLinkTitle;

    if (linkTitle || relpath) {
      return `${this.isImageLink ? '!' : ''}[${linkTitle}](${relpath})`;
    } else {
      return null;
    }
  }

  toString() {
    const headerTitle = this.anchor ? this.anchor.header.title : '';
    return `[${headerTitle}](${this.getPathFrom()})`;
  }

  static isLink(line) {
    /\[.*\]\(.+\)/.test(line.text);
  }

}
