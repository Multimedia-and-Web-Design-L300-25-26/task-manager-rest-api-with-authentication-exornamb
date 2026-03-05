import mongoose from "mongoose";
import Task from "../models/Task.js";

// POST /api/tasks
export const createTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        if (!title) {
        return res.status(400).json({ message: "title is required" });
        }

        const task = await Task.create({
        title,
        description,
        completed: completed ?? false,
        owner: req.user._id,
        });

        return res.status(201).json(task);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

// GET /api/tasks
export const getTasks = async (req, res) => {
    try {
        
        const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid task id" });
        }

        const task = await Task.findById(id);
        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        // Ownership check
        if (task.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden: not task owner" });
        }

        await task.deleteOne();
        return res.status(200).json({ message: "Task deleted" });
    } catch (err) {
        console.error("Error at delete task endpoint:", err);
        return res.status(500).json({ message: "Server error" });
    }
};