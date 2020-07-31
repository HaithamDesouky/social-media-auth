'use strict';

const { Router } = require('express');
const router = Router();
const Routeguard = require('../middleware/route-guard');

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

module.exports = router;
