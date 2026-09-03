import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { phone } = req.body;

  if (!phone || !phone.startsWith("+234")) {
    return res.status(400).json({ error: "Invalid phone number. Use +234 format." });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // In production: send via Termii or Africa's Talking
  console.log(`OTP for ${phone}: ${otp}`);

  // For demo, return OTP in development (remove in production!)
  const isDev = process.env.NODE_ENV === "development";

  return res.status(200).json({
    success: true,
    message: "OTP sent",
    ...(isDev && { otp }),
  });
}
