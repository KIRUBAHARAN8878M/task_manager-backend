import Task from '../models/Task.js';

export const isAdminOrOwner = async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: 'Task not found' });
  if (req.user.role === 'Admin' || task.createdBy.toString() === req.user.id) return next();
  return res.status(403).json({ msg: 'Access denied' });
};