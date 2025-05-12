import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectMongo();

  const { email, password, role = "user" } = await req.json();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  // Create and save new user
  const newUser = new User({ email, password, role });
  await newUser.save();

  return NextResponse.json(
    { message: "Registration successful" },
    { status: 201 }
  );
}
