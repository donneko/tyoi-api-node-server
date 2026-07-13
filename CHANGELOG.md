# Change Log

## [Unreleased]

## [0.0.7] - 2026-07-13
### Added
- `tyoi run` / `tyoi dev` のサーバー起動をメインプロセスとサーバープロセスに分離
- サーバープロセス用の IPC メッセージ、起動、終了処理を追加
- `ShortHandler.listen()` を追加
- TypeDoc と VitePress による API ドキュメント生成を追加
- GitHub Actions にドキュメント公開ワークフローを追加
- ESLint と Prettier の設定を追加
- 非 TTY 環境のテストコマンドを追加

### Changed
- ドキュメント配置を `doc/` から `docs/` に変更
- `package.json` の scripts を `test:*` / `check:*` / `docs:*` に整理
- npm tarball に含めるドキュメント範囲を `docs` 構成に合わせて変更
- CLI メタデータで `package.json` からパッケージ情報を取得するように変更
- `Server` / `tyoi()` / `ShortHandler` の JSDoc を拡充

### Fixed
- `ShortHandler` のサーバー取得 API をドキュメントに合わせて修正
- `test:ci` とパッケージ関連 scripts の不整合を修正
- TypeScript target と `scanConfigFiles` の実行互換性を修正
- 非 TTY 実行時にテストが失敗する問題を修正

## [0.0.6] - 2026-06-20
### Changed
- CLI 内部構造の整理
- テンプレートコピー共通化

### Removed
- 古いテンプレート
- `dev/`
- 旧 CLI core

### Added
- Vitest
- メソッドチェーン対応
- `README.md` に画像追加

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

[Unreleased]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.7...HEAD
[0.0.7]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.1...v0.0.2
