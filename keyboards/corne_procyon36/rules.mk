SERIAL_DRIVER = vendor
I2C_DRIVER_REQUIRED = yes
DIGITIZER_DRIVER = maxtouch
POINTING_DEVICE_DRIVER = digitizer
MAXTOUCH_DEBUG = no   # VIA と raw_hid_receive 重複を回避
CONSOLE_ENABLE = yes   # HID コンソール出力を有効
DEBUG_ENABLE = yes     # dprintf/uprintf を有効
SRC += digitizer_user.c