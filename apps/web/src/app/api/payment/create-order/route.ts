import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const amountPaise = Math.round(Number(amount));

    if (!amountPaise || amountPaise < 100) {
      return NextResponse.json(
        { success: false, message: "Amount is required and must be at least 100 paise (₹1)" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
