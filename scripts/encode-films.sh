#!/usr/bin/env bash
# Encodes the client films in media-src/ into web versions in public/assets/films/:
#   <id>.mp4          720×1280 H.264 + AAC, faststart (streams progressively)
#   <id>-preview.mp4  360×640, 6s silent loop for the gallery cards
#   <id>-poster.jpg   540×960 still (image pipeline makes AVIF/WebP)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/assets/films
mkdir -p "$OUT"
# id | source file | poster time (s) | preview start (s) | full encode? (1/0)
while IFS='|' read -r id src tp tv full; do
  [ -z "$id" ] && continue
  echo "== $id"
  if [ "$full" = "1" ] || [ ! -f "$OUT/$id.mp4" ]; then
  ffmpeg -nostdin -v error -y -i "media-src/$src" -vf "scale=720:1280:flags=lanczos,fps=30" \
    -c:v libx264 -preset slow -crf 27 -maxrate 2200k -bufsize 4400k -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart "$OUT/$id.mp4"
  fi
  ffmpeg -nostdin -v error -y -ss "$tv" -t 6 -i "media-src/$src" -vf "scale=360:640:flags=lanczos,fps=24" -an \
    -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart "$OUT/$id-preview.mp4"
  ffmpeg -nostdin -v error -y -ss "$tp" -i "media-src/$src" -frames:v 1 -vf "scale=540:960:flags=lanczos" -q:v 3 \
    "public/assets/film-$id-poster.jpg"
done <<'LIST'
location|Sharda Paradise RjedU_1.mp4|13|12|0
tour|Sharada Paradise V2 RjedU_3.mp4|8|54|0
infrastructure|Sharda paradise 2222.mp4|13|12|0
connectivity|Sharda paradise insta posoting video .mp4|16|15|0
life|Shrada paradise 333.mp4|8.5|6.5|0
LIST
ls -la "$OUT"
