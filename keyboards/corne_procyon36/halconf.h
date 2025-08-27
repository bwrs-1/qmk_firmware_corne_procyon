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
 * HAL設定ファイル
 * ============================================================================
 * このファイルは、ChibiOSハードウェア抽象化レイヤー（HAL）の
 * 設定を定義します。SPIとI2Cの使用を有効化しています
 */

/* ============================================================================
 * 通信インターフェース設定
 * ============================================================================ */
#define HAL_USE_SPI TRUE                   // SPI（Serial Peripheral Interface）を有効化
                                          // フラッシュメモリやその他のSPIデバイス用

#define HAL_USE_I2C TRUE                   // I2C（Inter-Integrated Circuit）を有効化
                                          // デジタイザーやその他のI2Cデバイス用

/* ============================================================================
 * 標準HAL設定の読み込み
 * ============================================================================ */
#include_next <halconf.h>                  // 標準的なHAL設定を読み込み
