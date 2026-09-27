const { Router } = require("express");
const { ApiResponse, ApiError } = require("@monorepo/api-response");
const Task = require("../models/task.model");

const router = Router();

router.post("/tasks", async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) throw ApiError.badRequest("title is required");

    const task = await Task.create({ title });
    res.status(201).json(ApiResponse(201, task, "Task created"));
  } catch (err) {
    next(err);
  }
});

router.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find().sort("-createdAt").limit(50);
    res.json(ApiResponse(200, tasks));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
