
# markdown-hopper package

- [Japanese description](#header-39tjwjka11)
  - [機能の概要](#header-d6bfhu8bsu)
    - [見出しの一覧機能](#header-zvtcstfhvq)
    - [リンク機能](#header-dzrw8t2b7w)
    - [Markdownファイルの見出し行へのアンカー付加機能](#header-ky2ul2m3t9)
    - [Markdownファイルのリンク付き目次の生成機能](#header-pli2mfqq42)
    - [Markdownリンクの生成機能](#header-tgplipsna0)
    - [カーソル行の、以下のMarkdownリンクのリンク先への1コマンドでのジャンプ機能](#header-pbh5il843j)
    - [その他のユーティリティ](#header-0jhai0cq1b)
  - [プレフィックスキーとデフォルトキーバインドの体系](#header-nok6mp31cp)
  - [コマンドとデフォルトキーバインド](#header-fxnd5cn22h)
  - [設定について](#header-0klh5ave3m)
- [English description](#header-l2widefy0k)
- [Demo](#header-5xtrgleocc)
  - [Generate Table of Contents](#header-8ep2tij037)
- [Milestones](#header-det3zykzms)
  - [ver.0.2](#header-59zf34a3th)
  - [ver.0.3](#header-3sncgpd88v)
  - [ver.0.4](#header-g7nbvr5tmp)

<a name="header-39tjwjka11" class="markdown-hopper"></a>
## Japanese description

<a name="header-d6bfhu8bsu" class="markdown-hopper"></a>
### 機能の概要

主に以下の機能を提供します。

<a name="header-zvtcstfhvq" class="markdown-hopper"></a>
#### 見出しの一覧機能
- Markdownファイル内の見出し一覧を表示（ `` ）

<a name="header-dzrw8t2b7w" class="markdown-hopper"></a>
#### リンク機能

<a name="header-ky2ul2m3t9" class="markdown-hopper"></a>
#### Markdownファイルの見出し行へのアンカー付加機能
- Markdownファイル内の全ヘッダーへ、アンカーを1コマンドで自動付加
- カーソル行が属するセクションのヘッダーへ、アンカーを1コマンドで自動付加

<a name="header-pli2mfqq42" class="markdown-hopper"></a>
#### Markdownファイルのリンク付き目次の生成機能
- Markdownファイルのリンク付き目次を、アンカーを利用して1コマンドで自動生成
  * あるMarkdownファイルの目次を、他のMarkdownファイルから参照する形でも生成可能
  * 目次を生成するヘッダーのレベルを指定して生成可能

<a name="header-tgplipsna0" class="markdown-hopper"></a>
#### Markdownリンクの生成機能
- 他のファイルへのMarkdownリンクを、1〜2コマンドで生成
- アンカーが付加されたヘッダーへのMarkdownリンクを、1〜2コマンドで生成（他のMarkdownファイルのヘッダーも含む）

<a name="header-pbh5il843j" class="markdown-hopper"></a>
#### カーソル行の、以下のMarkdownリンクのリンク先への1コマンドでのジャンプ機能
- 他のファイルへのMarkdownリンク（リンク先がMarkdownである必要はない）
- 同一Markdownファイル内の、アンカーが付加されたヘッダーへのMarkdownリンク
- 他のMarkdownファイル内の、アンカーが付加されたヘッダーへのMarkdownリンク
- ジャンプしたリンク先から、リンク元へ戻る機能

<a name="header-0jhai0cq1b" class="markdown-hopper"></a>
#### その他のユーティリティ
- アンカータグやリンク先URIの非表示などの、各種fold機能
- チェックボックスのtoggle機能

<a name="header-nok6mp31cp" class="markdown-hopper"></a>
### プレフィックスキーとデフォルトキーバインドの体系

`Ctrl-c Ctrl-m` がデフォルトのプレフィックスキーになっています。

プレフィックスキーに続けて打つキーによって、大まかに機能が分かれます。
  - `(Ctrl-c Ctrl-m) Ctrl-l` : リンク生成系の機能
  - `(Ctrl-c Ctrl-m) Ctrl-p` : 生成したリンクのペースト系の機能
  - `(Ctrl-c Ctrl-m) Ctrl-f` : fold系の機能
  - `(Ctrl-c Ctrl-m) Ctrl-m` : その他のMarkdown用のユーティリティ系の機能

なお、大部分の操作は上記の体系に即したキーバインドによって行うことができますが、例外として以下があります。
  - `(Ctrl-c Ctrl-m) Ctrl-o` : カーソル行にあるMarkdownリンクのリンク先へジャンプ
  - `(Ctrl-c Ctrl-m) o` : ジャンプ後に、リンク元へ戻る

<a name="header-fxnd5cn22h" class="markdown-hopper"></a>
### コマンドとデフォルトキーバインド

| Commands        | Default Keybinds  | Despcription | Demo links |
| :------------- | :-------------   | :-------- | :------- |
| ` ` | ` ` |  |  |
| `create-table-of-contents` | `(Ctrl-c Ctrl-m) Ctrl-l Ctrl-t` |  | [Demo](#header-5xtrgleocc) |
| `paste-table-of-contents` | `(Ctrl-c Ctrl-m) Ctrl-p Ctrl-t` |  | [Demo](#header-2ramzssjsu) |
| `jump-forward` | `(Ctrl-c Ctrl-m) Ctrl-o` |   |  |
| `jump-backward` | `(Ctrl-c Ctrl-m) o` |   |  |
| `create-link-to-file` | `` |   |  |
| `create-link-to-header` | `` |   |  |
| `paste-link` | `` |   |  |
| `create-table-of-contents` | `` |   |  |
| `paste-table-of-contents`  | `` |   |  |
| `paste-table-of-contents-level-2` | `` |   |  |
| `paste-table-of-contents-level-3` | `` |   |  |
| `paste-table-of-contents-level-4` | `` |   |  |
| `paste-table-of-contents-level-5` | `` |   |  |
| `paste-table-of-contents-level-6` | `` |   |  |
| `paste-http-link` |   |   |  |
| `toggle-fold` |   |   |  |
| `toggle-fold-anchors` |   |   |  |
| `fold-links` |   |   |  |
| `fold-all` | `` |   |  |
| `prefomatted-area-utility` | `` |   |  |
| `create-journal-file` | `` |   |  |
| `create-meeting-file` | `` |   |  |
| `create-interview-file` | `` |   |  |
| `checkbox-utility` | `` |   |  |
| `show-file-without-focus` | `` |   |  |

<a name="header-0klh5ave3m" class="markdown-hopper"></a>
### 設定について

| 設定項目 |     |
| :------------- | :------------- |
| 通知レベル | 通知をどの程度表示するかを設定できます。初めて使う人には、通知が多い方が良いでしょう。 |
| リンクのタイトル | 通知をどの程度表示するかを設定できます。初めて使う人には、通知が多い方が良いでしょう。 |

<a name="header-l2widefy0k" class="markdown-hopper"></a>
## English description
Coming soon

<a name="header-5xtrgleocc" class="markdown-hopper"></a>
## Demo

### 見出しの一覧機能

<a name="header-det3zykzms" class="markdown-hopper"></a>
## Milestones

<a name="header-59zf34a3th" class="markdown-hopper"></a>
### ver.0.2
* リファクタリング
* READMEの整備

<a name="header-3sncgpd88v" class="markdown-hopper"></a>
### ver.0.3
* 登録したリンクの一覧表示
* 登録したリンク一覧からリンクをペースト
* 辿ってきたリンクの一覧表示
* 辿ってきたリンク一覧からリンクに飛ぶ

<a name="header-g7nbvr5tmp" class="markdown-hopper"></a>
### ver.0.4
* Markdown Previewのリンクをクリックした際に、相対パスを辿ってプレビューできるようにする
