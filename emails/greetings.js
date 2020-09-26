const keys = require('../keys')
module.exports = function(email) {
    return {
        to: email,
        from: keys.FROM_EMAIL,
        subject: 'Our greetings to you, thanks for joining us',
        html: `
            <h2>We are really glad for your joining us</h2>
            <p>Now a few words about us: we are The New York Times 2.0 version and our goal fuck our big brother and eliminate</p>
            <p>Your mail - ${email}</p>
            <hr>
            <a href="${keys.BASIC_URL}" >Back to our site</a>
        `
    }
}