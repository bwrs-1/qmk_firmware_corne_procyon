# QMK Firmware Docker 開発環境
FROM ghcr.io/qmk/qmk_cli:latest

# 日本語ロケールとタイムゾーンの設定
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    make \
    python3 \
    python3-pip \
    python3-venv \
    vim \
    nano \
    curl \
    wget \
    locales \
    tzdata \
    && locale-gen ja_JP.UTF-8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /qmk_firmware

# Python依存関係の事前インストール（ビルド時間短縮のため）
# requirements.txtが存在する場合のみコピーしてインストール
COPY requirements*.txt ./
RUN if [ -f requirements.txt ]; then pip3 install --no-cache-dir -r requirements.txt; fi
RUN if [ -f requirements-dev.txt ]; then pip3 install --no-cache-dir -r requirements-dev.txt; fi

# QMKの設定
RUN qmk setup --yes

# 起動時のシェル設定
SHELL ["/bin/bash", "-c"]

# 開発用のエントリーポイント
ENTRYPOINT ["/bin/bash"]

