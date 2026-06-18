import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { appConfig } from '../config';
import { findOrCreateFromGitHub } from '../services/user.service';

passport.use(
  new GitHubStrategy(
    {
      clientID: appConfig.github.clientId,
      clientSecret: appConfig.github.clientSecret,
      callbackURL: appConfig.github.callbackUrl,
      scope: ['user:email'],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const user = await findOrCreateFromGitHub(profile);
        done(null, user as unknown as Express.User);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);
