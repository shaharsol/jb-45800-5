import { Router } from 'express';
import * as repoController from '../controllers/repo.controller';
import { authenticateService } from '../middleware/authenticateService';

const router = Router();

router.get(
  '/:repoOwner/:repoName/user-id',
  authenticateService,
  repoController.getUserIdByRepo
);

export default router;
