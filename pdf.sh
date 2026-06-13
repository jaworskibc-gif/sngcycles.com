#!/bin/bash
# SNG Cycles — generate all PDFs to C:\Users\Shark\Downloads\
# Run: bash pdf.sh

set -e
cd "$(dirname "$0")"

# Ensure Chromium dependencies are available (extracted once, reused)
LIBS=/tmp/chromium-libs
if [ ! -d "$LIBS/usr/lib/x86_64-linux-gnu/libnspr4.so" ]; then
  echo "Setting up Chrome dependencies..."
  mkdir -p "$LIBS"
  cd /tmp
  apt-get download \
    libnspr4 libnss3 libgbm1 libpango-1.0-0 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
    libasound2t64 libatk1.0-0t64 libatk-bridge2.0-0t64 \
    libcups2t64 libglib2.0-0t64 libxss1 2>/dev/null || true
  for f in *.deb; do
    dpkg-deb -x "$f" "$LIBS/" 2>/dev/null || true
  done
  cd -
fi

export LD_LIBRARY_PATH="$LIBS/usr/lib/x86_64-linux-gnu:$LIBS/usr/lib:$LIBS/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH:-}"

node make-pdfs.js
