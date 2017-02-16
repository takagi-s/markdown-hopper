'use babel';

export default class TocRegistry {

  registry = [];

  push(toc) {
    this.registry.push(toc);
  }

  last() {
    return this.registry[this.registry.length - 1];
  }

  pop(toc) {
    return this.registry.pop();
  }

}
