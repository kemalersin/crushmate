'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

const router = new Router();

router.get('/me/friends', auth.isAuthenticated(), controller.friends);
router.get('/me', auth.isAuthenticated(), controller.me);

module.exports = router;
