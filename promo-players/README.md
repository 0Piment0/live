# Promo – apresentação dos players

Intro de cada jogador: a câmera passa de lado pelas letras 3D do nick, dá a volta e trava de frente no impacto. Depois um flash branco corta para o highlight dele.

`shz4tw-intro-teste.mp4` é o protótipo (1920×1080, 30 fps, 7,5 s). O espaço do highlight ainda está como placeholder.

## Timeline

| Tempo | O que acontece | Som |
| --- | --- | --- |
| 0,0 – 2,6 s | Câmera lateral rasante girando ~100° ao redor das letras, com motion blur | Grave + riser subindo |
| 2,6 s | Trava de frente, tranco, brilho nas bordas, faíscas explodem | **Impacto** |
| 2,75 – 4,0 s | "PLAYER 01" aparece, luz passa pela frente das letras | Cauda do impacto |
| 3,9 – 4,0 s | Flash branco | Whoosh |
| 4,0 – 7,5 s | Highlight do jogador com o nick fixo no canto | (áudio do clipe/música) |

## Gerar para outro jogador

Precisa de Node 22, ffmpeg e Playwright com Chromium.

```bash
npm install
node render.mjs frames 120 1920 1080 NOVONICK              # ~8–10 min sem GPU
NICK=NOVONICK TAG="PLAYER 02" ./build.sh novonick.mp4 clipe-do-highlight.mp4
```

Sem o segundo argumento, o `build.sh` coloca o placeholder no lugar do highlight. Com o clipe, ele usa os primeiros 3,5 s, cortados para 16:9.

Para ajustar:

- **Cor:** `index.html?color=%23ff1a2e`. Também troque `0xff1a2e` no `build.sh`.
- **Timing:** `T_LOCK` (momento do impacto) e `DUR` no `index.html`. Se mexer, ajuste também os tempos do som no `build.sh` (`2.6` e `3.97`).
- O `render.mjs` importa o Playwright do caminho global (`/opt/node22/lib/node_modules/playwright`). Em outra máquina, troque pelo caminho local.

## Pendências antes de publicar

- O som é sintetizado, só para marcar o timing. Para a versão final, use uma música sem copyright (Biblioteca de Áudio do YouTube, NCS) e alinhe o drop com 2,6 s.
- O clipe de highlight de cada jogador: 3–5 s, a melhor jogada, começando já na ação.
