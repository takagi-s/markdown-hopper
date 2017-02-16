'use babel';

import Link from './link';
import LinkOpener from './link-opener';
import Header from '../core/markdown/header';
import { MarkdownConfigManager, FILE_LINK_TITLE } from '../config/markdown-config';
import util from '../utility';

class LinkHelper {

  getTitleRange(linkLine) {
    return linkLine.rangeByRegExp(/^.*\[(.*)\].*$/);
  }

  createLinkToFile() {
    const path = util.path();
    switch (util.ext()) {
      case 'md':
        const title =
          (MarkdownConfigManager.getFileLinkTitle() === FILE_LINK_TITLE.FIRST_HEADER_TITLE) ?
            Header.first().title : util.fileName();
        return new Link(path, title);
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'gif':
      case 'bmp':
        return new Link(path, util.fileName(), {isImageLink: true});
      default:
        return new Link(path, util.fileName());
    }
  }

  createLinkToAnchor(anchor) {
    return new Link(util.path(), Header.first().title, {anchor});
  }

  createLinksToAnchors(anchors) {
    return anchors.map(anchor => new Link(util.path(), Header.first().title, {anchor}));
  }

  getLinkPathFromMarkdown(text) {
    return text.replace(/^.*\[.*\]\((.+)\).*$/, '$1');
  }

  getFilePathFromMarkdown(text) {
    const filePath = this.getLinkPathFromMarkdown(text);
    return filePath.startsWith('#') ? null : util.pwd() + '/' + filePath.split('#')[0];
  }

  getAnchorPathFromMarkdown(text) {
    const linkPath = this.getLinkPathFromMarkdown(text);
    const parts = linkPath.split('#');
    return parts.length >= 2 ? parts.pop() : null;
  }

  getOpener(cursorMoveHistoryRegistry) {
    return new LinkOpener(cursorMoveHistoryRegistry);
  }

}

export default new LinkHelper();
