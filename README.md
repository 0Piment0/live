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
