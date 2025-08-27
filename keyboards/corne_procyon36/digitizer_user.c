/* ============================================================================
 * Corne Procyon36 - カスタムデジタイザー処理
 * ============================================================================
 * このファイルは、トラックパッド（デジタイザー）の動作を最適化するための
 * カスタム処理を提供します。
 * 
 * 主な機能：
 * ・CPI を 3200 に設定（デフォルト 400 の 8倍）
 * ・digitizerの移動量に適切なゲインを掛け、指数移動平均フィルタで
 *   カクツキを緩和します。
 * ・QMKの標準的なポインティングデバイス処理とは独立して動作
 * ============================================================================ */

#include "digitizer.h"
#include "pointing_device.h"
#include <limits.h>

/* ============================================================================
 * 設定パラメータ（好みに合わせて変更してください）
 * ============================================================================ */
#define CUSTOM_CPI         3200             // カスタムCPI設定（デフォルト400の8倍）
#define MOVEMENT_GAIN      4                // 移動量のゲイン倍率
#define SMOOTHING_SHIFT    2                // 平滑化係数（α = 1/4 = 1/2^2）
#define STOP_THRESHOLD     5                // 停止判定の閾値（尾引き防止用）
#define INPUT_DEADZONE     3                // 入力デッドゾーン（ノイズ除去用）

/* ============================================================================
 * ユーティリティ関数
 * ============================================================================ */
/**
 * 32ビット整数の絶対値を計算
 * @param v 入力値
 * @return 絶対値
 */
static inline int32_t iabs32(int32_t v) {
    return (v < 0) ? -v : v;
}

/**
 * 32ビット整数を16ビット範囲にクランプ（オーバーフロー防止）
 * @param v 入力値
 * @return クランプされた16ビット値
 */
static inline int16_t clamp16(int32_t v) {
    if (v > INT16_MAX) return INT16_MAX;
    if (v < INT16_MIN) return INT16_MIN;
    return (int16_t)v;
}

/* ============================================================================
 * デジタイザー設定関数
 * ============================================================================ */
/**
 * カスタムCPI値を取得
 * QMKの標準的なCPI設定をオーバーライドします
 * @return カスタムCPI値（3200）
 */
uint16_t digitizer_get_cpi_user(void) {
    return CUSTOM_CPI;
}

/* ============================================================================
 * ポインティングデバイス処理関数
 * ============================================================================ */
/**
 * ポインティングデバイスのタスク処理
 * トラックパッドの入力に対して以下の処理を適用します：
 * 1. 移動量ゲイン適用
 * 2. 入力デッドゾーン処理
 * 3. 指数移動平均フィルタ（IIR）
 * 4. 尾引き防止処理
 * 5. 出力値のクランプ
 * 
 * @param mouse_report 入力マウスレポート
 * @return 処理済みマウスレポート
 */
report_mouse_t pointing_device_task_user(report_mouse_t mouse_report) {
    // フィルタ状態を保持する静的変数
    static int32_t filt_x = 0;
    static int32_t filt_y = 0;

    // 移動量にゲインを適用（32ビットで計算してオーバーフローを防止）
    int32_t raw_x = (int32_t)mouse_report.x * MOVEMENT_GAIN;
    int32_t raw_y = (int32_t)mouse_report.y * MOVEMENT_GAIN;

    // 入力デッドゾーン処理（微小なノイズをゼロとして扱う）
    if (iabs32(raw_x) < INPUT_DEADZONE) raw_x = 0;
    if (iabs32(raw_y) < INPUT_DEADZONE) raw_y = 0;

    // 指数移動平均フィルタ（IIR: Infinite Impulse Response）
    // 負数の丸めの差異を避けるため、演算は除算で行う（0方向に丸め）
    const int32_t smoothing_denom = (1 << SMOOTHING_SHIFT);
    filt_x += (raw_x - filt_x) / smoothing_denom;
    filt_y += (raw_y - filt_y) / smoothing_denom;

    // 出力はフィルタ値をそのまま使用（重ねがけのシフトはしない）
    int32_t out_x = filt_x;
    int32_t out_y = filt_y;

    // 尾引き防止処理：入力がゼロ付近なら強制的にゼロにリセット
    if (iabs32(raw_x) <= INPUT_DEADZONE && (out_x > -STOP_THRESHOLD && out_x < STOP_THRESHOLD)) {
        out_x = 0;
        filt_x = 0;  // フィルタ状態もリセット
    }
    if (iabs32(raw_y) <= INPUT_DEADZONE && (out_y > -STOP_THRESHOLD && out_y < STOP_THRESHOLD)) {
        out_y = 0;
        filt_y = 0;  // フィルタ状態もリセット
    }

    // 16ビット範囲にクランプして出力
    mouse_report.x = clamp16(out_x);
    mouse_report.y = clamp16(out_y);

    return mouse_report;
}
