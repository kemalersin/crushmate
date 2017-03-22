'use strict';

import _ from 'lodash';
import request from 'request-promise';
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
  request({
    uri: `https://graph.facebook.com/${req.user.facebook.id}` +
    `/taggable_friends?fields=id,name,picture.width(160)` +
    `&limit=5000&access_token=${req.user.facebook.accessToken}`,
    json: true
  })
    .then(body => res.json(
      _.sortBy(
        _.transform(body.data, (result, profile) => {
          if (_.includes(
            profile.name.toLowerCase(),
            req.query.q.toLowerCase()
          )) {
            result.push({
              id: profile.id,
              name: profile.name,
              picture: profile.picture.data.url
            });
          }
        }, []), ['name']
      )
    ))
    .catch(next);
}
