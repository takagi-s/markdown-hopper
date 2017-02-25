'use babel';

import Link from './link';
import Header from '../core/markdown/header';
import { MarkdownConfigManager, FILE_LINK_TITLE } from '../config/markdown-config';
import { getCurrentFilePath } from '../utility/path';

class LinkHelper {

  getTitleRange(linkLine) {
    return linkLine.rangeByRegExp(/^.*\[(.*)\].*$/);
  }

  createLinkToFile() {
    const path = getCurrentFilePath();
    switch (path.getExt()) {
      case 'md':
        const title =
          (MarkdownConfigManager.getFileLinkTitle() === FILE_LINK_TITLE.FIRST_HEADER_TITLE) ?
            Header.first().title : path.fileName();
        return new Link(path.absolute, title);
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'gif':
      case 'bmp':
        return new Link(path.absolute, path.fileName(), { isImageLink: true });
      default:
        return new Link(path.absolute, path.fileName());
    }
  }

  createLinkToAnchor(anchor) {
    return new Link(getCurrentFilePath().absolute, Header.first().title, {anchor});
  }

  createLinksToAnchors(anchors) {
    return anchors.map(anchor => new Link(getCurrentFilePath().absolute, Header.first().title, {anchor}));
  }

  getLinkPathFromMarkdown(text) {
    return text.replace(/^.*\[.*\]\((.+)\).*$/, '$1');
  }

  getFilePathFromMarkdown(text) {
    const filePath = this.getLinkPathFromMarkdown(text);
    return filePath.startsWith('#') ? null : getCurrentFilePath().getDirPath() + '/' + filePath.split('#')[0];
  }

  getAnchorPathFromMarkdown(text) {
    const linkPath = this.getLinkPathFromMarkdown(text);
    const parts = linkPath.split('#');
    return parts.length >= 2 ? parts.pop() : null;
  }

}

export default new LinkHelper();
