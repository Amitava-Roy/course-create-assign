// lib/models/Goal.ts
import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

export default mongoose.models.Goal || mongoose.model("Goal", goalSchema);
