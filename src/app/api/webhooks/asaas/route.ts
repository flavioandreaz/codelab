import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const POST = async (req: Request) => {
  try {
    const headersList = await headers();
    // Debug: log headers
    console.log("Headers recebidos:", Object.fromEntries(headersList.entries()));

    // Tente pegar o token por diferentes nomes
    const token = headersList.get("asaas-access-token") || headersList.get("access_token") || headersList.get("authorization");
    console.log("Token recebido:", token);

    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      console.log("Token inválido!");
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    // Debug: log body recebido
    console.log("Body recebido:", body);

    const { event, payment } = body;

    if (!event || !payment) {
      console.log("Payload incompleto!");
      return new Response("Bad Request", { status: 400 });
    }

    const customerId = payment.customer;
    const courseId = payment.externalReference;

    const user = await prisma.user.findFirst({
      where: {
        asaasId: customerId,
      },
    });

    if (!user) {
      console.log("Usuário não encontrado para asaasId:", customerId);
      return new Response("Customer not found", { status: 404 });
    }

    switch (event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        if (event === "PAYMENT_RECEIVED" && payment.billingType !== "PIX") {
          return new Response("Webhook received", { status: 200 });
        }

        const userAlreadyHasCourse = await prisma.coursePurchase.findFirst({
          where: {
            userId: user.id,
            courseId,
          },
        });

        if (!userAlreadyHasCourse) {
          await prisma.coursePurchase.create({
            data: {
              courseId,
              userId: user.id,
            },
          });
        }

        return new Response("Webhook received", { status: 200 });
      case "PAYMENT_REFUNDED":
        const userHasCourse = await prisma.coursePurchase.findFirst({
          where: {
            userId: user.id,
            courseId,
          },
        });

        if (userHasCourse) {
          await prisma.coursePurchase.delete({
            where: {
              id: userHasCourse.id,
            },
          });
          await prisma.completedLesson.deleteMany({
            where: {
              userId: user.id,
              courseId,
            },
          });
        }

        return new Response("Webhook received", { status: 200 });
      default:
        console.log("Evento não tratado:", event);
        return new Response("Unhandled event", { status: 200 });
    }
  } catch (error) {
    console.error("Erro interno no webhook Asaas:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
