'use strict';

const { Router } = require('express');
const privateRouter = Router();
const Routeguard = require('../middleware/route-guard');
const roleRouteGuard = require('../middleware/roleRouteGuard');

privateRouter.get(
  '/assistant-dashboard',
  Routeguard,
  roleRouteGuard(['assistant', 'teacher']),
  (req, res, next) => {
    res.render('assistant');
  }
);

privateRouter.get(
  '/teacher-dashboard',
  Routeguard,
  roleRouteGuard(['teacher']),
  (req, res, next) => {
    res.render('teacher');
  }
);
privateRouter.get(
  '/student-dashboard',
  Routeguard,
  roleRouteGuard(['student', 'teacher', 'assistant']),
  (req, res, next) => {
    res.render('student');
  }
);

module.exports = privateRouter;
