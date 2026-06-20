# Change Log

## [Unreleased]

### Changed
- CLI 内部構造の整理
- テンプレートコピー共通化

### Removed
- 古いテンプレート
- dev/
- 旧 CLI core

### Added
- Vitest
- メソッドチェーン対応

### Fixed
- CLI パス
- コピー先
- テスト周り

## [0.0.5] - 2026-06-07
### Added
- `tyoi config` を追加 今のフォルダーに設定ファイルを追加する 
- `tyoi info` を追加 今 `tyoi run` をするとどの設定が適用されるのか？表示する
- `tyoi init` `tyoi create` `tyoi config` のファイル操作系にファイルの操作が正常に行われたか、結果を表示する機能を追加
- 開発しやすいように、自動でパッケージ作って検証するテストを追加。
- `package.json` の `script` に `d-init` `d-test` `d-dev` 追加

### Changed
- `tyoi init` を `tyoi create` に変更
- `tyoi init` を今のフォルダーにテンプレ作成機能にした
- テンプレートの場所変更

### Fixed
- `tyoi init` 、`tyoi create` の Next step 表記を修正
- `src/cli/*` 系がリファクタリングされました
- `src/main.ts` がリファクタリングされました
- 旧 `tyoi init` Project名を聞いたあとに、聞く表示が残り続ける問題を修正
- コマンドの呼ばれる方式変更。

## [0.0.4] - 2026-06-05

### Added
- ショートハンドラ `tyoi()` を追加

### Changed
- `server` の 型のデフォルト引数を変更

## [0.0.3] - 2026-06-04

### Added
- WebSocket機能追加
- `Server` に `onWebSocket` メソッドを追加
- `Server` に `onceWebSocket` メソッドを追加
- `Server` に `offWebSocket` メソッドを追加
- `Server` に `hasWebSocket` メソッドを追加
- テンプレート に `basic-js` 追加
- テンプレート に `basic-ts` 追加
- テンプレート のバージョンを合わせる処理を追加
- テンプレート 選択機能を追加
- テンプレート のプロジェクト名を聞く機能を追加

### Fixed
- ログ表示がある条件で10文字のみになる問題を修正
- CLIで `--open` のプションが適用されない問題を修正
- ログのErrorにconsole.logが残っていた問題を修正
- summaryがTYYで正常に動作しない問題を修正
- ログのwindowがTYYに対応していない問題を修正

### Changed
- `tyoi.config.js` の `middlewares` に `morgan("dev")` を入れるように変更
- テンプレート のログなど変更
- テンプレート のオプションや引数がなくても実行できるように

### Removed
-`cors`, `helmet`, `hpp`,` express-rate-limit`, `express-slow-down`, `@types/cors,` `@types/hpp` 使用していないパッケージを消去
## [0.0.2] - 2026-05-23

### Added
- 設定ファイル対応
- `Server` から `getConfig` メソッドを使用して設定を取得するのを追加

### Changed
- README　の `npx tyoi` など誤解を招く導線を修正しました
- `tyoi` の実行が `tyoi dev` から `tyoi run` になりました
- ログなどのメッセージ系をデータから読み込む方式に変更

### Fixed
- `npm install donneko@tyoi-server`をすると、`node_module` の `config` が参照もとになって、ファイルで設定ができない問題を修正

## 0.0.1 - 2026-05-11
### Added
- 静的ファイル配信
- Local / Network URL　表示
- LAN　公開対応
- QR Code　表示対応
- ブラウザ自動起動対応
- 使用中ポートの自動切り替え対応
- Express middleware　対応

[Unreleased]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.1...v0.0.2