'use babel';

/**
 * 現在アクティブになっているTextEditorを返します。
 */
export const getActiveEditor = () => atom.workspace.getActiveTextEditor();

/**
 * 現在アクティブになっているPaneのItemを返します。
 */
export const getActivePaneItem = () => atom.workspace.getActivePaneItem();
