import passport from 'passport';

import express from 'express';

import { PrismaClient } from '@prisma/client';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const prisma = new PrismaClient();
const router = express.Router();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const host = process.env.MODE === 'development' ? 'http://localhost:3000' : process.env.HOST;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${host}/auth/google/callback`,
      passReqToCallback: true,
    },
    (_accessToken, _refreshToken, _other, profile, done) => {
      const { id, displayName, photos } = profile;
      prisma.user
        .upsert({
          where: {
            googleId: id,
          },
          update: {
            userPicture: photos[0].value,
          },
          create: {
            googleId: id,
            name: displayName,
            userPicture: photos[0].value,
          },
        })
        .then((user: object) => done(null, user))
        .catch((err: Error) => {
          console.error('failed finding or creating user', err);
          return done(err, null);
        });
    },
  ),
);

// The "user" is the authenticated user object,
// that is passed from the authUser() function in "Google Strategy".
// This "user" object is attached to "req.session.passport.user.{user}"
passport.serializeUser((user, done) => {
  done(null, user);
});

// The "user" is the authenticated user object,
// that was attached to "req.session.passport.user.{user}" in the passport.serializeUser() function.
passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
  }),
);

export default router;
