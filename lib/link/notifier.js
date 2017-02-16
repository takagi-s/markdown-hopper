'use babel';

import Notifier from '../notification/notifier';

export default class LinkNotifier extends Notifier {

  notLinkLine() {
    const text = "It's not Markdown link.";
    this.informOn(this.VERBOSE, text);
  }

  wroteAnchor(anchor) {
    const text = `Generated anchor for '${anchor.targetHeader.title}'`;
    this.informOn(this.VERBOSE, text);
  }

  anchorNotFound(anchorName) {
    const text = `COULD NOT FIND THE ANCHOR '${anchorName}'. YOUR LINK IS MAYBE BROKEN.`;
    this.warnOn(this.NORMAL, text);
  }

  pasteLink(link) {
    this.informOn(this.VERBOSE, `Link has been pasted.`);
  }

  pasteLinkToSameFile() {
    this.warnOn(this.NORMAL, `YOU CANNOT PASTE FILE LINK TO THE SAME FILE.`);
  }

  jumpedForward(link) {
    const text = null;
    this.informOn(this.VERBOSE, 'forward');
  }

  jumpedBackward(history) {
    if (history) {
      const p = history.point;
      const fileName = history.filePath.split('/').pop();
      this.informOn(this.VERBOSE, `Pop. (Row:${p.row}, Col:${p.column} @ ${fileName})`);
    } else {
      this.informOn(this.NORMAL, `NO FURTHER HISTORY to back.`);
    }
  }

  linkRegistered(link) {
    const fileName = link.fileName;
    if (link.anchor) {
      const headerTitle = link.anchor.targetHeader.title;
      this.informOn(this.VERBOSE, `Registered link to '${fileName}' > '${headerTitle}'`);
    } else {
      this.informOn(`Registered link to '${fileName}'`);
    }
  }

  noLinkRegistered() {
    this.informOn(this.NORMAL, "NO LINK has been registered.");
  }

}
