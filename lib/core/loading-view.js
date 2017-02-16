'use babel';

export default class LoadingView {

  constructor(serializedState) {

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('markdown-hopper')

    //
    this.panel = this.panel || atom.workspace.addModalPanel({
      item: this.element,
      visible: false
    });

    //
    const loadingSpan = document.createElement('span');
    loadingSpan.classList.add('markdown-hopper');
    loadingSpan.classList.add('loading');
    loadingSpan.classList.add('loading-spinner-large');
    loadingSpan.classList.add('inline-block');

    this.element.appendChild(loadingSpan);

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Loading the title of the link...';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  static getInstance() {
    return singleton;
  }

  isVisible() {
    return this.panel.isVisible();
  }

  show() {
    this.panel.show();
  }

  hide() {
    this.panel.hide();
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  onStartLoading() {

  }

  onFinishLoading() {

  }

}
