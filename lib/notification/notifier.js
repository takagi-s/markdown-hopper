'use babel'

import { Emitter } from 'atom';

import { NotificationConfigManager } from '../config/notification-config';

export default class Notifier {

  NOISY = ['noisy'];
  VERBOSE = ['verbose', 'noisy'];
  NORMAL = ['normal', 'verbose', 'noisy'];
  QUIET = ['quiet', 'normal', 'verbose', 'noisy'];

  informOn(levels, text) {
    const configLevel = NotificationConfigManager.getVerboseLevel();

    if (levels.includes(configLevel)) {
      atom.notifications.addInfo(text);
    }
  }

  warnOn(levels, text) {
    const configLevel = NotificationConfigManager.getVerboseLevel();

    if (levels.includes(configLevel)) {
      atom.notifications.addWarning(text);
    }
  }

}
