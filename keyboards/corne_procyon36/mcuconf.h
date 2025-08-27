/* Copyright 2022 JasonRen(biu)
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
 * MCU設定ファイル
 * ============================================================================
 * このファイルは、Raspberry Pi RP2040マイクロコントローラーの
 * ハードウェア抽象化レイヤー（HAL）設定を定義します
 */

#include_next <mcuconf.h>

/* ============================================================================
 * SPI設定
 * ============================================================================ */
/* SPI0の使用を有効化（フラッシュメモリやその他のSPIデバイス用） */
#undef RP_SPI_USE_SPI0
#define RP_SPI_USE_SPI0 TRUE

/* ============================================================================
 * I2C設定
 * ============================================================================ */
/* I2C0の使用を無効化（競合回避のため） */
#undef RP_I2C_USE_I2C0
#define RP_I2C_USE_I2C0 FALSE

/* I2C1の使用を有効化（デジタイザーやその他のI2Cデバイス用） */
#undef RP_I2C_USE_I2C1
#define RP_I2C_USE_I2C1 TRUE