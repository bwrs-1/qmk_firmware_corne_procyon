// corne_procyon36: digitizer専用カスタム処理
// ------------------------------------------------------------
// ・CPI を 3200 に設定（デフォルト 400 の 8倍）
// ・digitizerの移動量に適切なゲインを掛け、指数移動平均フィルタで
//   カクツキを緩和します。
// ・QMKの標準的なポインティングデバイス処理とは独立して動作
// ------------------------------------------------------------
#include "digitizer.h"
#include "pointing_device.h"
#include <limits.h>

/* 好みに合わせて変更してください ---------------------- */
#define CUSTOM_CPI         3200
#define MOVEMENT_GAIN      4
#define SMOOTHING_SHIFT    2     // α = 1/4
#define STOP_THRESHOLD     5     // ★修正点：この値を 2 から 5 に変更しました
#define INPUT_DEADZONE     3     // 入力に対するデッドゾーン（ゲイン適用後の単位）
/* ------------------------------------------------------- */
static inline int32_t iabs32(int32_t v) {
    return (v < 0) ? -v : v;
}


static inline int16_t clamp16(int32_t v) {
    if (v > INT16_MAX) return INT16_MAX;
    if (v < INT16_MIN) return INT16_MIN;
    return (int16_t)v;
}

uint16_t digitizer_get_cpi_user(void) {
    return CUSTOM_CPI;
}

// 整数版指数移動平均で滑らかにする（QMKのpointing_deviceフローを使用）
report_mouse_t pointing_device_task_user(report_mouse_t mouse_report) {
    static int32_t filt_x = 0;
    static int32_t filt_y = 0;

    int32_t raw_x = (int32_t)mouse_report.x * MOVEMENT_GAIN;
    int32_t raw_y = (int32_t)mouse_report.y * MOVEMENT_GAIN;

    // 入力デッドゾーン（微小なノイズをゼロとして扱う）
    if (iabs32(raw_x) < INPUT_DEADZONE) raw_x = 0;
    if (iabs32(raw_y) < INPUT_DEADZONE) raw_y = 0;

    // IIR: filt += (raw - filt) / 2^n
    // 負数の丸めの差異を避けるため、演算は除算で行う（0 方向に丸め）
    const int32_t smoothing_denom = (1 << SMOOTHING_SHIFT);
    filt_x += (raw_x - filt_x) / smoothing_denom;
    filt_y += (raw_y - filt_y) / smoothing_denom;

    // 出力はフィルタ値をそのまま使用（重ねがけのシフトはしない）
    int32_t out_x = filt_x;
    int32_t out_y = filt_y;

    // 入力がゼロ付近なら尾引きを強制的に打ち消す
    if (iabs32(raw_x) <= INPUT_DEADZONE && (out_x > -STOP_THRESHOLD && out_x < STOP_THRESHOLD)) {
        out_x = 0;
        filt_x = 0;
    }
    if (iabs32(raw_y) <= INPUT_DEADZONE && (out_y > -STOP_THRESHOLD && out_y < STOP_THRESHOLD)) {
        out_y = 0;
        filt_y = 0;
    }

    mouse_report.x = clamp16(out_x);
    mouse_report.y = clamp16(out_y);

    return mouse_report;
}
