'use babel';

export default {
  order: 1,
  type: 'object',
  title: 'Notification',
  properties: {
    verboseLevel: {
      order: 1,
      title: 'Notification level（通知レベル）',
      type: 'string',
      default: 'verbose',
      enum: [
        {
          value: 'quiet',
          description: 'Quiet（動作時に通知が表示されません）'
        },
        {
          value: 'normal',
          description: 'Normal（いくつかの動作時に通知を表示します）'
        },
        {
          value: 'verbose',
          description: 'Verbose（多くの動作時に通知を表示します）'
        },
        {
          value: 'noisy',
          description: 'Noisy!'
        }
      ]
    }
  }
};

const KEY = {
  VERBOSE_LEVEL: `markdown-hopper.notification.verboseLevel`
}

export class NotificationConfigManager {

  static getVerboseLevel() {
    return atom.config.get(KEY.VERBOSE_LEVEL);
  }

}
