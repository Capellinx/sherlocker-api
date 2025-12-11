import { Router, type Router as RouterType } from "express";
import { makeCreatePixPaymentController } from "@/infrastructure/factories/payment/create-pix-payment.factory.ts";
import { makeHandlePaymentWebhookController } from "@/infrastructure/factories/payment/handle-payment-webhook.factory.ts";
import { makeCheckPaymentStatusController } from "@/infrastructure/factories/payment/check-payment-status.factory.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";
import { RequestValidationMiddleware } from "@/infrastructure/middlewares/validate-request.middleware.ts";
import { createPixPaymentSchema } from "@/application/dtos/payment/create-pix-payment.dto.ts";
import { webhookPaymentSchema } from "@/application/dtos/payment/webhook-payment.dto.ts";
import { checkPaymentStatusSchema } from "@/application/dtos/payment/check-payment-status.dto.ts";

const paymentRoutes: RouterType = Router();

const createPixPaymentController = makeCreatePixPaymentController();
const handlePaymentWebhookController = makeHandlePaymentWebhookController();
const checkPaymentStatusController = makeCheckPaymentStatusController();

paymentRoutes.post(
	"/pix",
	ValidateTokenMiddleware.execute,
	RequestValidationMiddleware.execute({ body: createPixPaymentSchema }),
	createPixPaymentController.handle.bind(createPixPaymentController)
);

paymentRoutes.post(
	"/webhook",
	RequestValidationMiddleware.execute({ body: webhookPaymentSchema }),
	handlePaymentWebhookController.handle.bind(
		handlePaymentWebhookController
	)
);

paymentRoutes.post(
	"/check-status",
	ValidateTokenMiddleware.execute,
	RequestValidationMiddleware.execute({ body: checkPaymentStatusSchema }),
	checkPaymentStatusController.handle.bind(checkPaymentStatusController)
);

export { paymentRoutes };
