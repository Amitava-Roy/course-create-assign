// app/api/goal/assign/route.ts
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import GoalModel from "@/models/Goal";
import UserModel from "@/models/User"; // Assuming you have a User model

export async function POST(req: Request) {
  const { goalId, userId } = await req.json();

  if (!goalId || !userId) {
    return NextResponse.json(
      { message: "Missing goalId or userId" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    // Fetch the goal with its courses
    const goal = await GoalModel.findById(goalId);
    if (!goal) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    // Find the user and assign the goal
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.assignedGoals) {
      user.assignedGoals.push(goal._id);
    } else {
      user.assignedGoals = [goal._id];
    }
    await user.save();

    return NextResponse.json({ message: "Goal assigned successfully" });
  } catch (error: unknown) {
    if (error instanceof Error && error && error.message)
      return NextResponse.json(
        { message: "Error assigning goal", error: error.message },
        { status: 500 }
      );
  }
}
