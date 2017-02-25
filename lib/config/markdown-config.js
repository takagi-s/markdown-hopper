'use babel';

export const FILE_LINK_TITLE = {
  FIRST_HEADER_TITLE: 'first-header-title',
  FILE_NAME: 'file-name'
};

const KEY = {
  FILE_LINK: {
    TITLE: `markdown-hopper.markdown.fileLink.title`,
    FOLD: `markdown-hopper.markdown.fileLink.foldOnPaste`
  },
  HEADER_ANCHOR: {
    FOLD: `markdown-hopper.markdown.headerAnchor.foldOnGenerate`
  },
  ON_FILE_OPEN: {
    FOLD: {
      ANCHOR: `markdown-hopper.markdown.onFileOpen.fold.anchor`,
      LINK: `markdown-hopper.markdown.onFileOpen.fold.link`
    }
  }
}

const headerAnchor = {
  order: 2,
  title: 'アンカー',
  type: 'object',
  properties: {
    foldOnGenerate: {
      order: 1,
      title: 'アンカー生成時にfoldします',
      type: 'boolean',
      default: true
    }
  }
}

const onFileOpen = {
  order: 1,
  title: 'ファイルを開いた時の動作',
  type: 'object',
  properties: {
    fold: {
      order: 1,
      title: 'フォールディング',
      type: 'object',
      properties: {
        anchor: {
          order: 1,
          title: 'アンカー',
          type: 'boolean',
          default: true
        },
        link: {
          order: 2,
          title: 'リンク',
          type: 'boolean',
          default: false
        }
      }
    }
  }
}

const foldLinkPathOnPaste = {
  order: 1,
  title: 'Fold link path after paste.（リンクをペーストすると同時に、そのリンクのパスをfoldします）',
  type: 'boolean',
  default: false
};

const appendCurrentDirectory = {
  order: 2,
  title: '(未実装) Append \'./\' to auto generated relative links.（生成される相対パスの先頭に \'./\' を付加します）',
  type: 'boolean',
  default: true
};

const fileLink = {
  order: 2,
  title: 'Auto generated file link（自動生成されるリンク）',
  type: 'object',
  properties: {
    title: {
      order: 1,
      title: 'Link title（ファイルリンクのタイトル）',
      type: 'string',
      default: FILE_LINK_TITLE.FIRST_HEADER_TITLE,
      enum: [
        {
          value: FILE_LINK_TITLE.FIRST_HEADER_TITLE,
          description: 'Use the first header as the title of auto generated link.（最初のヘッダを利用します）'
        },
        {
          value: FILE_LINK_TITLE.FILE_NAME,
          description: 'Use the file name as the title of generated link.（ファイル名を利用します）'
        }
      ]
    },
    appendCurrentDirectory,
    foldLinkPathOnPaste
  }
};

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

const oddLevelListItem = {
  order: 1,
  title: 'Mark for odd level list item',
  type: 'string',
  default: '*',
  enum: [
    {value: '*', description: 'Use \'*\'' },
    {value: '-', description: 'Use \'-\'' }
  ]
};

const evenLevelListItem = {
  order: 2,
  title: 'Mark for even level list item',
  type: 'string',
  default: '-',
  enum: [
    {value: '*', description: 'Use \'*\'' },
    {value: '-', description: 'Use \'-\'' }
  ]
};

const markdownSyntax = {
  order: 3,
  title: 'Markdown syntax（Markdownのシンタックス）:',
  type: 'object',
  properties: {
    oddLevelListItem, evenLevelListItem
  }
};

export default {
  order: 2,
  title: 'Markdown',
  type: 'object',
  properties: {
    onFileOpen,
    headerAnchor,
    fileLink,
    markdownSyntax
  }
};

export class MarkdownConfigManager {

  static getFileLinkTitle() {
    return atom.config.get(KEY.FILE_LINK.TITLE);
  }

  static isFoldAnchorOnGenerate() {
    return atom.config.get(KEY.HEADER_ANCHOR.FOLD);
  }

  static isFoldLinkOnPaste() {
    return atom.config.get(KEY.FILE_LINK.FOLD);
  }

  static isFoldLinksOnOpen() {
    return atom.config.get(KEY.ON_FILE_OPEN.FOLD.LINK);
  }

  static isFoldAnchorsOnOpen() {
    return atom.config.get(KEY.ON_FILE_OPEN.FOLD.ANCHOR);
  }

}
