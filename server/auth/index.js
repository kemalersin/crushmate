'use strict';

import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';

require('./facebook/passport').setup(User, config);

const router = express.Router();

router.use('/facebook', require('./facebook').default);

export default router;
