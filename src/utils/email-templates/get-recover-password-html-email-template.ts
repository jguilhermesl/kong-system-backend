export const getRecoverPasswordHtmlEmailTemplate = (
    name: string,
    code: string
) => {
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email para Recuperação de Senha</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #888888;
          margin: 0;
          padding: 100px;
      }
      .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
          background-color: ##FB6B04;
          padding: 10px;
          text-align: center;
          color: white;
          border-radius: 8px 8px 0 0;
      }
      .header h1 {
          margin: 0;
          font-size: 24px;
      }
      .content {
          padding: 20px;
          color: #333333;
          line-height: 1.6;
      }
      .content h2 {
          color: ##FB6B04;
      }
      .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #888888;
      }
      .code-box {
          background-color: #f0f0f0;
          border: 1px solid ##FB6B04;
          padding: 10px;
          font-size: 24px;
          text-align: center;
          border-radius: 4px;
          margin-top: 10px;
      }
  </style>
</head>
<body>
  <div class="email-container">
      <div class="header">
          <h1>Bem-vindo à KongGames</h1>
      </div>
      <div class="content">
          <h2>Olá ${name}!</h2>
          <p>Seu código para recuperar a senha:</p>
          <div class="code-box">
              ${code}
          </div>
          <p>Se precisar de mais informações, entre em contato conosco.</p>
      </div>
      <div class="footer">
          <p>© 2025 KongGames. Todos os direitos reservados.</p>
      </div>
  </div>
</body>
</html>
`;

    return html;
};
