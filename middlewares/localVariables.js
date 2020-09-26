module.exports = function(req, resp, next) {
    resp.locals.csrf = req.csrfToken()
    resp.locals.isUser = req.session.authUser
    next()
}