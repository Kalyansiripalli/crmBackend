import express from 'express';
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController.js';
import { protect } from '../middleware/authenticate.js';
import {
  validateCreateOpportunity,
  validateUpdateOpportunity,
} from '../middleware/opportunityMiddleware.js';

const router = express.Router();

router.get('/', protect, getOpportunities);

router.get('/:id', protect, getOpportunityById);

router.post('/', protect, validateCreateOpportunity, createOpportunity);

router.put('/:id', protect, validateUpdateOpportunity, updateOpportunity);

router.delete('/:id', protect, deleteOpportunity);

export default router;
