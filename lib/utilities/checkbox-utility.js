'use babel';

import Line from '../core/line';
import Checkbox from '../core/markdown/checkbox';
import { CheckboxUtilityNotifier, CheckboxUtilityEvents } from './notifier';
import util from '../utility';

export class CheckboxUtility {

  cbNotifier = new CheckboxUtilityNotifier();

  isCheckboxLine(line) {
    return line.text.includes(Checkbox.REGEXP.EMPTY) || line.text.includes(Checkbox.REGEXP.CHECKED);
  }

  toggleCurrentLine() {
    this.toggle(Line.current());
  }

  toggle(line) {
    const adjustedLine = this.adjustFuzzyExpression(line);

    if (adjustedLine.text.includes(Checkbox.REGEXP.EMPTY)) {
      util.replaceLineText(adjustedLine, adjustedLine.text.replace(Checkbox.REGEXP.EMPTY, Checkbox.REGEXP.CHECKED));
      this.cbNotifier.checked();
    } else if (adjustedLine.text.includes(Checkbox.REGEXP.CHECKED)) {
      util.replaceLineText(adjustedLine, adjustedLine.text.replace(Checkbox.REGEXP.CHECKED, Checkbox.REGEXP.EMPTY));
    }
  }

  convertToCheckboxLine(line) {
    if (line.isListLine()) {
      util.replaceLineText(line, line.text.replace(/^(\s*)-\s*(.*)$/, '$1- [ ] $2'));
    } else if (line.isEmpty()) {
      util.replaceLineText(line, '- [ ] ');
    }
  }

  adjustFuzzyExpression(line) {
    return line.setText(line.text.replace(/^(\s*)-\s*\[([\sx]?)\]\s*(.*)$/, '$1- [$2] $3'));
  }

  registerNotifications(notifier) {
    this.cbNotifier = new CheckboxUtilityNotifier(notifier);
    notifier.on(CheckboxUtilityEvents.CHECK, cbNotifier.check.bind(cbNotifier));
  }

}

export default new CheckboxUtility();
