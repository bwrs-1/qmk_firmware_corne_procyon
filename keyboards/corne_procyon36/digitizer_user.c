// corne_procyon36: マウス HID モード用カスタム処理
// ------------------------------------------------------------
// ・CPI を 3200 に引き上げて速度アップ（デフォルト 400 の 8倍）
// ・移動量に適切なゲインを掛け、指数移動平均フィルタで
//   カクツキを緩和します。
//   SMOOTHING_FACTOR を小さくすると応答性優先、大きくすると滑らかさ優先。
// ------------------------------------------------------------
#include "digitizer.h"
#include "pointing_device.h"
#include <limits.h>

/* 好みに合わせて変更してください ---------------------- */
#define CUSTOM_CPI         3200  // 400 の 8倍速に相当
#define MOVEMENT_GAIN      4     // ゲイン倍率
#define SMOOTHING_SHIFT    2     // α = 1/4 (2^SMOOTHING_SHIFT)
/* ------------------------------------------------------- */

static inline int16_t clamp16(int32_t v) {
    if (v > INT16_MAX) return INT16_MAX;
    if (v < INT16_MIN) return INT16_MIN;
    return (int16_t)v;
}

uint16_t digitizer_get_cpi_user(void) {
    return CUSTOM_CPI;
}

report_mouse_t pointing_device_task_user(report_mouse_t mouse_report) {
    static int32_t filt_x = 0;
    static int32_t filt_y = 0;

    /* ゲインを掛けて高速化 (32bit で計算) */
    int32_t raw_x = (int32_t)mouse_report.x * MOVEMENT_GAIN;
    int32_t raw_y = (int32_t)mouse_report.y * MOVEMENT_GAIN;

    /* 整数版指数移動平均: filt += (raw - filt) / 2^n */
    filt_x += (raw_x - filt_x) >> SMOOTHING_SHIFT;
    filt_y += (raw_y - filt_y) >> SMOOTHING_SHIFT;

    /* 丸めて16bitにクランプ */
    mouse_report.x = clamp16((filt_x + (1 << (SMOOTHING_SHIFT - 1))) >> SMOOTHING_SHIFT);
    mouse_report.y = clamp16((filt_y + (1 << (SMOOTHING_SHIFT - 1))) >> SMOOTHING_SHIFT);

    return mouse_report;
}
