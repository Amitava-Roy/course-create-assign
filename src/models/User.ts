import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  assignedGoals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Goal" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
