'use babel';

// Atom
import { CompositeDisposable, Range, Point, File } from 'atom';

// markdown-hopper
import config from './config';
import { MarkdownConfigManager } from './config/markdown-config';
import Link from './link/manager';
import Fold from './fold/manager';
import CheckboxUtility from './utilities/checkbox-utility';
import LoadingView from './views/loading-view';
import MarkdownTocView from './views/md-toc-view';
// Utility functions
import { TOC_VIEW_CLASS_NAME } from './views/md-toc-view';
import util from './utility';

/* hopper object. */
const hopper = {
  link: Link,
  fold: Fold,
  checkboxUtility: CheckboxUtility
};

export default {

  config,

  subscriptions: null,
  markdownHopperView: null,
  loadingModal: null,
  tocModal: null,

  activate(state) {
    this.loadingView = new LoadingView(state.loadingViewState);
    this.tocView = new MarkdownTocView(state.markdownTocViewState);

    hopper.link.setLoadingView(this.loadingView);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'markdown-hopper:create-link-to-file': () => hopper.link.createLinkToFile()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace atom-text-editor', {
      // Link
      'markdown-hopper:jump-forward': () => hopper.link.jumpForward(),
      'markdown-hopper:jump-backward': () => hopper.link.jumpBackward(),
      'markdown-hopper:create-link-to-header': () => hopper.link.createLinkToHeader(),
      'markdown-hopper:paste-link': () => hopper.link.pasteLastRegisteredLink(),
      'markdown-hopper:create-table-of-contents': () => hopper.link.createTOC(),
      'markdown-hopper:paste-table-of-contents': () => hopper.link.pasteLastRegisteredTOC(6),
      'markdown-hopper:paste-table-of-contents-level-2': () => hopper.link.pasteLastRegisteredTOC(2),
      'markdown-hopper:paste-table-of-contents-level-3': () => hopper.link.pasteLastRegisteredTOC(3),
      'markdown-hopper:paste-table-of-contents-level-4': () => hopper.link.pasteLastRegisteredTOC(4),
      'markdown-hopper:paste-table-of-contents-level-5': () => hopper.link.pasteLastRegisteredTOC(5),
      'markdown-hopper:paste-table-of-contents-level-6': () => hopper.link.pasteLastRegisteredTOC(6),
      'markdown-hopper:paste-http-link': () => hopper.link.pasteHttpLink(),
      // Fold
      'markdown-hopper:toggle-fold': () => hopper.fold.toggleFold(),
      'markdown-hopper:toggle-fold-anchors': () => hopper.fold.toggelFoldAnchors(),
      'markdown-hopper:fold-links': () => hopper.fold.foldLinks(),
      'markdown-hopper:fold-all': () => hopper.fold.foldAll(),
      'markdown-hopper:prefomatted-area-utility': () => hopper.fold.preformattedAreaUtilityFunction(),
      // Utilities
      'markdown-hopper:checkbox-utility': () => hopper.checkboxUtility.toggleCurrentLine(),
      // View
      'markdown-hopper:toggle-markdown-toc-view': () => this.toggleMarkdownTOC()
    }));

    this.subscriptions.add(atom.commands.add('.' + TOC_VIEW_CLASS_NAME, {
      'markdown-hopper:toc-view-fold-header': () => this.foldTocViewHeader(),
      'markdown-hopper:focus-current-header': () => this.focusCurrentHeader()
    }));

    atom.workspace.onDidOpen(this.onDidOpen);
  },

  onDidOpen(item) {
    const fileName = util.fileName();

    if (fileName && fileName.endsWith('.md')) {
      if (MarkdownConfigManager.isFoldAnchorsOnOpen()) {
        hopper.fold.foldAnchors();
      }
      if (MarkdownConfigManager.isFoldLinksOnOpen()) {
        hopper.fold.foldLinks();
      }
    }
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();

    this.markdownHopperView.destroy();
  },

  checkboxUtilityFunction() {
    const line = LineHelper.currentLine();
    if (CheckboxHelper.isCheckboxLine(line)) {
      CheckboxHelper.toggle(line);
    } else {
      CheckboxHelper.convertToCheckboxLine(line);
    }
  },

  toggleLoadingView() {
    this.loadingView.isVisible() ? this.loadingView.hide() : this.loadingView.show();
  },

  toggleMarkdownTOC() {
    this.tocView.panel.isVisible() ? this.hideTocView() : this.showTocView();
  },

  foldTocViewHeader() {
    this.tocView.foldTocViewHeader();
  },

  focusCurrentHeader() {
    this.tocView.focusCurrentHeader();
  },

  showTocView() {
    this.tocView.show();
  },

  hideTocView() {
    this.tocView.hide();
  }

};
