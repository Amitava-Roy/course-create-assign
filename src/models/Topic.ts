// lib/models/Topic.ts
import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Topic || mongoose.model("Topic", topicSchema);
