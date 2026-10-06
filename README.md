# Formulário de Sorteio – Comprovante de Depósito

Script e instruções para gerar o Google Forms usado para receber as inscrições do sorteio: os participantes informam o nick da rede onde estão assistindo (Twitch, YouTube ou Kick) e enviam o comprovante do depósito feito no site.

> Não tenho acesso à sua conta Google para criar o formulário diretamente por aqui. O jeito mais rápido de gerar exatamente esse formulário é rodar o script abaixo (leva menos de 1 minuto). Se preferir, dá pra montar manualmente seguindo a lista de campos mais abaixo.

## Perguntas do formulário

1. **Em qual plataforma você está assistindo?** — múltipla escolha, obrigatória — Twitch / YouTube / Kick
2. **Qual o seu nick (nome de usuário) nessa plataforma?** — resposta curta, obrigatória
3. **Print do depósito feito no site** — upload de arquivo, obrigatória, somente imagem
4. **Comprovante de pagamento** — upload de arquivo, obrigatória, imagem ou PDF

## Opção 1 – Gerar automaticamente com o script (recomendado)

1. Acesse https://script.google.com/ logado na conta Google que vai ficar dona do formulário.
2. Clique em **Novo projeto**.
3. Apague o conteúdo de exemplo e cole todo o conteúdo do arquivo [`criar-formulario-sorteio.gs`](./criar-formulario-sorteio.gs).
4. Se quiser, troque o texto da constante `TITULO` no topo do script.
5. Clique em **Executar** (▶) com a função `criarFormularioSorteio` selecionada.
6. Na primeira execução o Google vai pedir autorização — é a sua própria conta pedindo acesso para criar o formulário, pode aceitar.
7. Depois de rodar, vá em **Ver → Registros de execução** (ou `Ctrl+Enter`) para pegar:
   - o link para **responder** o formulário (esse é o que você divulga no chat/descrição da live);
   - o link para **editar** o formulário.

O formulário criado é um Google Forms normal, seu — dá pra editar cores, textos e perguntas depois como qualquer outro.

## Opção 2 – Criar manualmente

Se preferir não usar o script, crie um formulário em forms.google.com e adicione as 4 perguntas da lista acima, usando os mesmos tipos de campo (múltipla escolha, resposta curta e upload de arquivo).

## Importante: upload de arquivo exige login Google

Perguntas do tipo "upload de arquivo" só funcionam se quem responde estiver logado numa conta Google — é uma exigência do próprio Google Forms, não dá pra desativar. Avise isso para quem for participar; quem não tiver conta Google não vai conseguir anexar os comprovantes.

Os arquivos enviados ficam salvos automaticamente numa pasta no Google Drive da conta que criou o formulário.

---

# Animação – Sorteio de 10 facas (Danoco × G4skins)

Pasta [`animacao-sorteio/`](./animacao-sorteio): animação em estilo retrô art déco (roxo G4skins + dourado), com as silhuetas dos 4 modelos de faca do sorteio — **Navaja, Survival, Paracord e Kukri** — e uma "roleta" de cores dentro de cada silhueta, mostrando que a skin é aleatória.

Roteiro (loop de 28 s):

1. **Abertura** – moldura e medalhão art déco se desenham, pantera da G4skins, "DANOCO × G4SKINS APRESENTAM".
2. **Título** – "SORTEIO", contador de 1 até **10 FACAS**, "SKINS ALEATÓRIAS".
3. **Modelos** – cada faca entra numa janela art déco, contorno dourado, roleta de skins, brilho e o nome do modelo (01/04 … 04/04).
4. **Leque** – as 4 silhuetas se abrem em leque em volta da pantera, com os nomes embaixo.
5. **Card final** – arte do Danoco, "SORTEIO DE 10 FACAS", **FINAL DE OUTUBRO**, "DANOCO × G4SKINS" e "FIQUE LIGADO NA LIVE".

## Arquivos

- `sorteio-16x9.mp4` – 1920×1080, 60 fps (live, YouTube, Twitter).
- `sorteio-9x16.mp4` – 1080×1920, 60 fps (Reels, TikTok, Shorts, stories).
- `index.html` – a animação ao vivo (roda no navegador).

## Usar no OBS

Adicione uma **Fonte de navegador** → marque "Arquivo local" → escolha `animacao-sorteio/index.html`, com largura 1920 e altura 1080. Para a versão vertical, use o endereço `index.html?formato=vertical` com 1080×1920.

Parâmetros: `?formato=vertical`, `?loop=0` (toca uma vez e para no card final), `?t=12` (congela no segundo 12, bom para tirar print).

## Mudar textos

No começo do `<script>` do `index.html` fica o objeto `CONFIG` (quantidade, data, chamada e nomes dos modelos). Ex.: troque `'FINAL DE OUTUBRO'` por `'31 DE OUTUBRO'` quando a data estiver fechada. Depois de editar, regrave os vídeos com `node gravar.mjs` e `node gravar.mjs vertical` (precisa de Node, ffmpeg e `npm i playwright`).
