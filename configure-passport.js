'use strict';

const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcryptjs');

const LocalStrategy = passportLocal.Strategy;
const SlackStrategy = require('passport-slack').Strategy;

const User = require('./models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '337160697603-ln15obv741t58gasrnvmlohcqoi0htc1.apps.googleusercontent.com',
      clientSecret: 'q_-Y8S6PEsNiZCBNMB0IJsMJ',
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log('Google account details:', profile);

      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          bcrypt
            .hash(profile.id, 10)
            .then(hashAndSalt => {
              return User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                passwordHash: hashAndSalt
              });
            })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);
// 3 - Create a serialization and deserialization mechanism for passport

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

// 4 - We need to create strategies for sign in and sign up, based on the the strategy we want to use.

// In the docs, the paramater we're calling callback is also named as `cb`, `done`, `func`, `next`

passport.use(
  new SlackStrategy(
    {
      clientID: '2432150752.1259899208327',
      clientSecret: '002d6ea8cf0d20d9189e1e3eb62cf78f',
      callbackURL: '/auth/slack/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      // console.log('Slack account details:', profile);
      console.log(
        profile.user.id,
        profile.user.name,
        profile.user.email,
        profile.user.id
      );

      User.findOne({ slackID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          bcrypt
            .hash(profile.user.id, 10)
            .then(hashAndSalt => {
              return User.create({
                slackID: profile.id,
                name: profile.user.name,
                email: profile.user.email,
                passwordHash: hashAndSalt
              });
            })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);

passport.use(
  'sign-up',
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    (req, email, password, callback) => {
      const name = req.body.name;
      const role = req.body.role;

      bcrypt
        .hash(password, 10)
        .then(hashAndSalt => {
          return User.create({
            name,
            email,
            role,
            passwordHash: hashAndSalt
          });
        })
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);

passport.use(
  'sign-in',
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
    let user;
    User.findOne({
      email
    })
      .then(document => {
        user = document;
        return bcrypt.compare(password, user.passwordHash);
      })
      .then(result => {
        if (result) {
          callback(null, user);
        } else {
          return Promise.reject(new Error('Passwords do not match.'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);
