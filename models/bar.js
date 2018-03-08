const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    businessId: {
        type: String,
        required: true
    },
    usersGoing: {
        type: Array
    }
})

module.exports = mongoose.model('Bar', schema)