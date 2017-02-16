'use babel';

export default class LinkRegistry {

  registeredLinks = [];

  register(link) {
    this.registeredLinks.push(link);
  }

  getLastRegistered() {
    return this.registeredLinks[this.registeredLinks.length - 1];
  }

}
