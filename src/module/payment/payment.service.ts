import {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

import ApiError from "../../utils/AppError";
import HttpStatus from "http-status";

const createCheckout = async (
  payload: { rentalRequestId: string },
  authUser: any,
) => {
  // 1. Fetch the RentalRequest and include the Property to get the dynamic price
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
      tenantId: authUser.id,
    },
    include: {
      property: true,
    },
  });

  if (!rentalRequest) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      "Rental request not found or unauthorized",
    );
  }

  const property = rentalRequest.property;

  // 2. Create the Checkout Session with dynamic price from the Property
  const unitAmount = Math.round(Number(property.rentPrice) * 100);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Rent for Property: ${property.title}`,
            description: `${rentalRequest.durationMonths} months lease starting ${rentalRequest.moveInDate.toDateString()}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: authUser.email,
    payment_method_types: ["card"],
    success_url: `${config.app_url}/payment?success=true`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      tenantId: authUser.id,
      rentalRequestId: rentalRequest.id,
      propertyId: property.id,
    },
  });

  // 3. Create a pending Payment record in your database
  await prisma.payment.create({
    data: {
      transactionId: session.id,
      rentalRequestId: rentalRequest.id,
      amount: property.rentPrice,
      method: PaymentMethod.CARD,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    paymentUrl: session.url,
  };
};

// Placeholder for webhook handling (to update the Payment status to PAID)
const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret as string,
  );

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as any;

      await prisma.payment.update({
        where: { transactionId: session.id },
        data: {
          status: PaymentStatus.SUCCESS,
          paidAt: new Date(),
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
};

const getAllPayments = async () => {
  const result = await prisma.payment.findMany({
    include: {
      rentalRequest: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              rentPrice: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const paymentService = {
  createCheckout,
  handleWebhook,
  getAllPayments,
};
