/**
 * Cria automaticamente o Google Forms do sorteio de comprovantes de depósito.
 *
 * Como usar:
 * 1. Acesse https://script.google.com/ logado na conta Google que vai ficar
 *    dona do formulário.
 * 2. Clique em "Novo projeto".
 * 3. Apague o conteúdo de exemplo e cole todo o conteúdo deste arquivo.
 * 4. (Opcional) troque o texto da constante TITULO abaixo.
 * 5. Clique em "Executar" com a função criarFormularioSorteio selecionada.
 * 6. Autorize o acesso quando o Google pedir (é a sua própria conta).
 * 7. Abra "Ver" > "Registros de execução" (ou Ctrl+Enter) para pegar o link
 *    de resposta e o link de edição do formulário.
 *
 * O formulário e a pasta com os arquivos enviados ficam salvos no Google
 * Drive da conta que executar o script.
 */
function criarFormularioSorteio() {
  var TITULO = 'Sorteio - Envio de Comprovante de Depósito';
  var TAMANHO_MAXIMO_ARQUIVO = 10 * 1024 * 1024; // 10 MB

  var form = FormApp.create(TITULO);
  form.setDescription(
    'Preencha os campos abaixo para participar do sorteio.\n' +
    'É necessário enviar o print do depósito feito no site e o comprovante de pagamento.'
  );
  form.setCollectEmail(false);
  form.setProgressBar(true);
  form.setConfirmationMessage('Recebemos sua participação! Boa sorte no sorteio.');

  form.addMultipleChoiceItem()
    .setTitle('Em qual plataforma você está assistindo?')
    .setChoiceValues(['Twitch', 'YouTube', 'Kick'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Qual o seu nick (nome de usuário) nessa plataforma?')
    .setRequired(true);

  form.addFileUploadItem()
    .setTitle('Print do depósito feito no site')
    .setHelpText('Envie uma captura de tela mostrando o depósito realizado no site.')
    .setFileTypes([FormApp.FileType.IMAGE])
    .setMaxFiles(1)
    .setMaxFileSize(TAMANHO_MAXIMO_ARQUIVO)
    .setRequired(true);

  form.addFileUploadItem()
    .setTitle('Comprovante de pagamento')
    .setHelpText('Envie o comprovante do pagamento (PIX, transferência, etc.), em imagem ou PDF.')
    .setFileTypes([FormApp.FileType.IMAGE, FormApp.FileType.PDF])
    .setMaxFiles(1)
    .setMaxFileSize(TAMANHO_MAXIMO_ARQUIVO)
    .setRequired(true);

  Logger.log('Link para responder: ' + form.getPublishedUrl());
  Logger.log('Link para editar: ' + form.getEditUrl());
}
