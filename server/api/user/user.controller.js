'use strict';

import User from './user.model';

export function me(req, res, next) {
    const userId = req.user._id;

    return User.findOne({_id: userId}, '-salt -password').exec()
        .then(user => {
            if (!user) {
                return res.status(401).end();
            }
            res.json(user);
        })
        .catch(err => next(err));
}