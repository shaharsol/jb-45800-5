import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/github', passport.authenticate('github', { session: false }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  authController.callback
);

router.post('/logout', authenticate, authController.logout);

export default router;
