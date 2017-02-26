'use babel';

import { SelectListView, $ } from 'atom-space-pen-views';
import { getCurrentFilePath } from '../utility/path';
import { getJumpHistories, getCurrentHistoryIndex, setCurrentHistory } from '../link/jump-history';
import File from '../utility/file';

export default class JumpHistoryView extends SelectListView {

  currentFilePath = null;

  constructor() {
    super();
    this.addClass('markdown-hopper');
    this.panel = this.panel || atom.workspace.addModalPanel({
      item: this.element, // see SelectListView
      visible: false
    });
  }

  toggle() {
    this.panel.isVisible() ? this.hide() : this.show();
  }

  show() {
    this.currentFilePath = getCurrentFilePath();
    this.setItems(getJumpHistories().reverse());
    this.panel.show();
    this.focusFilterEditor();
  }

  hide() {
    this.cancel();
  }

  setItems(jumpHistories) {
    super.setItems(jumpHistories);
  }

  viewForItem(jumpHistory) {
    const filePath = this.currentFilePath.calculateRelativePathTo(jumpHistory.filePath);

    return `<li class="jump-history">
      <div class="jump-history filePath">
        <samp>
          <span>${filePath ? filePath : this.currentFilePath.getFileName() + ' <i>(This file)</i>'}</span> (<span class="jump-history point row">Row: ${jumpHistory.point.row}</span>
          / <span class="jump-history point col">Col: ${jumpHistory.point.column}</span>)
        </samp>
      </div>
      <div>
        <pre>${jumpHistory.line.text}</pre>
      </div>
    </li>`;
  }

  populateList() {
    const filteredItems = this.filter(
      this.items,
      this.getFilterQuery()
    );

    this.list.empty();
    if (filteredItems.length) {
      this.setError(null);

      filteredItems.forEach(item => {
        const itemView = $(this.viewForItem(item))
        itemView.data('select-list-item', item);
        this.list.append(itemView);
      });

      this.selectItemView(this.list.find('li:first'));
      // const view = this.list.children().views()[getCurrentHistoryIndex()];
      // this.selectItemView(view);
    } else {
      this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
    }
  }

  filter(histories, filterQuery) {
    if (filterQuery.length) {
      const queries = filterQuery.split(/\s/);

      const queryWords = queries.map(query => query.toLowerCase());
      return histories.filter(history => {
        const val = history.filePath + history.line.text;
        return val && queryWords.every(word => val.includes(word));
      });
    } else {
      return histories;
    }
  }

  confirmed(jumpHistory) {
    File.open(jumpHistory.filePath).setCursor(jumpHistory.point);

    setCurrentHistory(jumpHistory);

    this.cancel();
  }

  cancel() {
    super.cancel();
    this.panel.hide();
    atom.workspace.getActivePane().activate();
  }

}
