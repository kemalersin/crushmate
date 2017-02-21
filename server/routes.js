'use strict';

import errors from './components/errors';
import path from 'path';

export default function (app) {
    app.use('/api/users', require('./api/user'));
    app.use('/auth', require('./auth').default);

    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    app.route('/*')
        .get((req, res) => {
            res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
        });
}
