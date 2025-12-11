export function generatePaymentExpiredEmailTemplate(data: {
	name: string;
	planName: string;
	amount: number;
	paymentCreatedAt: Date;
	expirationDays: number;
}): string {
	const formattedAmount = (data.amount / 100).toFixed(2);
	const formattedDate = data.paymentCreatedAt.toLocaleDateString("pt-BR");

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Assinatura Cancelada - Sherlocker</title>
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
			background: linear-gradient(135deg, #ff9900 0%, #ff6600 100%);
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
		.message {
			color: #ffffff;
			font-size: 16px;
			line-height: 1.8;
			margin: 20px 0;
		}
		.alert-icon {
			font-size: 48px;
			text-align: center;
			margin: 20px 0;
		}
		.warning-box {
			background-color: #2a1a00;
			border-left: 4px solid #ff9900;
			padding: 25px;
			margin: 25px 0;
			border-radius: 5px;
		}
		.warning-box h3 {
			margin-top: 0;
			color: #ff9900;
			font-size: 20px;
			margin-bottom: 15px;
		}
		.info-row {
			display: flex;
			justify-content: space-between;
			margin-bottom: 12px;
			font-size: 15px;
			padding: 8px 0;
			border-bottom: 1px solid #3a2a00;
		}
		.info-row:last-child {
			border-bottom: none;
		}
		.info-label {
			color: #cccccc;
		}
		.info-value {
			color: #ff9900;
			font-weight: bold;
		}
		.success-box {
			background-color: #1a2a00;
			border-left: 4px solid #ffcc00;
			padding: 25px;
			margin: 25px 0;
			border-radius: 5px;
		}
		.success-box h3 {
			margin-top: 0;
			color: #ffcc00;
			font-size: 20px;
			margin-bottom: 15px;
		}
		.success-box p {
			color: #ffffff;
			margin: 10px 0;
		}
		.cta-section {
			text-align: center;
			margin: 30px 0;
		}
		.cta-button {
			display: inline-block;
			background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
			color: #000000;
			padding: 15px 40px;
			text-decoration: none;
			border-radius: 5px;
			font-weight: bold;
			font-size: 16px;
			box-shadow: 0 4px 10px rgba(255, 204, 0, 0.3);
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
			<h1>⚠️ SHERLOCKER</h1>
			<p>Assinatura Cancelada</p>
		</div>
		
		<div class="content">
			<div class="alert-icon">⚠️</div>
			
			<p class="greeting">Olá, <strong>${data.name}</strong>!</p>
			
			<p class="message">
				Não identificamos o pagamento da sua assinatura e, por isso, ela foi cancelada automaticamente.
			</p>
			
			<div class="warning-box">
				<h3>Detalhes do Pagamento Não Realizado</h3>
				<div class="info-row">
					<span class="info-label">Plano:</span>
					<span class="info-value">${data.planName}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Valor:</span>
					<span class="info-value">R$ ${formattedAmount}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Data da cobrança:</span>
					<span class="info-value">${formattedDate}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Status:</span>
					<span class="info-value">Pagamento não identificado após ${data.expirationDays} dias</span>
				</div>
			</div>
			
			<div class="success-box">
				<h3>✅ Plano Gratuito Ativado</h3>
				<p>Sua conta foi automaticamente migrada para o <strong style="color: #ffcc00;">Plano FREE</strong>.</p>
				<p>Você continua tendo acesso limitado aos recursos do Sherlocker.</p>
			</div>
			
			<h3 style="color: #ffcc00; margin-top: 30px;">Deseja reativar sua assinatura?</h3>
			<p class="message">
				Entre na plataforma e escolha um novo plano para continuar aproveitando todos os benefícios premium.
			</p>
			
			<div class="cta-section">
				<a href="https://sherlocker.com/plans" class="cta-button">
					Ver Planos Disponíveis
				</a>
			</div>
			
			<p class="message">
				Se você já realizou o pagamento e acredita que houve um erro, entre em contato conosco o quanto antes.
			</p>
			
			<p class="signature">
				Atenciosamente,<br>
				<strong>Equipe Sherlocker</strong>
			</p>
		</div>
		
		<div class="footer">
			<p>© 2025 Sherlocker. Todos os direitos reservados.</p>
			<p>Este é um email automático. Se tiver dúvidas, entre em contato com nosso suporte.</p>
		</div>
	</div>
</body>
</html>
	`.trim();
}
