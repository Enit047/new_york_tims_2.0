const keys = require('../keys')
module.exports = function(email) {
    return {
        to: email,
        from: keys.FROM_EMAIL,
        subject: 'Recover password (The New York Time 2.0)',
        html: `
               
        `
    }
}