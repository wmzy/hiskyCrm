/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var users = require('users');
var articles = require('articles');
var comments = require('comments');
var tags = require('tags');
var auth = require('./middlewares/authorization');
var home = require('home');
var organization = require('organization');
var group = require('group');
var schema = require('schema');

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', auth.requiresLogin, users.create);
    app.put('/users/:userId', auth.requiresLogin, users.update);
    app.delete('/users/:userId', auth.requiresLogin, users.delete);
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);
    app.get('/users/manage', auth.requiresLogin, users.manage);
    app.get('/users/search/:query', auth.requiresLogin, users.search);
    app.get('/users/:userId', users.show);

    app.param('userId', users.load);

    // group routes
    app.get('/group', group.index);
    app.get('/group/new', group.new);
    app.get('/group/edit/:groupId', group.edit);
    app.put('/group/:groupId', group.update);
    app.post('/group', group.create);
    app.delete('/group/:groupId', group.delete);

    // group routes
    app.get('/schema', schema.index);
    app.get('/schema/new', schema.new);
    app.get('/schema/edit/:schemaId', schema.edit);
    app.put('/schema/:schemaId', schema.update);
    app.post('/schema', schema.create);
    app.delete('/schema/:schemaId', schema.delete);

    // article routes
    app.param('id', articles.load);
    app.get('/articles', articles.index);
    app.get('/articles/new', auth.requiresLogin, articles.new);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id', articles.show);
    app.get('/articles/:id/edit', articleAuth, articles.edit);
    app.put('/articles/:id', articleAuth, articles.update);
    app.delete('/articles/:id', articleAuth, articles.destroy);

    // home route
    app.get('/', auth.requiresLogin, home.index);

    // organization routes
    app.get('/organization', auth.requiresLogin, organization.index);
    app.post('/organization', auth.requiresLogin, organization.create);
    app.put('/organization/:orgId', auth.requiresLogin, organization.update);
    app.delete('/organization/:orgId', auth.requiresLogin, organization.delete);

    // comment routes
    app.param('commentId', comments.load);
    app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

    // tag routes
    app.get('/tags/:tag', tags.index);


    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', {error: err.stack});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    app.use(function (isJson, err, req, res, next) {
        console.log('123');
        res.json(422, err);
        return;
        // next();
    });
};
