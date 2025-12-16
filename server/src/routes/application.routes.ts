import express from 'express';
import { createApplication, getMyApplications, getApplicationById } from '../controllers/application.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.use(protect);

router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idCopy', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'oldDocument', maxCount: 1 },
  { name: 'policeReport', maxCount: 1 }
]), createApplication);

router.get('/my-applications', getMyApplications);
router.get('/:id', getApplicationById);

export default router;
