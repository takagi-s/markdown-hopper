'use babel';

import { SelectListView, $ } from 'atom-space-pen-views';
import Header from '../core/markdown/header';
import { getCursorRow, setCursorRow } from '../utility/editor/editor';

const PACKAGE_NAME = 'markdown-hopper';
const EMPTY_HEADER_TITLE = '(Empty Title)'

export const TOC_VIEW_CLASS_NAME = PACKAGE_NAME + '-toc-view';
const FILTER_MODE = {
  LEVEL: 'level',
  WORDS: 'words'
}

export default class MarkdownTocView extends SelectListView {

  filterMode: null;
  foldingHeader: null;

  constructor() {
    super();
    this.addClass('markdown-hopper');
    this.panel = this.panel || atom.workspace.addModalPanel({
      item: this.element, // see SelectListView
      visible: false
    });
  }

  show() {
    this.setItems(Header.all());
    this.panel.show();
    this.focusFilterEditor();
  }

  hide() {
    this.cancel();
  }

  getFilterKey() {
    return 'filterTarget';
  }

  setItems(headers) {
    const models = headers.map(header => {
      const titleForView = header.title || EMPTY_HEADER_TITLE;
      const filterTarget = titleForView.toLowerCase();

      const rowNumber = header.line.row;
      const lineNumber = rowNumber + 1;

      const levelNumber = header.level;
      const levelText = '#'.repeat(levelNumber);

      const ancestorTitlesForView = header.ancestors.map(
        ancestor => '"' + (ancestor.title || EMPTY_HEADER_TITLE) + '"'
      );

      const foldTargets = header.foldTargets || [];
      const isFolded = !!header.isFolded;

      return Object.assign({}, header, {
        titleForView,
        filterTarget,
        rowNumber,
        lineNumber,
        levelNumber,
        levelText,
        ancestorTitlesForView,
        foldTargets,
        isFolded
      });
    });

    super.setItems(models);
  }

  viewForItem(header) {
    if (header.isFolded) {
      return null;
    }

    var className = null;
    var padding = null;
    switch (this.filterMode) {
      case FILTER_MODE.WORDS:
      className = 'search-result';
      padding = '';
      break;

      default:
      className = `level level${header.levelNumber}`;
      padding = `<div class="${PACKAGE_NAME}-padding ${PACKAGE_NAME}-padding-${header.levelNumber}">${'<span></span>'.repeat(header.levelNumber)}</div>`;
      break;
    }

    const foldHint = (header.foldTargets && header.foldTargets.length > 0) ? `- Folding ${header.foldTargets.length} item(s)` : '';

    const levelHint = `<span class="${PACKAGE_NAME}-level-hint">Level: ${header.levelText}</span>`;

    const pathHint =
      this.filterMode === FILTER_MODE.WORDS ?
      `<span class="${PACKAGE_NAME}-path-hint">${header.ancestorTitlesForView.join(' -> ')}</span>`
      : '';

    const itemView =
    `<li class="${className}">
      <div class="${PACKAGE_NAME}-content">
        <div class="${PACKAGE_NAME}-path-hint" style="text-align: right;">${pathHint}</div>
        <div class="${PACKAGE_NAME}-header">
          <span class="${PACKAGE_NAME}-header">${header.titleForView}</span>
          <span>${foldHint}</span>
        </div>
        <div class="${PACKAGE_NAME}-hint-line"><span>Line: ${header.lineNumber}</span></div>
      </div>
    </li>`;

    return itemView;
  }

  populateList() {
    const filteredItems = this.filter(
      this.items,
      this.getFilterQuery(),
      this.getFilterKey()
    );

    this.list.empty();
    if (filteredItems.length) {
      this.setError(null);
      filteredItems.forEach(item => {
        const itemView = $(this.viewForItem(item))
        itemView.data('select-list-item', item);
        this.list.append(itemView);
      });

      switch (this.filterMode) {
        case FILTER_MODE.WORDS:
        this.selectItemView(this.list.find('li:first'));
        break;
        default:
        if (this.foldingHeader) {
          this.setFocus(this.foldingHeader.line.row);
        } else {
          this.focusCurrentHeader();
        }
        break;
      }
    } else {
      this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
    }
    this.foldingHeader = null;
  }

  filter(items, filterQuery, filterKey) {
    if (filterQuery.length) {
      const cleanedItems = items.map(item => Object.assign({}, item, {
        foldTarges: [],
        isFolded: false
      }));

      const queries = filterQuery.split(/\s/);

      if (queries.length === 1 && /^#+$/.test(queries[0])) {
        // filter by header level
        this.filterMode = FILTER_MODE.LEVEL;
        const level = queries[0].length;
        return cleanedItems.filter(item => item.levelNumber <= level);
      } else {
        this.filterMode = FILTER_MODE.WORDS;
        const words = queries.map(query => query.toLowerCase());
        const filtered = cleanedItems.filter(item => {
          const val = item[filterKey];
          return val && words.every(word => val.includes(word));
        });
        return filtered;
      }
    } else {
      this.filterMode = null;
      return items;
    }
  }

  confirmed(header) {
    setCursorRow(header.rowNumber);
    this.cancel();
  }

  cancel() {
    super.cancel();
    this.panel.hide();
    atom.workspace.getActivePane().activate();
  }

  setFocus(row) {
    var focusIndex = null;

    const dataList = this.list.children().views().map(view => view.data('select-list-item'));
    const exactIndex = dataList.findIndex(data => data.position.row === row);
    if (exactIndex !== -1) {
      focusIndex = exactIndex;
    } else {
      const nextHeaderIndex = dataList.findIndex(data => data.position.row > row);
      focusIndex = (nextHeaderIndex === -1) ? /* last one */ dataList.length - 1 : nextHeaderIndex - 1;
    }
    const view = this.list.children().views()[focusIndex];
    const me = this;
    setTimeout(() => { me.selectItemView(view) }, this.inputThrottle + 5);
  }

  focusCurrentHeader(){
    this.setFocus(getCursorRow());
  }

  foldTocViewHeader() {
    const selectedHeader = this.getSelectedItem();
    if (selectedHeader.foldTargets.length) {
      const newItems = this.items.map(item => {
        if (selectedHeader.line.row === item.line.row) {
          return Object.assign({}, item, {
            foldTargets: []
          });
        } else if (selectedHeader.foldTargets.some(target => target.line.row === item.line.row)) {
          return Object.assign({}, item, {
            isFolded: false
          });
        } else {
          return item
        }
      });
      this.foldingHeader = selectedHeader;
      this.setItems(newItems);
    } else {
      const foldTargetHeaders = this.items.filter(item => Header.isAncestorOf(selectedHeader, item));
      if (foldTargetHeaders.length) {
        const newItems = this.items.map(item => {
          if (selectedHeader.line.row === item.line.row) {
            return Object.assign({}, item, {
              foldTargets: foldTargetHeaders
            });
          } else if (foldTargetHeaders.some(header => header.line.row === item.line.row)) {
            return Object.assign({}, item, {
              foldTargets: [],
              isFolded: true
            });
          } else {
            return item
          }
        });
        this.foldingHeader = selectedHeader;
        this.setItems(newItems);
      }
    }
  }

}
