'use babel';

import { Point } from 'atom';
import path from 'path';
// Anchor
import Anchor from './anchor';
import aHelper from './anchor-helper';
import { Events } from './notifier';
import Header from '../core/markdown/header';
import LinkNotifier from './notifier';
import { withJumpHistoryRegister } from './jump-history';
// Utility
import { getActiveEditor } from '../utility/atom-aliases';
import { getCurrentFilePath } from '../utility/path';
import File from '../utility/file';
import LinkHelper from './link-helper';

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

  static fromMarkdownText(text) {
    const filepathRegExp = /.*\[.*\]\s*\(([^#]*).*\)/;
    let filepath = text.replace(filepathRegExp, '$1');

    // Is relative path ?
    if (!(/^\/|^[\l\u]:/.test(filepath))) {
      filepath = `${getCurrentFilePath().getDirPath()}/${filepath}`;
    }

    const titleRegExp = /.*\[(.*)\]\s*\(.*\)/;
    const title = text.replace(titleRegExp, '$1');

    const imageRegExp = /.*!\[.*\]\s*\(.*\)/;
    const isImageLink = imageRegExp.test(text);

    const anchorName = LinkHelper.getAnchorPathFromMarkdown(text);
    const anchor = Anchor.fromText(anchorName);

    return new Link(
      filepath ? filepath : getCurrentFilePath().absolute, title, {
      anchor, isImageLink
    });
  }

  open() {
    const file = new File(this.filePath); // Original class

    withJumpHistoryRegister(() => {
      file.open().setCursor(editor => {
        if (this.anchor) {
          const header = this.searchTargetHeader(editor, this.anchor.name);
          return header ? Point(header.line.row, 0) : Point(0, 0);
        }
      });
    });
  }

  searchTargetHeader(editor, anchorName) {
    const headers = Header.all();

    let targetHeader = null;
    headers.forEach(header => {
      if (header.line.row === 0) return;

      const anchorLine = editor.lineTextForBufferRow(header.line.row - 1);
      const name = anchorLine.replace(Anchor.REGEXP, '$1');
      if (name && name === anchorName) {
        targetHeader = header;
      }
    });

    if (!targetHeader) {
     this.notifier.anchorNotFound(anchorName);
    }

    return targetHeader;
  }

}
