// app/api/topic/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Topic from "@/models/Topic";

export async function POST(req: NextRequest) {
  await connectMongo();

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  try {
    const topic = await Topic.create({ name });
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating topic", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongo();

  try {
    const topics = await Topic.find();
    return NextResponse.json(topics);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching topics", error },
      { status: 500 }
    );
  }
}
