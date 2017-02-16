'use babel';

import Notifier from '../notification/notifier';

export class CheckboxUtilityNotifier extends Notifier {

  checked() {
    const text = 'WOW! YOU DID IT!';
    this.informOn(this.VERBOSE, text);
  }

}
