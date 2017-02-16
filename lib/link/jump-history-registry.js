'use babel';

import JumpHistory from './jump-history';

export default class JumpHistoryRegistry {

  histories: [];

  constructor() {
    this.histories = [];
  }

  save(path, point) {
    this.histories.push(new JumpHistory(path, point));
  }

  pop() {
    const history = this.histories.pop();

    if (this.callbackOnPop) {
      this.callbackOnPop(history);
    }

    return history;
  }

  onPop(callback) {
    this.callbackOnPop = callback;
  }

}
