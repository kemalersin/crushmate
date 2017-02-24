'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';

const router = express.Router();

router
    .get('/', passport.authenticate('facebook', {
        scope: ['email', 'public_profile', 'user_friends'],
        failureRedirect: '/',
        session: false
    }))
    .get('/callback', passport.authenticate('facebook', {
        failureRedirect: '/',
        session: false
    }), setTokenCookie);

export default router;
