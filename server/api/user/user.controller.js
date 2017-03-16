'use strict';

import metaget from 'metaget';
import User from './user.model';

export function me(req, res, next) {
  const userId = req.user._id;

  return User.findOne({_id: userId}, '-salt -password').exec()
    .then(user => {
      if (!user) {
        return res.sendStatus(401);
      }

      res.json(user);
    })
    .catch(next);
}

export function friends(req, res, next) {
  const getId = meta => meta['al:ios:url']
    .split('fb://profile/')
    .pop();

  metaget.fetch(
    `https://www.facebook.com/kemalersinyilmaz`, {
    headers: {'User-Agent': 'webscraper'}
  }, (err, meta) =>
    err ? next(err) : res.send(getId(meta))
  );
}
