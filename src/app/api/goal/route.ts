// app/api/goal/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Goal from "@/models/Goal";

export async function POST(req: NextRequest) {
  await connectMongo();

  const { name, courseIds } = await req.json();

  if (!name || !Array.isArray(courseIds)) {
    return NextResponse.json(
      { message: "Name and courseIds are required" },
      { status: 400 }
    );
  }

  try {
    const goal = await Goal.create({ name, courses: courseIds });
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating goal", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongo();

  try {
    const goals = await Goal.find();
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching goals", error },
      { status: 500 }
    );
  }
}
