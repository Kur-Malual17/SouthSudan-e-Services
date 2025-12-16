import express from 'express';
import { 
  getAllApplications, 
  getApplicationById, 
  updateApplicationStatus,
  approveApplication,
  rejectApplication,
  getStatistics
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(authorize('officer', 'supervisor', 'admin'));

router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.patch('/applications/:id/status', updateApplicationStatus);
router.post('/applications/:id/approve', approveApplication);
router.post('/applications/:id/reject', rejectApplication);
router.get('/statistics', getStatistics);

export default router;
