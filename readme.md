# THIS IS THE DEVELOP BRANCH

Warning- This is the `develop` branch of QMK Firmware. You may encounter broken code here. Please see [Breaking Changes](https://docs.qmk.fm/#/breaking_changes) for more information.

# Quantum Mechanical Keyboard Firmware

[![Current Version](https://img.shields.io/github/tag/qmk/qmk_firmware.svg)](https://github.com/qmk/qmk_firmware/tags)
[![Discord](https://img.shields.io/discord/440868230475677696.svg)](https://discord.gg/qmk)
[![Docs Status](https://img.shields.io/badge/docs-ready-orange.svg)](https://docs.qmk.fm)
[![GitHub contributors](https://img.shields.io/github/contributors/qmk/qmk_firmware.svg)](https://github.com/qmk/qmk_firmware/pulse/monthly)
[![GitHub forks](https://img.shields.io/github/forks/qmk/qmk_firmware.svg?style=social&label=Fork)](https://github.com/qmk/qmk_firmware/)

This is a keyboard firmware based on the [tmk\_keyboard firmware](https://github.com/tmk/tmk_keyboard) with some useful features for Atmel AVR and ARM controllers, and more specifically, the [OLKB product line](https://olkb.com), the [ErgoDox EZ](https://ergodox-ez.com) keyboard, and the Clueboard product line.

## Documentation

* [See the official documentation on docs.qmk.fm](https://docs.qmk.fm)

The docs are powered by [VitePress](https://vitepress.dev/). They are also viewable offline; see [Previewing the Documentation](https://docs.qmk.fm/#/contributing?id=previewing-the-documentation) for more details.

You can request changes by making a fork and opening a [pull request](https://github.com/qmk/qmk_firmware/pulls).

## Supported Keyboards

* [Planck](/keyboards/planck/)
* [Preonic](/keyboards/preonic/)
* [ErgoDox EZ](/keyboards/ergodox_ez/)
* [Clueboard](/keyboards/clueboard/)
* [Cluepad](/keyboards/clueboard/17/)
* [Atreus](/keyboards/atreus/)

The project also includes community support for [lots of other keyboards](/keyboards/).

## Maintainers

QMK is developed and maintained by Jack Humbert of OLKB with contributions from the community, and of course, [Hasu](https://github.com/tmk). The OLKB product firmwares are maintained by [Jack Humbert](https://github.com/jackhumbert), the Ergodox EZ by [ZSA Technology Labs](https://github.com/zsa), the Clueboard by [Zach White](https://github.com/skullydazed), and the Atreus by [Phil Hagelberg](https://github.com/technomancy).

## Official Website

[qmk.fm](https://qmk.fm) is the official website of QMK, where you can find links to this page, the documentation, and the keyboards supported by QMK.

## corne_procyon36 キーボード概要

### ハードウェア仕様
- マイクロコントローラ: RP2040
- 配列: 3 × 6 分割キーボード (左右各 42 キー)
- 行列サイズ: 8 行 × 6 列
- ダイオード方向: ROW2COL
- スプリット方式: ソフトシリアル (GP0/GP1) + I²C
- 搭載デバイス:
  - WS2812 RGB LED (GP15)
  - Rotary Encoder（左右各 1 基）
  - 右側タッチパッド (MaXTouch I²C, アドレス 0x38)

### ビルド手順
```bash
# QMK 開発環境の初期化 (初回のみ)
qmk setup -y

# デフォルトキーマップ
qmk compile -kb corne_procyon36 -km default

# 左手マスター用ファーム (EEPROM に Left を自動書込)
qmk compile -kb corne_procyon36 -km left_master

# 右手マスター用ファーム (EEPROM に Right を自動書込)
qmk compile -kb corne_procyon36 -km right_master
```

### フラッシュ手順
1. RP2040 の BOOTSEL ボタンを押しながら USB 接続し、`RPI-RP2` ドライブをマウントする  
2. 生成された UF2 ファイルをドラッグ & ドロップ  
   - 左基板: `corne_procyon36_left_master.uf2`  
   - 右基板: `corne_procyon36_right_master.uf2`  
3. 自動リブート後、HID-Console で `pointing_device: init ok` が表示されることを確認

### トラブルシューティング
- タッチパッドが動作しない場合は以下を確認  
  1. I²C 配線 (右側 GP4: SDA, GP5: SCL)  
  2. `EE_HANDS` が `INIT_EE_HANDS_*` で正しく書き込まれているか  
  3. HID-Console に `init failed` が出ていないか  
- 隠し `.build/` フォルダは `Shift + ⌘ + .` で表示できます  
