export function generatePaymentConfirmationEmailTemplate(data: {
	name: string;
	planName: string;
	amount: number;
	endDate: Date;
}): string {
	const formattedAmount = (data.amount / 100).toFixed(2);
	const formattedDate = data.endDate.toLocaleDateString("pt-BR");

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Pagamento Confirmado - Sherlocker</title>
	<style>
		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			line-height: 1.6;
			color: #ffffff;
			background-color: #1a1a1a;
			margin: 0;
			padding: 20px;
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
			margin: 0 0 10px 0;
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
		.success-icon {
			font-size: 48px;
			text-align: center;
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
			margin-top: 0;
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
			border-bottom: none;
		}
		.info-label {
			color: #cccccc;
		}
		.info-value {
			color: #ffcc00;
			font-weight: bold;
		}
		.message {
			color: #ffffff;
			font-size: 16px;
			line-height: 1.8;
			margin: 20px 0;
		}
		.footer {
			background-color: #000000;
			padding: 30px;
			text-align: center;
			color: #888888;
			font-size: 14px;
		}
		.footer p {
			margin: 5px 0;
		}
		.signature {
			margin-top: 30px;
			color: #ffffff;
		}
		.signature strong {
			color: #ffcc00;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🔐 SHERLOCKER</h1>
			<p>Investigação de Dados Profissional</p>
		</div>
		
		<div class="content">
			<div class="success-icon">✅</div>
			
			<p class="greeting">Olá, <strong>${data.name}</strong>!</p>
			
			<p class="message">
				Recebemos a confirmação do seu pagamento e sua assinatura está <strong style="color: #ffcc00;">ATIVA</strong>.
			</p>
			
			<div class="info-box">
				<h3>Detalhes da Assinatura</h3>
				<div class="info-row">
					<span class="info-label">Plano:</span>
					<span class="info-value">${data.planName}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Valor:</span>
					<span class="info-value">R$ ${formattedAmount}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Válida até:</span>
					<span class="info-value">${formattedDate}</span>
				</div>
			</div>
			
			<p class="message">
				Agora você tem acesso completo a todos os recursos do <strong style="color: #ffcc00;">Sherlocker</strong>.
			</p>
			
			<p class="message">
				Se tiver qualquer dúvida, não hesite em entrar em contato conosco.
			</p>
			
			<p class="signature">
				Atenciosamente,<br>
				<strong>Equipe Sherlocker</strong>
			</p>
		</div>
		
		<div class="footer">
			<p>© 2025 Sherlocker. Todos os direitos reservados.</p>
			<p>Este é um email automático, por favor não responda.</p>
		</div>
	</div>
</body>
</html>
	`.trim();
}
