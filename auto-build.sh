#!/bin/bash

# QMK Auto Build Script
# ファイル変更を監視して自動ビルドを実行

set -e

# 設定
KEYBOARD="corne_procyon36"
KEYMAP="default"
WATCH_DIRS=(
    "keyboards/${KEYBOARD}"
    "quantum"
    "drivers"
    "lib"
)
EXTENSIONS="c,h,mk,json"
DEBOUNCE="700ms"

# フラッシュ実行関数
flash_firmware() {
    local firmware_file="$1"
    echo "🔌 フラッシュを開始します..."
    echo "📁 対象ファイル: ${firmware_file}"
    
    # RP2040のBOOTSELモード確認
    echo "⚠️  注意: RP2040のBOOTSELボタンを押しながらUSB接続してください"
    echo "💾 RPI-RP2ドライブが表示されたら、このスクリプトを続行してください"
    
    read -p "フラッシュを実行しますか？ (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 フラッシュを実行中..."
        
        # macOSの場合、cpコマンドでコピー
        if [[ "$OSTYPE" == "darwin"* ]]; then
            if cp "${firmware_file}" "/Volumes/RPI-RP2/"; then
                echo "✅ フラッシュ完了！"
                echo "🔄 キーボードが自動リブートします..."
            else
                echo "❌ フラッシュ失敗: RPI-RP2ドライブが見つからないか、アクセスできません"
                echo "💡 BOOTSELモードで接続されているか確認してください"
            fi
        else
            echo "⚠️  このOSでは自動フラッシュがサポートされていません"
            echo "💡 手動で ${firmware_file} をRPI-RP2ドライブにコピーしてください"
        fi
    else
        echo "⏭️  フラッシュをスキップしました"
    fi
}

# ビルド成功後の処理
post_build_success() {
    echo "✅ ビルド完了: $(date)"
    
    # 生成されたファームウェアファイルを検索
    local firmware_files=()
    while IFS= read -r -d '' file; do
        firmware_files+=("$file")
    done < <(find . -name "*.uf2" -type f -print0 2>/dev/null | head -z -5)
    
    if [ ${#firmware_files[@]} -gt 0 ]; then
        echo ""
        echo "📦 生成されたファームウェアファイル:"
        for file in "${firmware_files[@]}"; do
            echo "   - ${file}"
        done
        
        # 最新のファイルを選択
        local latest_file="${firmware_files[0]}"
        if [ -f "$latest_file" ]; then
            echo ""
            echo "🎯 最新ファイル: ${latest_file}"
            flash_firmware "$latest_file"
        fi
    else
        echo "⚠️  UF2ファイルが見つかりませんでした"
    fi
    
    echo ""
}

echo "🚀 QMK Auto Build を開始します..."
echo "📁 監視対象: ${WATCH_DIRS[*]}"
echo "🔧 ビルド対象: ${KEYBOARD}:${KEYMAP}"
echo "⏱️  デバウンス: ${DEBOUNCE}"
echo ""

# 初回ビルド
echo "📦 初回ビルドを実行中..."
if qmk compile -kb "${KEYBOARD}" -km "${KEYMAP}"; then
    echo "✅ 初回ビルド完了"
    post_build_success
else
    echo "❌ 初回ビルド失敗"
    exit 1
fi

echo ""
echo "👀 ファイル変更を監視中... (Ctrl+C で停止)"
echo ""

# ファイル変更監視と自動ビルド
watchexec \
    -w "${WATCH_DIRS[@]}" \
    --exts "${EXTENSIONS}" \
    -r \
    --debounce "${DEBOUNCE}" \
    -- \
    bash -c '
        echo "🔄 変更を検知しました。ビルドを開始..."
        if qmk compile -kb "'${KEYBOARD}'" -km "'${KEYMAP}'"; then
            echo "✅ ビルド完了: $(date)"
            
            # 生成されたファームウェアファイルを検索
            firmware_files=()
            while IFS= read -r -d "" file; do
                firmware_files+=("$file")
            done < <(find . -name "*.uf2" -type f -print0 2>/dev/null | head -z -5)
            
            if [ ${#firmware_files[@]} -gt 0 ]; then
                echo ""
                echo "📦 生成されたファームウェアファイル:"
                for file in "${firmware_files[@]}"; do
                    echo "   - $file"
                done
                
                # 最新のファイルを選択
                latest_file="${firmware_files[0]}"
                if [ -f "$latest_file" ]; then
                    echo ""
                    echo "🎯 最新ファイル: $latest_file"
                    
                    # フラッシュ実行の確認
                    echo "🔌 フラッシュを開始します..."
                    echo "📁 対象ファイル: $latest_file"
                    echo "⚠️  注意: RP2040のBOOTSELボタンを押しながらUSB接続してください"
                    echo "💾 RPI-RP2ドライブが表示されたら、このスクリプトを続行してください"
                    
                    read -p "フラッシュを実行しますか？ (y/N): " -n 1 -r
                    echo
                    
                    if [[ $REPLY =~ ^[Yy]$ ]]; then
                        echo "🚀 フラッシュを実行中..."
                        
                        # macOSの場合、cpコマンドでコピー
                        if [[ "$OSTYPE" == "darwin"* ]]; then
                            if cp "$latest_file" "/Volumes/RPI-RP2/"; then
                                echo "✅ フラッシュ完了！"
                                echo "🔄 キーボードが自動リブートします..."
                            else
                                echo "❌ フラッシュ失敗: RPI-RP2ドライブが見つからないか、アクセスできません"
                                echo "💡 BOOTSELモードで接続されているか確認してください"
                            fi
                        else
                            echo "⚠️  このOSでは自動フラッシュがサポートされていません"
                            echo "💡 手動で $latest_file をRPI-RP2ドライブにコピーしてください"
                        fi
                    else
                        echo "⏭️  フラッシュをスキップしました"
                    fi
                fi
            else
                echo "⚠️  UF2ファイルが見つかりませんでした"
            fi
        else
            echo "❌ ビルド失敗: $(date)"
        fi
        echo ""
    '
