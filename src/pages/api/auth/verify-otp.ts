import type { NextApiRequest, NextApiResponse } from "next";

// In-memory store for demo (use Redis/DB in production)
const otpStore: Record<string, string> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP required" });
  }

  // In production: verify against stored OTP in Redis/DB
  // For demo, accept any 4-digit OTP
  const isValid = otp.length === 4;

  if (!isValid) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  return res.status(200).json({
    success: true,
    message: "Phone verified",
    token: "demo-jwt-token",
  });
}
