# Corne Procyon36 - 分割キーボード

![Corne Procyon36](https://i.imgur.com/fqxZGeHh.jpg)

## 概要
Corne Procyon36は、42x50mmのトラックパッド（デジタイザー）を内蔵した44キーの分割キーボードです。
Raspberry Pi RP2040マイクロコントローラーを使用し、QWMKファームウェアで動作します。

## 特徴
- **キー配列**: 44キー（3x6 + 3キー）
- **マイクロコントローラー**: Raspberry Pi RP2040
- **トラックパッド**: 42x50mm Maxtouchデジタイザー
- **通信**: I2C（1MHz）、シリアル（分割間通信）
- **レイヤー数**: 10レイヤー対応

## ハードウェアサポート
* **キーボードメンテナー**: https://github.com/LXF-YZP
* **ハードウェア**: https://github.com/LXF-YZP/KafkaSplit

## ビルド方法
開発環境をセットアップした後、以下のコマンドでファームウェアをビルドできます：

```bash
# デフォルトキーマップでビルド
make corne_procyon36:default

# 特定のキーマップでビルド
make corne_procyon36:your_keymap_name
```

## ファームウェアの書き込み
ビルドしたファームウェアをキーボードに書き込む方法：

```bash
# ファームウェアを書き込み
make corne_procyon36:default:flash

# 特定のキーマップを書き込み
make corne_procyon36:your_keymap_name:flash
```

## ブートローダーへの入り方
以下の3つの方法でブートローダーに入ることができます：

### 1. Bootmagicリセット
マトリックスの(0,0)位置のキー（通常は左上のEscapeキー）を押しながらキーボードを接続

### 2. 物理リセットボタン
PCBの裏面にあるリセットボタンを短く押す（一部のPCBではパッドをショートする必要があります）

### 3. レイアウト内のキーコード
`QK_BOOT`が割り当てられているキーを押す（利用可能な場合）

## 設定ファイル
- **config.h**: キーボードの基本設定（ピン割り当て、機能設定など）
- **rules.mk**: ビルド設定（ドライバー、デバッグ設定など）
- **mcuconf.h**: RP2040のMCU設定（SPI、I2C設定など）
- **halconf.h**: ChibiOS HAL設定（SPI、I2C有効化など）
- **digitizer_user.c**: カスタムデジタイザー処理（トラックパッドの動作調整）

## トラックパッド設定
トラックパッドの動作は`digitizer_user.c`で調整できます：
- **CPI**: 3200（デフォルト400の8倍）
- **ゲイン**: 4倍
- **平滑化**: 指数移動平均フィルタ（α = 1/4）
- **デッドゾーン**: ノイズ除去用

## 参考資料
- [QMKファームウェア公式サイト](https://docs.qmk.fm/)
- [ビルド環境セットアップ](https://docs.qmk.fm/#/getting_started_build_tools)
- [makeコマンドガイド](https://docs.qmk.fm/#/getting_started_make_guide)
- [初心者向け完全ガイド](https://docs.qmk.fm/#/newbs)

## ライセンス
このプロジェクトはGPL v2ライセンスの下で公開されています。