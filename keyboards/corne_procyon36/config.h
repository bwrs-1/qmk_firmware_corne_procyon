/* Copyright 2022 LXF-YZP(yuezp)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR ANY PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#pragma once

/* ============================================================================
 * ブートローダー設定
 * ============================================================================ */
/* ダブルタップリセットボタンでブートローダーに入る */
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET_LED GP25      // ブートローダー起動時のLED表示用ピン
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT 500U  // ダブルタップのタイムアウト時間（ミリ秒）

/* ============================================================================
 * キーボード分割設定
 * ============================================================================ */
/* 左右分割の判定用ピン設定 */
#define SPLIT_HAND_PIN GP29                    // 分割判定用ピン
#define SPLIT_HAND_PIN_LOW_IS_RIGHT           // High -> 左側、Low -> 右側

/* ============================================================================
 * シリアル通信設定
 * ============================================================================ */
/* 左右分割間の通信設定 */
#define SERIAL_USART_FULL_DUPLEX              // 全二重通信を有効化
#define SERIAL_USART_TX_PIN GP0               // 送信ピン
#define SERIAL_USART_RX_PIN GP1               // 受信ピン
#define SERIAL_USART_DRIVER SIOD0             // シリアルドライバー

/* ============================================================================
 * ポインティングデバイス設定
 * ============================================================================ */
/* スレーブ側でのポインティングデバイス使用を有効化 */
#define SPLIT_POINTING_ENABLE                 // 分割キーボードでポインティングデバイスを有効化
#define POINTING_DEVICE_RIGHT                 // ポインティングデバイスは右側に配置

/* ============================================================================
 * CRC設定
 * ============================================================================ */
/* 通信エラー検出のためのCRC設定 */
#define CRC8_USE_TABLE                        // CRC8計算用テーブルを使用
#define CRC8_OPTIMIZE_SPEED                  // CRC8計算を速度最適化

/* ============================================================================
 * I2C設定
 * ============================================================================ */
/* I2C通信の設定 */
#define I2C_DRIVER I2CD1                      // I2Cドライバー1を使用
#define I2C1_SDA_PIN GP2                     // I2C1のSDAピン
#define I2C1_SCL_PIN GP3                     // I2C1のSCLピン
#define I2C1_CLOCK_SPEED 1000000             // I2C1のクロック速度（1MHz）

/* ============================================================================
 * デジタイザー設定
 * ============================================================================ */
/* トラックパッド（デジタイザー）の設定 */
#define DIGITIZER_MOTION_PIN GP11             // デジタイザーの動作検出ピン
#define DIGITIZER_MOTION_PIN_ACTIVE_LOW yes   // 動作検出ピンはアクティブロー
#define PROCYON_42_50                         // Procyon 42x50mm トラックパッド用設定

/* ============================================================================
 * その他の設定
 * ============================================================================ */
/* RP2040のソフトシリアル速度を下げて安定性を向上 */
#define SELECT_SOFT_SERIAL_SPEED 4            // ソフトシリアル速度を4に設定（RP2040問題回避）

/* ============================================================================
 * Auto Mouse Layer 設定
 * ============================================================================ */
#define POINTING_DEVICE_AUTO_MOUSE_ENABLE
