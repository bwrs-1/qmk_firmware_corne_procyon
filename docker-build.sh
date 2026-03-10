#!/bin/bash
# QMK Corne Procyon36 Docker ビルドスクリプト
set -e

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ヘルプ表示
show_help() {
    echo -e "${BLUE}QMK Corne Procyon36 Docker ビルドスクリプト${NC}"
    echo ""
    echo "使用方法:"
    echo "  $0 [オプション] [キーマップ名]"
    echo ""
    echo "オプション:"
    echo "  -h, --help       このヘルプを表示"
    echo "  -c, --clean      ビルド前にクリーンアップを実行"
    echo "  -f, --flash      ビルド後にフラッシュを実行"
    echo "  -v, --verbose    詳細な出力を表示"
    echo "  --build-only     ビルド専用コンテナを使用"
    echo ""
    echo "例:"
    echo "  $0 default                   # defaultキーマップをビルド"
    echo "  $0 -f default               # defaultキーマップをビルドしてフラッシュ"
    echo "  $0 -c -v my_keymap          # my_keymapをクリーンビルド（詳細出力）"
    echo "  $0 --build-only default     # ビルド専用コンテナでdefaultキーマップをビルド"
}

# デフォルト値
KEYMAP="default"
CLEAN=false
FLASH=false
VERBOSE=false
BUILD_ONLY=false
KEYBOARD="corne_procyon36"

# 引数の解析
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -f|--flash)
            FLASH=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        -*)
            echo -e "${RED}エラー: 不明なオプション $1${NC}"
            show_help
            exit 1
            ;;
        *)
            KEYMAP=$1
            shift
            ;;
    esac
done

# Docker Composeの確認
if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    echo -e "${RED}エラー: DockerまたはDocker Composeがインストールされていません${NC}"
    exit 1
fi

# キーマップディレクトリの確認
KEYMAP_DIR="keyboards/${KEYBOARD}/keymaps/${KEYMAP}"
if [ ! -d "$KEYMAP_DIR" ]; then
    echo -e "${YELLOW}警告: キーマップディレクトリ ${KEYMAP_DIR} が見つかりません${NC}"
    echo -e "${YELLOW}利用可能なキーマップ:${NC}"
    find "keyboards/${KEYBOARD}/keymaps" -maxdepth 1 -type d -exec basename {} \; | grep -v keymaps | sort
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}QMK Corne Procyon36 ビルド開始${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "キーボード: ${GREEN}${KEYBOARD}${NC}"
echo -e "キーマップ: ${GREEN}${KEYMAP}${NC}"
echo -e "クリーン: ${GREEN}${CLEAN}${NC}"
echo -e "フラッシュ: ${GREEN}${FLASH}${NC}"
echo -e "詳細出力: ${GREEN}${VERBOSE}${NC}"
echo ""

# コンテナサービス名の決定
if [ "$BUILD_ONLY" = true ]; then
    SERVICE_NAME="qmk-build"
    COMPOSE_PROFILE="--profile build-only"
else
    SERVICE_NAME="qmk-dev"
    COMPOSE_PROFILE=""
fi

# ビルドオプションの設定
MAKE_OPTS=""
if [ "$VERBOSE" = true ]; then
    MAKE_OPTS="${MAKE_OPTS} VERBOSE=1"
fi

# クリーンアップ
if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}クリーンアップを実行中...${NC}"
    docker-compose $COMPOSE_PROFILE run --rm $SERVICE_NAME make clean
fi

# ビルド実行
echo -e "${BLUE}ビルドを実行中...${NC}"
BUILD_TARGET="${KEYBOARD}:${KEYMAP}"
if [ "$FLASH" = true ]; then
    BUILD_TARGET="${BUILD_TARGET}:flash"
fi

if docker-compose $COMPOSE_PROFILE run --rm $SERVICE_NAME make $BUILD_TARGET $MAKE_OPTS; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}ビルド成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    # 生成されたファイルの表示
    if [ "$FLASH" = false ]; then
        echo -e "${BLUE}生成されたファイル:${NC}"
        find . -name "${KEYBOARD}_${KEYMAP}.*" -type f -newer docker-compose.yml 2>/dev/null | head -5
    fi
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}ビルドに失敗しました${NC}"
    echo -e "${RED}========================================${NC}"
    exit 1
fi

