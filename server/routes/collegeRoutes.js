import express from 'express';
import { getColleges, getCollegeBySlug } from '../controllers/collegeController.js';

const router = express.Router();

router.get('/', getColleges);
router.get('/:slug', getCollegeBySlug);

export default router;
