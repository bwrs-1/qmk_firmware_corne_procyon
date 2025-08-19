/* Copyright 2022 LXF-YZP(yuezp)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#pragma once

/* -------------------------------------------------------------
 * corne_procyon36 用キーボード設定
 * このファイルでは基板ピンアサイン・機能フラグ・I2C 設定など
 * ハードウェアに密接に関わる定義を行います。
 * 変更時はビルド後に必ず左右両方の MCU へ再フラッシュしてください。
 * ------------------------------------------------------------- */

/* Double tap reset button to enter bootloader */

/* Handedness. */
// #define SPLIT_HAND_PIN GP29                    // コメントアウト
// #define SPLIT_HAND_PIN_LOW_IS_RIGHT           // コメントアウト
#define EE_HANDS                                // EEPROMベースの左右判定
// #define MASTER_LEFT                             // 強制的に左手側をマスターとして設定

#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET_LED GP25
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT 500U

// Serial config
#define SERIAL_USART_FULL_DUPLEX
#define SERIAL_USART_TX_PIN GP0
#define SERIAL_USART_RX_PIN GP1
#define SERIAL_USART_DRIVER SIOD0


// Enable use of pointing device on slave split.
#define SPLIT_POINTING_ENABLE

// Pointing device is on the right split
#define POINTING_DEVICE_RIGHT

/*
 * Procyon Trackpad Configuration for corne_procyon36
 * =================================================
 */

// Physical dimensions of the trackpad (in millimeters)
#define POINTING_DEVICE_TRACKPAD_WIDTH_MM  40
#define POINTING_DEVICE_TRACKPAD_HEIGHT_MM 30

// MXT sensor configuration (required for multitouch_experiment branch)
#define MXT_SENSOR_WIDTH_MM  40
#define MXT_SENSOR_HEIGHT_MM 30
#define MXT_SAMPLES_PER_MM   10  // Resolution: 10 samples per mm

// Digitizer-specific settings
#define DIGITIZER_I2C_ADDRESS 0x38
#define DIGITIZER_SENSITIVITY 3.0      // 3x sensitivity for better cursor movement
#define DIGITIZER_ACCELERATION 2.0     // 2x acceleration for responsiveness

// Touch behavior configuration
#define POINTING_DEVICE_TAP_TO_CLICK_ENABLE yes
#define POINTING_DEVICE_TAP_TO_CLICK_TIMEOUT 200
#define POINTING_DEVICE_TAP_TO_CLICK_DISTANCE 5

// Performance optimization
#define POINTING_DEVICE_TASK_THROTTLE_MS 4  // Fast response time

// Debug and development options
#define CONSOLE_ENABLE
#define DEBUG_ENABLE
#define DEBUG_POINTING_DEVICE
#define DEBUG_MATRIX

/* CRC. */
#define CRC8_USE_TABLE
#define CRC8_OPTIMIZE_SPEED

// I2C Configuration for Procyon Trackpad (RIGHT SIDE)
#define I2C_DRIVER I2CD1
#define I2C1_SDA_PIN GP4  // RIGHT SIDE trackpad I2C
#define I2C1_SCL_PIN GP5  // RIGHT SIDE trackpad I2C
#define I2C1_CLOCK_SPEED 400000  // 400kHz for stable communication


// Reduce soft serial speed: Work around rp2040 issues
#define SELECT_SOFT_SERIAL_SPEED 4
