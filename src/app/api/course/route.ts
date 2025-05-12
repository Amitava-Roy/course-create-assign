// app/api/course/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {
  await connectMongo();

  const { name, topicIds } = await req.json();

  if (!name || !Array.isArray(topicIds)) {
    return NextResponse.json(
      { message: "Name and topicIds are required" },
      { status: 400 }
    );
  }

  try {
    const course = await Course.create({ name, topics: topicIds });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating course", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongo();

  try {
    const courses = await Course.find().populate("topics");
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching courses", error },
      { status: 500 }
    );
  }
}
