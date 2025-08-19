// corne_procyon36: マウス HID モード用カスタム処理
// ------------------------------------------------------------
// ・CPI を 1600 に引き上げて速度アップ（デフォルト 400 の 4倍）
// ・移動量に 2 倍ゲインを掛け、さらに簡易ローパスフィルタで
//   カクツキを緩和します。
//   SMOOTHING_FACTOR を小さくすると応答性優先、大きくすると滑らかさ優先。
// ------------------------------------------------------------
#include "digitizer.h"
#include "pointing_device.h"

/* 好みに合わせて変更してください ---------------------- */
#define CUSTOM_CPI         3200  // 400 の 6倍速に相当
#define MOVEMENT_GAIN      7     // 7倍速
#define SMOOTHING_FACTOR   4     // そのまま
/* ------------------------------------------------------- */

uint16_t digitizer_get_cpi_user(void) {
    return CUSTOM_CPI;
}

// 簡易移動平均フィルタで滑らかにする
report_mouse_t pointing_device_task_user(report_mouse_t mouse_report) {
    static int16_t acc_x = 0;
    static int16_t acc_y = 0;

    // ゲインを掛けて高速化
    int16_t raw_x = mouse_report.x * MOVEMENT_GAIN;
    int16_t raw_y = mouse_report.y * MOVEMENT_GAIN;

    // 移動平均: 新しい入力 1／SMOOTHING_FACTOR, 既存  (n-1)/SMOOTHING_FACTOR
    acc_x = (acc_x * (SMOOTHING_FACTOR - 1) + raw_x) / SMOOTHING_FACTOR;
    acc_y = (acc_y * (SMOOTHING_FACTOR - 1) + raw_y) / SMOOTHING_FACTOR;

    mouse_report.x = acc_x;
    mouse_report.y = acc_y;
    return mouse_report;
}
