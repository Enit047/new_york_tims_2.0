const {Schema, model, Types} = require('mongoose')

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTimeToken: Date,
    cart: {
        items: [
            {
                cardId: {
                    type: Types.ObjectId,
                    ref: 'movies',
                    required: true
                },
                amount: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ]
    }
})

module.exports = model('users', user)