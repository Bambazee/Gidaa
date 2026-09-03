import type { NextApiRequest, NextApiResponse } from "next";
import { properties } from "@/lib/data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Return all properties (in production, fetch from Supabase)
    return res.status(200).json({ properties });
  }

  if (req.method === "POST") {
    // In production: insert into Supabase
    const body = req.body;
    console.log("New property listing:", body);
    return res.status(201).json({ success: true, message: "Property created" });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
