'use babel';

//
import Line from '../core/line';
import Fold from '../fold/fold';
// Link
import Anchor from './anchor';
import AnchorHelper from './anchor-helper';
import Link from './link';
import LinkHelper from './link-helper';
import LinkRegistry from './link-registry';
import Header from '../core/markdown/header';
import HttpLink from './http-link';
// Jump
import JumpHistory from './jump-history';
import JumpHistoryRegistry from './jump-history-registry';
// TOC
import Toc from './toc';
import TocRegistry from './toc-registry';
// Notification
import LinkNotifier from './notifier';
// utility
import util from '../utility';


class LinkManager {

  linkRegistry = new LinkRegistry();
  tocRegistry = new TocRegistry();
  jumpHistoryRegistry = new JumpHistoryRegistry();
  notifier = new LinkNotifier();
  loadingView = null;

  jumpForward() {
    const currentLine = Line.current();

    if (currentLine.isMarkdownLink()) {
      if (currentLine.isPublicLink()) {
        const a = document.createElement('a');
        const link = LinkHelper.getLinkPathFromMarkdown(currentLine.text);
        location.href = link;
      } else {
        const filePath = LinkHelper.getFilePathFromMarkdown(currentLine.text);
        const anchorPath = LinkHelper.getAnchorPathFromMarkdown(currentLine.text);
        LinkHelper.getOpener(this.jumpHistoryRegistry).open(filePath, anchorPath);
        this.notifier.jumpedForward();
      }
    } else {
      this.notifier.notLinkLine();
    }
  }

  jumpBackward() {
    // Pop the most recent history
    const history = this.jumpHistoryRegistry.pop();
    if (history) {
      util.open(history.filePath, history.point);
    }
    this.notifier.jumpedBackward(history);
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
    const header = Header.at(util.cursorPosition());

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

      Fold.foldLine(newAnchor.line);
    }
  }

  pasteLastRegisteredLink() {
    const link = this.linkRegistry.getLastRegistered();

    if (link) {
      const linkText = link.toTextForPaste(util.path());
      if (linkText) {
        util.insertText(linkText);
        const currentLine = Line.current();
        if (atom.config.get('shin-markdown.fileLink.foldLinkPathOnPaste')) {
          Fold.foldLinkLine(currentLine);
        }
        util.select(LinkHelper.getTitleRange(currentLine));

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

    Fold.foldLines(Line.lines().filter(line =>
      Anchor.REGEXP.test(line.text)
    ));

    this.tocRegistry.push(LinkHelper.createLinksToAnchors(anchors));
  }

  pasteLastRegisteredTOC(headerLevel) {
    const anchorLinks = this.tocRegistry.last();

    if (anchorLinks) {
      const toc = anchorLinks.map(anchorLink => {
        if (anchorLink.anchor.targetHeader.level > headerLevel) return null;

        var listItemTitle = null;

        const indent = util.repeat(' ', (anchorLink.anchor.targetHeader.level - 2) * 2);
        const li = '-';

        const path = anchorLink.getPathFrom(util.path());

        return `${indent}${li} [${anchorLink.anchor.targetHeader.title}](${path})`;
      }).filter(tocItem => tocItem !== null);

      var tocHeaderAdjustedTOC = null;
      const sampleAnchorLink = anchorLinks[0];
      if (sampleAnchorLink.filePath !== util.path()) {
        const level = 1;
        const indent = util.repeat(' ', (level - 1) * 2);
        const li = '-';
        const filePath = sampleAnchorLink.getPathFrom(util.path()).replace(/#.*$/, '');

        const tocHeaderItem = `${indent}${li} [${sampleAnchorLink.getFileLinkTitle()}](${filePath})`;
        tocHeaderAdjustedTOC = [tocHeaderItem].concat(toc);
      } else {
        tocHeaderAdjustedTOC = toc;
      }

      util.insertText(tocHeaderAdjustedTOC.join('\n') + `\n`);
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
