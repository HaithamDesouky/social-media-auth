'use strict';

const { Router } = require('express');
const router = Router();
const Routeguard = require('../middleware/route-guard');
const passport = require('passport');

const roleRouteGuard = roles => {
  return (req, res, next) => {
    const role = req.user.role;
    if (roles.includes(role)) {
      next();
    } else {
      next(new Error('User is not authorized'));
    }
  };
};

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

router.get('/private', Routeguard, (req, res, next) => {
  res.render('authentication/private');
});

router.get('/auth/slack', passport.authenticate('slack'));
router.get(
  '/auth/slack/callback',
  passport.authenticate('slack', {
    successRedirect: '/private',
    failureRedirect: '/' // here you would navigate to the classic login page
  })
);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/private',
    failureRedirect: '/' // here you would redirect to the login page using traditional login approach
  })
);
module.exports = router;
