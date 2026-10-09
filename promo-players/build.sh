#!/usr/bin/env bash
# Monta: intro 3D (frames 120fps -> 30fps com motion blur) + flash + espaço do highlight + som.
# uso: NICK=SHZ4TW TAG="PLAYER 01" ./build.sh <saida.mp4> [clipe_highlight.mp4]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-promo.mp4}
CLIP=${2:-}
FONT=$PWD/Anton.ttf
NICK=${NICK:-SHZ4TW}
TAG=${TAG:-"PLAYER 01"}

# 1) intro: média de 4 sub-quadros = motion blur, 4.0 s @ 30 fps
ffmpeg -loglevel error -y -framerate 120 -i frames/f%05d.png \
  -vf "tmix=frames=4:weights='1 1 1 1',select='not(mod(n\,4))',setpts=N/30/TB,fps=30,
       drawtext=fontfile=$FONT:text='$TAG':fontsize=46:fontcolor=white:x=(w-tw)/2:y=250:
         alpha='if(lt(t,2.75),0,min(1,(t-2.75)/0.25))',
       drawbox=x=(iw-260)/2:y=316:w=260:h=4:color=0xff1a2e:t=fill:enable='gte(t,2.8)',
       fade=t=out:st=3.88:d=0.12:color=white,format=yuv420p" \
  -c:v libx264 -crf 16 -preset slow -r 30 intro.mp4

# 2) highlight: clipe real se existir, senão placeholder de 3.5 s
if [[ -n "$CLIP" ]]; then
  ffmpeg -loglevel error -y -i "$CLIP" -t 3.5 \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,fade=t=in:st=0:d=0.15:color=white,format=yuv420p" \
    -an -c:v libx264 -crf 16 -preset slow hl.mp4
else
  ffmpeg -loglevel error -y -f lavfi -i "color=c=0x15151a:s=1920x1080:r=30:d=3.5" \
    -vf "format=yuv420p,noise=alls=14:allf=t,vignette=PI/4,
       drawtext=fontfile=$FONT:text='CLIPE DO HIGHLIGHT AQUI':fontsize=110:fontcolor=white@0.85:x=(w-tw)/2:y=(h-th)/2-30,
       drawtext=fontfile=$FONT:text='melhor jogada do $NICK · 3 a 5 segundos':fontsize=40:fontcolor=0xff1a2e:x=(w-tw)/2:y=(h/2)+80,
       fade=t=in:st=0:d=0.15:color=white,format=yuv420p" \
    -c:v libx264 -crf 18 -preset slow hl.mp4
fi
# nick fixo no canto durante o highlight (lower third)
ffmpeg -loglevel error -y -i hl.mp4 \
  -vf "drawbox=x=0:y=ih-170:w='min(560,560*t/0.25)':h=90:color=black@0.75:t=fill,
       drawbox=x=0:y=ih-170:w=10:h=90:color=0xff1a2e:t=fill,
       drawtext=fontfile=$FONT:text='$NICK':fontsize=64:fontcolor=white:x=40:y=h-160:alpha='min(1,max(0,(t-0.15)/0.2))'" \
  -c:v libx264 -crf 16 -preset slow hl2.mp4

# 3) som: grave contínuo + riser até o impacto (2.6 s) + impacto + whoosh no corte (4.0 s)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc=exprs='
  0.18*sin(2*PI*55*t)*min(1,t/0.5)*if(lt(t,2.6),1,0.4)
  + if(lt(t,2.6), 0.22*pow(t/2.6,2)*sin(2*PI*(180*t+190*t*t)) + 0.16*pow(t/2.6,3)*(random(0)*2-1), 0)
  + if(gte(t,2.6), 0.95*exp(-(t-2.6)*3.2)*sin(2*PI*(38*(t-2.6)+3*(1-exp(-(t-2.6)*15)))) + 0.45*exp(-(t-2.6)*14)*(random(1)*2-1), 0)
  + 0.30*exp(-pow((t-3.97)/0.09,2))*(random(2)*2-1)
  ':s=48000:d=7.5" -af "lowpass=f=9000,acompressor=threshold=0.3:ratio=4,alimiter=limit=0.95" -c:a aac -b:a 192k sfx.m4a

# 4) junta
ffmpeg -loglevel error -y -i intro.mp4 -i hl2.mp4 -i sfx.m4a \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" -map 2:a -shortest \
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"
echo "ok -> $OUT"
