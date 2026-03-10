# QMK Corne Procyon36 Docker 開発環境

このプロジェクトでは、QMKファームウェア開発のためのDocker環境を提供しています。Dockerを使用することで、環境構築の手間を省き、一貫した開発環境を提供できます。

## 🐳 必要な環境

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 クイックスタート

### 1. 環境の起動

```bash
# 開発環境の起動
docker-compose up -d qmk-dev

# コンテナに入る
docker-compose exec qmk-dev bash
```

### 2. ファームウェアのビルド

#### 簡単な方法（スクリプト使用）

**Linux/macOS:**
```bash
# defaultキーマップをビルド
./docker-build.sh default

# カスタムキーマップをビルド
./docker-build.sh my_keymap

# ビルドしてフラッシュ
./docker-build.sh -f default

# クリーンビルド（詳細出力）
./docker-build.sh -c -v my_keymap
```

**Windows (PowerShell):**
```powershell
# defaultキーマップをビルド
.\docker-build.ps1 -Keymap default

# カスタムキーマップをビルド
.\docker-build.ps1 -Keymap my_keymap

# ビルドしてフラッシュ
.\docker-build.ps1 -Keymap default -Flash

# クリーンビルド（詳細出力）
.\docker-build.ps1 -Keymap my_keymap -Clean -Verbose
```

#### 手動でのビルド

```bash
# コンテナ内で直接実行
docker-compose run --rm qmk-dev make corne_procyon36:default

# フラッシュ付きビルド
docker-compose run --rm qmk-dev make corne_procyon36:default:flash

# クリーンビルド
docker-compose run --rm qmk-dev make clean
docker-compose run --rm qmk-dev make corne_procyon36:default
```

## 📁 プロジェクト構造

```
qmk_firmware_corne_procyon/
├── Dockerfile                 # 開発環境用Dockerfile
├── docker-compose.yml         # Docker Compose設定
├── docker-build.sh           # Linux/macOS用ビルドスクリプト
├── docker-build.ps1          # Windows PowerShell用ビルドスクリプト
├── keyboards/
│   └── corne_procyon36/       # Corne Procyon36キーボード定義
└── ...
```

## 🛠️ Docker サービス

### `qmk-dev`（開発用）
- フル機能の開発環境
- USB デバイスアクセス（フラッシュ用）
- インタラクティブシェル

### `qmk-build`（ビルド専用）
- 軽量なビルド専用環境
- CI/CD環境での使用に適している

```bash
# ビルド専用コンテナを使用
docker-compose --profile build-only run --rm qmk-build make corne_procyon36:default
```

### `qmk-docs`（ドキュメント）
- QMKドキュメントのローカルサーバー
- ポート8080でアクセス可能

```bash
# ドキュメントサーバーの起動
docker-compose --profile docs up qmk-docs

# ブラウザで http://localhost:8080 にアクセス
```

## 🔧 便利なコマンド

### 環境管理

```bash
# 全サービスの起動
docker-compose up -d

# 特定のサービスの起動
docker-compose up -d qmk-dev

# 全サービスの停止
docker-compose down

# ログの確認
docker-compose logs qmk-dev

# コンテナの状態確認
docker-compose ps
```

### 開発作業

```bash
# インタラクティブシェルでコンテナに入る
docker-compose exec qmk-dev bash

# 新しいキーマップの作成
docker-compose run --rm qmk-dev qmk new-keymap -kb corne_procyon36

# キーボード設定の確認
docker-compose run --rm qmk-dev qmk config
```

### トラブルシューティング

```bash
# コンテナとイメージの完全削除
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache

# ディスク使用量の確認
docker system df

# 未使用のイメージ・コンテナの削除
docker system prune
```

## 🎯 キーマップ開発

### 1. 新しいキーマップの作成

```bash
# コンテナ内で新しいキーマップを作成
docker-compose run --rm qmk-dev qmk new-keymap -kb corne_procyon36 -km my_keymap

# または手動でディレクトリを作成
mkdir -p keyboards/corne_procyon36/keymaps/my_keymap
```

### 2. キーマップの編集

キーマップファイルは通常のエディタで編集できます：
- `keyboards/corne_procyon36/keymaps/my_keymap/keymap.c`
- `keyboards/corne_procyon36/keymaps/my_keymap/config.h`

### 3. ビルドとテスト

```bash
# ビルドのみ
./docker-build.sh my_keymap

# ビルドとフラッシュ
./docker-build.sh -f my_keymap
```

## 🔌 フラッシュ（書き込み）

### 注意事項

- フラッシュ機能を使用するには、USBデバイスへのアクセスが必要です
- WindowsではWSL2のUSBサポートまたは追加設定が必要な場合があります
- macOSではDockerでのUSBアクセスに制限があります

### Linux でのフラッシュ

```bash
# 権限の確認（必要に応じて）
sudo usermod -a -G dialout $USER

# フラッシュの実行
./docker-build.sh -f default
```

### Windows でのフラッシュ

```powershell
# PowerShellで実行
.\docker-build.ps1 -Keymap default -Flash
```

## 🐛 トラブルシューティング

### 一般的な問題

1. **Docker/Docker Composeが見つからない**
   ```bash
   # インストール確認
   docker --version
   docker-compose --version
   ```

2. **権限エラー**
   ```bash
   # Dockerグループへの追加（Linux）
   sudo usermod -a -G docker $USER
   # ログアウト/ログインが必要
   ```

3. **ビルドエラー**
   ```bash
   # クリーンビルドを試す
   ./docker-build.sh -c default
   
   # または完全にリビルド
   docker-compose build --no-cache
   ```

4. **USBデバイスが認識されない**
   - Linuxの場合：udevルールの確認
   - Windowsの場合：WSL2のUSB設定確認
   - macOSの場合：代替フラッシュ方法の検討

### ログの確認

```bash
# コンテナログの表示
docker-compose logs qmk-dev

# リアルタイムログの監視
docker-compose logs -f qmk-dev
```

## 📚 関連リンク

- [QMK Firmware 公式ドキュメント](https://docs.qmk.fm/)
- [Docker 公式ドキュメント](https://docs.docker.com/)
- [QMK Docker イメージ](https://github.com/qmk/qmk_cli)

## 🤝 コントリビューション

このDocker環境の改善提案やバグ報告は、Issueまたはプルリクエストでお知らせください。

---

Happy Hacking! ⌨️✨

