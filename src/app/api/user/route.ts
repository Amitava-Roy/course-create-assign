// app/api/user/route.ts
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  await connectMongo();

  try {
    const users = await User.find().select("_id email role");
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error },
      { status: 500 }
    );
  }
}
