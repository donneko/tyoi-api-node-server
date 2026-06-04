# Change Log

## [Unreleased]

### Added
- WebSocket機能追加
- `Server` に `onWebSocket` メソッドを追加
- `Server` に `onceWebSocket` メソッドを追加
- `Server` に `offWebSocket` メソッドを追加
- `Server` に `hasWebSocket` メソッドを追加

### Fixed
- ログ表示がある条件で10文字のみになる問題を修正
- CLIで `--open` のプションが適用されない問題を修正
- ログのErrorにconsole.logが残っていた問題を修正
- summaryがTYYで正常に動作しない問題を修正
- ログのwindowがTYYに対応していない問題を修正

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

[Unreleased]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/donneko/tyoi-api-node-server/compare/v0.0.1...v0.0.2