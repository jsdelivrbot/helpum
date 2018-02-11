var mongoose = require('mongoose')
var Schema = mongoose.Schema

var NumberSchema = new Schema(
    {
        number: {type: String, required: true}
    }
)

module.exports = mongoose.model('Number',NumberSchema,'numeros')