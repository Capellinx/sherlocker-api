export function generateRecurringChargeEmailTemplate(data: {
	userName: string;
	planName: string;
	amount: number;
	expiresAt: Date;
	pixQrCodeBase64: string;
	pixCopyPaste: string;
}): string {
	const formattedAmount = (data.amount / 100).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const formattedDate = data.expiresAt.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cobrança Recorrente - Sherlocker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #1a1a1a;
            padding: 20px;
            color: #ffffff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(255, 204, 0, 0.3);
            border: 2px solid #ffcc00;
        }
        .header {
            background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
            color: #000000;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .header p {
            font-size: 18px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
            background-color: #1a1a1a;
        }
        .greeting {
            font-size: 20px;
            color: #ffffff;
            margin-bottom: 20px;
        }
        .greeting strong {
            color: #ffcc00;
        }
        .message {
            color: #ffffff;
            font-size: 16px;
            line-height: 1.8;
            margin: 20px 0;
        }
        .info-box {
            background-color: #2a2a2a;
            border-left: 4px solid #ffcc00;
            padding: 25px;
            margin: 25px 0;
            border-radius: 5px;
        }
        .info-box h3 {
            color: #ffcc00;
            font-size: 20px;
            margin-bottom: 15px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 15px;
            padding: 8px 0;
            border-bottom: 1px solid #3a3a3a;
        }
        .info-row:last-child {
            margin-bottom: 0;
            border-bottom: none;
        }
        .info-label {
            color: #cccccc;
        }
        .info-value {
            color: #ffcc00;
            font-weight: bold;
        }
        .amount {
            font-size: 36px;
            color: #ffcc00;
            font-weight: bold;
            text-align: center;
            margin: 30px 0;
            text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
        }
        .qrcode-section {
            text-align: center;
            margin: 35px 0;
        }
        .qrcode-section h2 {
            font-size: 20px;
            color: #ffcc00;
            margin-bottom: 20px;
        }
        .qrcode-image {
            max-width: 250px;
            height: auto;
            border: 3px solid #ffcc00;
            border-radius: 10px;
            padding: 15px;
            background-color: #ffffff;
            margin: 0 auto 20px;
            display: block;
            box-shadow: 0 0 15px rgba(255, 204, 0, 0.3);
        }
        .pix-code-section {
            background-color: #2a2a2a;
            border: 2px dashed #ffcc00;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .pix-code-section h3 {
            font-size: 16px;
            color: #ffcc00;
            margin-bottom: 15px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .pix-code {
            background-color: #1a1a1a;
            border: 1px solid #3a3a3a;
            border-radius: 5px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #ffcc00;
            word-break: break-all;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .copy-button {
            background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
            color: #000000;
            border: none;
            padding: 12px 30px;
            font-size: 15px;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            display: inline-block;
            text-decoration: none;
            transition: all 0.3s;
            box-shadow: 0 4px 10px rgba(255, 204, 0, 0.3);
        }
        .copy-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(255, 204, 0, 0.5);
        }
        .instructions {
            background-color: #2a2200;
            border-left: 4px solid #ffcc00;
            padding: 20px;
            margin: 25px 0;
            border-radius: 5px;
        }
        .instructions h3 {
            font-size: 16px;
            color: #ffcc00;
            margin-bottom: 15px;
            font-weight: bold;
        }
        .instructions ol {
            padding-left: 20px;
            color: #ffffff;
        }
        .instructions li {
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .warning {
            background-color: #2a1a00;
            border-left: 4px solid #ff9900;
            padding: 15px;
            margin: 25px 0;
            border-radius: 5px;
            font-size: 14px;
            color: #ff9900;
        }
        .warning strong {
            color: #ffcc00;
        }
        .footer {
            background-color: #000000;
            padding: 30px;
            text-align: center;
            color: #888888;
            font-size: 14px;
            border-top: 1px solid #2a2a2a;
        }
        .footer p {
            margin-bottom: 10px;
        }
        .footer a {
            color: #ffcc00;
            text-decoration: none;
        }
        .signature {
            margin-top: 30px;
            color: #ffffff;
        }
        .signature strong {
            color: #ffcc00;
        }
        @media only screen and (max-width: 600px) {
            .container {
                border-radius: 0;
            }
            .header {
                padding: 30px 20px;
            }
            .content {
                padding: 30px 20px;
            }
            .qrcode-image {
                max-width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💳 SHERLOCKER</h1>
            <p>Cobrança Recorrente - Renovação de Assinatura</p>
        </div>
        
        <div class="content">
            <p class="greeting">
                Olá, <strong>${data.userName}</strong>!
            </p>
            
            <p class="message">
                Sua assinatura está ativa e uma nova cobrança está disponível para pagamento via PIX.
            </p>
            
            <div class="info-box">
                <h3>Detalhes da Cobrança</h3>
                <div class="info-row">
                    <span class="info-label">Plano:</span>
                    <span class="info-value">${data.planName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Vencimento:</span>
                    <span class="info-value">${formattedDate}</span>
                </div>
            </div>
            
            <div class="amount">
                ${formattedAmount}
            </div>
            
            <div class="qrcode-section">
                <h2>📱 Escaneie o QR Code para pagar</h2>
                <img src="data:image/png;base64,${data.pixQrCodeBase64}" alt="QR Code PIX" class="qrcode-image">
            </div>
            
            <div class="pix-code-section">
                <h3>🔑 Ou copie o código PIX Copia e Cola</h3>
                <div class="pix-code">${data.pixCopyPaste}</div>
                <div style="text-align: center;">
                    <span class="copy-button" onclick="navigator.clipboard.writeText('${data.pixCopyPaste}')">
                        📋 Copiar Código PIX
                    </span>
                </div>
            </div>
            
            <div class="instructions">
                <h3>📋 Como pagar com PIX:</h3>
                <ol>
                    <li>Abra o aplicativo do seu banco</li>
                    <li>Escolha a opção "Pagar com PIX"</li>
                    <li>Escaneie o QR Code acima OU cole o código PIX</li>
                <li>Confirme os dados e finalize o pagamento</li>
            </ol>
        </div>
        
        <div class="warning">
            <strong>⚠️ Atenção:</strong> Este PIX expira em ${formattedDate}. Após esta data, será necessário gerar um novo pagamento.
        </div>
        
        <p class="message" style="margin-top: 25px;">
            Assim que o pagamento for confirmado, você receberá um email de confirmação e sua assinatura continuará ativa.
        </p>
        
        <p class="signature">
            Atenciosamente,<br>
            <strong>Equipe Sherlocker</strong>
        </p>
    </div>
    
    <div class="footer">
        <p>© 2025 Sherlocker. Todos os direitos reservados.</p>
        <p>Este é um email automático, por favor não responda.</p>
        <p>Dúvidas? Entre em contato conosco através do nosso suporte.</p>
    </div>
</div>
</body>
</html>
`;
}