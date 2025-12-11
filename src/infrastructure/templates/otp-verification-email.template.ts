export function generateOtpVerificationEmailTemplate(data: {
	name: string;
	otp: string;
}): string {
	return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Verificação de Email - Sherlocker</title>
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
		.message {
			color: #ffffff;
			font-size: 16px;
			line-height: 1.8;
			margin: 20px 0;
		}
		.otp-box {
			background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
			border: 3px dashed #ffcc00;
			border-radius: 10px;
			padding: 30px;
			margin: 30px 0;
			text-align: center;
		}
		.otp-label {
			color: #cccccc;
			font-size: 14px;
			text-transform: uppercase;
			letter-spacing: 2px;
			margin-bottom: 15px;
		}
		.otp-code {
			font-size: 48px;
			font-weight: bold;
			color: #ffcc00;
			letter-spacing: 10px;
			font-family: 'Courier New', monospace;
			text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
		}
		.validity-info {
			background-color: #2a2a2a;
			border-left: 4px solid #ffcc00;
			padding: 15px 20px;
			margin: 20px 0;
			border-radius: 5px;
		}
		.validity-info strong {
			color: #ffcc00;
		}
		.warning-box {
			background-color: #2a1a00;
			border-left: 4px solid #ff9900;
			padding: 15px 20px;
			margin: 25px 0;
			border-radius: 5px;
		}
		.warning-box strong {
			color: #ff9900;
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
			<p>Verificação de Email</p>
		</div>
		
		<div class="content">
			<p class="greeting">Olá, <strong>${data.name}</strong>!</p>
			
			<p class="message">
				Use o código de verificação abaixo para confirmar seu email:
			</p>
			
			<div class="otp-box">
				<div class="otp-label">Seu Código</div>
				<div class="otp-code">${data.otp}</div>
			</div>
			
			<div class="validity-info">
				<p class="message" style="margin: 0;">
					⏱️ Este código é válido por <strong>5 minutos</strong> e deve ser usado apenas uma vez.
				</p>
			</div>
			
			<div class="warning-box">
				<p class="message" style="margin: 0;">
					<strong>⚠️ Atenção:</strong> Se você não solicitou esta verificação, ignore este email e mantenha sua conta segura.
				</p>
			</div>
			
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
