#pragma once
/* corne_procyon36 左手用ファームウェア
 * INIT_EE_HANDS_LEFT を定義することで、ファーム起動時に EEPROM へ
 * "自分は左手側" という情報を書き込みます。USB を挿した側が
 * マスターになっても handedness 判定がブレません。*/
#define INIT_EE_HANDS_LEFT
