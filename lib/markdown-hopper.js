'use babel';

import MarkdownHopperView from './markdown-hopper-view';
import { CompositeDisposable } from 'atom';

export default {

  markdownHopperView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.markdownHopperView = new MarkdownHopperView(state.markdownHopperViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.markdownHopperView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'markdown-hopper:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.markdownHopperView.destroy();
  },

  serialize() {
    return {
      markdownHopperViewState: this.markdownHopperView.serialize()
    };
  },

  toggle() {
    console.log('MarkdownHopper was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
