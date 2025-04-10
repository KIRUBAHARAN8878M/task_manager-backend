import express from 'express';
import Task from '../models/Task.js';
import { isAdminOrOwner } from '../middleware/roles.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
  
      const query =
        req.user.role === 'Admin'
          ? {}
          : { createdBy: req.user.id };
  
      const total = await Task.countDocuments(query);
      const tasks = await Task.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      res.json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        tasks,
      });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });

router.post('/', async (req, res) => {
  try {
    const task = new Task({ ...req.body, createdBy: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', isAdminOrOwner, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', isAdminOrOwner, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
