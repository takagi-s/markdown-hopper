'use babel';

//
import { getCurrentLine, selectRange, getCursorPosition, insertText } from '../utility/editor/editor';
import { fold } from '../utility/editor/fold';
import { getCurrentFilePath } from '../utility/path';
import { repeat } from '../utility/string';
// Link
import Anchor from './anchor';
import AnchorHelper from './anchor-helper';
import Link from './link';
import LinkHelper from './link-helper';
import LinkRegistry from './link-registry';
import Header from '../core/markdown/header';
import HttpLink from './http-link';
// Jump
import { withJumpHistoryRegister, getPreviousHistory, setCurrentHistory } from './jump-history';
// TOC
import Toc from './toc';
import TocRegistry from './toc-registry';
// Notification
import LinkNotifier from './notifier';
// utility
import { MarkdownConfigManager } from '../config/markdown-config';

class LinkManager {

  linkRegistry = new LinkRegistry();
  tocRegistry = new TocRegistry();
  notifier = new LinkNotifier();
  loadingView = null;

  jumpForward() {
    const currentLine = getCurrentLine();

    if (currentLine.isMarkdownLink()) {
      Link.fromMarkdownText(currentLine.text).open();
    } else {
      this.notifier.notLinkLine();
    }
  }

  setLoadingView(loadingView) {
    this.loadingView = loadingView;
  }

  createLinkToFile() {
    const link = LinkHelper.createLinkToFile();
    this.linkRegistry.register(link);
    this.notifier.linkRegistered(link);
  }

  createLinkToHeader() {
    const fileLink = LinkHelper.createLinkToFile();
    const header = Header.at(getCursorPosition());

    if (!header) return;

    // insert <a> before the header
    const anchor = AnchorHelper.getAnchorFor(header);

    if (anchor) {
      const link = LinkHelper.createLinkToAnchor(anchor);
      this.linkRegistry.register(link);
    } else {
      const newAnchor = AnchorHelper.createAnchorFor(header);

      if (AnchorHelper.write(newAnchor)) this.notifier.wroteAnchor(newAnchor);

      const link = LinkHelper.createLinkToAnchor(newAnchor);
      this.linkRegistry.register(link);

      this.notifier.linkRegistered(link);

      fold(newAnchor.line);
    }
  }

  pasteLastRegisteredLink() {
    const link = this.linkRegistry.getLastRegistered();

    if (link) {
      const linkText = link.toTextForPaste(getCurrentFilePath().absolute);
      if (linkText) {
        insertText(linkText);
        const currentLine = getCurrentLine();
        if (MarkdownConfigManager.isFoldLinkOnPaste()) {
          fold(currentLine, /^.*[!]?\[.*\]\((.*)\).*$/);
        }
        selectRange(LinkHelper.getTitleRange(currentLine));

        this.notifier.pasteLink(link);
      } else {
        this.notifier.pasteLinkToSameFile();
      }
    } else {
      this.notifier.noLinkRegistered();
    }
  }

  createTOC() {
    const anchors = [];

    var anchorCreatedCount = 0;
    Header.all().forEach((header, index) => {
      const shiftAdjustedHeader = anchorCreatedCount ? header.shiftDown(anchorCreatedCount) : header;

      const anchor = AnchorHelper.getAnchorFor(shiftAdjustedHeader);
      if (anchor) {
        anchors.push(anchor);
      } else if (shiftAdjustedHeader.level === 1) {
        // NOOP
      } else {
        // Headerの位置を作成したAnchor分ずらす
        const newAnchor = AnchorHelper.createAnchorFor(shiftAdjustedHeader);

        if (AnchorHelper.write(newAnchor)) this.notifier.wroteAnchor(newAnchor);

        anchors.push(newAnchor);
        anchorCreatedCount++;
      }
    });

    if (MarkdownConfigManager.isFoldAnchorOnGenerate()) {
      fold(Line.lines().filter(line => Anchor.REGEXP.test(line.text)));
    }

    this.tocRegistry.push(LinkHelper.createLinksToAnchors(anchors));
  }

  pasteLastRegisteredTOC(headerLevel) {
    const anchorLinks = this.tocRegistry.last();

    if (anchorLinks) {
      const toc = anchorLinks.map(anchorLink => {
        if (anchorLink.anchor.targetHeader.level > headerLevel) return null;

        var listItemTitle = null;

        const indent = repeat(' ', (anchorLink.anchor.targetHeader.level - 2) * 2);
        const li = '-';

        const path = anchorLink.getPathFrom(getCurrentFilePath().absolute);

        return `${indent}${li} [${anchorLink.anchor.targetHeader.title}](${path})`;
      }).filter(tocItem => tocItem !== null);

      var tocHeaderAdjustedTOC = null;
      const sampleAnchorLink = anchorLinks[0];
      if (sampleAnchorLink.filePath !== getCurrentFilePath().absolute) {
        const level = 1;
        const indent = repeat(' ', (level - 1) * 2);
        const li = '-';
        const filePath = sampleAnchorLink.getPathFrom(getCurrentFilePath().absolute).replace(/#.*$/, '');

        const tocHeaderItem = `${indent}${li} [${sampleAnchorLink.getFileLinkTitle()}](${filePath})`;
        tocHeaderAdjustedTOC = [tocHeaderItem].concat(toc);
      } else {
        tocHeaderAdjustedTOC = toc;
      }

      insertText(tocHeaderAdjustedTOC.join('\n') + `\n`);
    }
  }

  pasteHttpLink() {
    const text = atom.clipboard.read();
    HttpLink.create(text, this.loadingView);
  }

  cleanAnchors() {
    // TODO
  }

}

export default new LinkManager();
