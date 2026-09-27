const { mongoose } = require("@monorepo/mongo-client");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, enum: ["open", "done"], default: "open" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
