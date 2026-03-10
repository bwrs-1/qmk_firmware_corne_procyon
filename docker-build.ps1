# QMK Corne Procyon36 Docker ビルドスクリプト (PowerShell版)
param(
    [string]$Keymap = "default",
    [switch]$Clean,
    [switch]$Flash,
    [switch]$Verbose,
    [switch]$BuildOnly,
    [switch]$Help
)

# カラー定義
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# ヘルプ表示
function Show-Help {
    Write-Host "QMK Corne Procyon36 Docker ビルドスクリプト" -ForegroundColor $Blue
    Write-Host ""
    Write-Host "使用方法:"
    Write-Host "  .\docker-build.ps1 [-Keymap <キーマップ名>] [オプション]"
    Write-Host ""
    Write-Host "パラメータ:"
    Write-Host "  -Keymap <名前>     使用するキーマップ名 (デフォルト: default)"
    Write-Host "  -Clean             ビルド前にクリーンアップを実行"
    Write-Host "  -Flash             ビルド後にフラッシュを実行"
    Write-Host "  -Verbose           詳細な出力を表示"
    Write-Host "  -BuildOnly         ビルド専用コンテナを使用"
    Write-Host "  -Help              このヘルプを表示"
    Write-Host ""
    Write-Host "例:"
    Write-Host "  .\docker-build.ps1                              # defaultキーマップをビルド"
    Write-Host "  .\docker-build.ps1 -Keymap default -Flash      # defaultキーマップをビルドしてフラッシュ"
    Write-Host "  .\docker-build.ps1 -Keymap my_keymap -Clean -Verbose  # my_keymapをクリーンビルド（詳細出力）"
    Write-Host "  .\docker-build.ps1 -BuildOnly -Keymap default  # ビルド専用コンテナでdefaultキーマップをビルド"
}

# ヘルプが要求された場合
if ($Help) {
    Show-Help
    exit 0
}

# 定数
$Keyboard = "corne_procyon36"

# Docker/Docker Composeの確認
try {
    $null = Get-Command docker -ErrorAction Stop
} catch {
    Write-Host "エラー: Dockerがインストールされていません" -ForegroundColor $Red
    exit 1
}

try {
    $null = Get-Command docker-compose -ErrorAction Stop
} catch {
    Write-Host "警告: docker-composeが見つかりません。docker composeを試します..." -ForegroundColor $Yellow
}

# キーマップディレクトリの確認
$KeymapDir = "keyboards\$Keyboard\keymaps\$Keymap"
if (-not (Test-Path $KeymapDir)) {
    Write-Host "警告: キーマップディレクトリ $KeymapDir が見つかりません" -ForegroundColor $Yellow
    Write-Host "利用可能なキーマップ:" -ForegroundColor $Yellow
    $availableKeymaps = Get-ChildItem "keyboards\$Keyboard\keymaps" -Directory | Select-Object -ExpandProperty Name
    $availableKeymaps | Sort-Object | ForEach-Object { Write-Host "  $_" }
    exit 1
}

Write-Host "========================================" -ForegroundColor $Blue
Write-Host "QMK Corne Procyon36 ビルド開始" -ForegroundColor $Blue
Write-Host "========================================" -ForegroundColor $Blue
Write-Host "キーボード: " -NoNewline; Write-Host $Keyboard -ForegroundColor $Green
Write-Host "キーマップ: " -NoNewline; Write-Host $Keymap -ForegroundColor $Green
Write-Host "クリーン: " -NoNewline; Write-Host $Clean -ForegroundColor $Green
Write-Host "フラッシュ: " -NoNewline; Write-Host $Flash -ForegroundColor $Green
Write-Host "詳細出力: " -NoNewline; Write-Host $Verbose -ForegroundColor $Green
Write-Host ""

# コンテナサービス名の決定
if ($BuildOnly) {
    $ServiceName = "qmk-build"
    $ComposeProfile = "--profile", "build-only"
} else {
    $ServiceName = "qmk-dev"
    $ComposeProfile = @()
}

# ビルドオプションの設定
$MakeOpts = @()
if ($Verbose) {
    $MakeOpts += "VERBOSE=1"
}

# Docker Composeコマンドの準備
$DockerComposeCmd = "docker-compose"
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    $DockerComposeCmd = "docker"
    $ComposeArgs = @("compose") + $ComposeProfile + @("run", "--rm", $ServiceName)
} else {
    $ComposeArgs = $ComposeProfile + @("run", "--rm", $ServiceName)
}

# クリーンアップ
if ($Clean) {
    Write-Host "クリーンアップを実行中..." -ForegroundColor $Yellow
    $cleanArgs = $ComposeArgs + @("make", "clean")
    & $DockerComposeCmd $cleanArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "クリーンアップに失敗しました" -ForegroundColor $Red
        exit 1
    }
}

# ビルド実行
Write-Host "ビルドを実行中..." -ForegroundColor $Blue
$BuildTarget = "$Keyboard`:$Keymap"
if ($Flash) {
    $BuildTarget = "$BuildTarget`:flash"
}

$buildArgs = $ComposeArgs + @("make", $BuildTarget) + $MakeOpts
& $DockerComposeCmd $buildArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "========================================" -ForegroundColor $Green
    Write-Host "ビルド成功！" -ForegroundColor $Green
    Write-Host "========================================" -ForegroundColor $Green
    
    # 生成されたファイルの表示
    if (-not $Flash) {
        Write-Host "生成されたファイル:" -ForegroundColor $Blue
        $pattern = "${Keyboard}_${Keymap}.*"
        $recentFiles = Get-ChildItem -Path . -Filter $pattern -File | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-5) } | Select-Object -First 5
        $recentFiles | ForEach-Object { Write-Host "  $($_.Name)" }
    }
} else {
    Write-Host "========================================" -ForegroundColor $Red
    Write-Host "ビルドに失敗しました" -ForegroundColor $Red
    Write-Host "========================================" -ForegroundColor $Red
    exit 1
}

