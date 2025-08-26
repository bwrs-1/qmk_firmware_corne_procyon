# QMK Firmware - Corne Procyon36

Corne Procyon36キーボード用のQMKファームウェアです。

## 自動ビルド環境

### セットアップ
```bash
# watchexecのインストール（初回のみ）
brew install watchexec

# 実行権限の付与（初回のみ）
chmod +x auto-build.sh
```

### 使用方法

#### 自動ビルド（ファイル変更監視）
```bash
# ファイル変更を監視して自動ビルド
npm run watch
# または
./auto-build.sh
```

#### 手動ビルド
```bash
# 1回だけビルド
npm run build:once
# または
qmk compile -kb corne_procyon36 -km default
```

#### クリーンアップ
```bash
# ビルド成果物をクリーン
npm run clean
# または
qmk clean
```

### 監視対象
- `keyboards/corne_procyon36/` - キーボード固有のファイル
- `quantum/` - QMKコア機能
- `drivers/` - ドライバー
- `lib/` - ライブラリ

### 監視ファイル拡張子
- `.c` - Cソースファイル
- `.h` - ヘッダーファイル
- `.mk` - Makefile
- `.json` - 設定ファイル

### 特徴
- 🚀 初回ビルドで動作確認
- 👀 ファイル変更の自動検知
- ⏱️  700msデバウンスで重複ビルドを防止
- 🔄 変更ごとの自動再ビルド
- ✅ ビルド成功/失敗の明確な表示
- 🔌 **自動フラッシュ機能**（ビルド成功後）

## 自動フラッシュ機能

### 動作フロー
1. **ビルド成功** → UF2ファイルを自動検出
2. **フラッシュ確認** → ユーザーに実行確認を表示
3. **フラッシュ実行** → RP2040のRPI-RP2ドライブに自動コピー
4. **完了通知** → フラッシュ完了とリブート通知

### フラッシュ手順
1. **BOOTSELモード**: RP2040のBOOTSELボタンを押しながらUSB接続
2. **ドライブ確認**: `RPI-RP2`ドライブが表示されることを確認
3. **フラッシュ実行**: スクリプトで`y`を入力してフラッシュ開始
4. **自動リブート**: フラッシュ完了後、キーボードが自動リブート

### 対応OS
- ✅ **macOS**: 自動フラッシュ対応（`/Volumes/RPI-RP2/`に自動コピー）
- ⚠️  **その他OS**: 手動フラッシュ（ファイルパスを表示）

### 安全機能
- フラッシュ前のユーザー確認
- BOOTSELモードの事前案内
- エラーハンドリングと詳細なフィードバック
- フラッシュ失敗時のトラブルシューティング案内

## 開発環境
- QMK CLI: `brew install qmk/qmk/qmk`
- ファイル監視: `watchexec`
- 対象キーボード: `corne_procyon36`
- デフォルトキーマップ: `default`

## 参考
- [QMK公式ドキュメント](https://docs.qmk.fm/)
- [QMK CLI](https://docs.qmk.fm/#/cli)
