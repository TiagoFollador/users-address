<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Recuperação de Senha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Recuperação de Senha</h1>
        </div>
        
        <div class="content">
            <p>Olá, {{ $user->name }}!</p>
            
            <p>Você solicitou a recuperação de senha para sua conta. Clique no botão abaixo para redefinir sua senha:</p>
            
            <p style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Redefinir Senha</a>
            </p>
            
            <p>Ou copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                {{ $resetUrl }}
            </p>
            
            <p><strong>Este link expira em 60 minutos.</strong></p>
            
            <p>Se você não solicitou esta recuperação de senha, ignore este email.</p>
        </div>
        
        <div class="footer">
            <p>Este é um email automático, não responda.</p>
        </div>
    </div>
</body>
</html>
