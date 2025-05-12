// lib/models/Course.ts
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
});

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
