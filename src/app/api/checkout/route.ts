import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request: Request, response: Response) {
  const { title, price, bookId, userId } = await request.json();
  console.log(title,price)

  try {
//     // チェックアウトセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        bookId: bookId,
      },
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
       success_url: `http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,//この記述だと正常動作
             // success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
             // success_url: `${baseUrl}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            //   cancel_url: `${baseUrl}`,
    });
    return NextResponse.json({
      checkout_url: session.url
    });

  } catch (err: any) {
    // return NextResponse.json({err.message });
    return NextResponse.json({ message: err.message });
  }
}