# -------------------------------------------------------------
# corne_procyon36 用 Makefile 追加設定
# - シリアルドライバやポイントデバイスドライバを指定
# - デバッグ/コンソールの有効化は config.h で行うことを推奨
# -------------------------------------------------------------
SERIAL_DRIVER = vendor
I2C_DRIVER_REQUIRED = yes
DIGITIZER_DRIVER = maxtouch
POINTING_DEVICE_DRIVER = digitizer
MAXTOUCH_DEBUG = no