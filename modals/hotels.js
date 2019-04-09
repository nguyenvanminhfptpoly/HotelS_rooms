var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name:  {type: String, unique : true, required : true, dropDups: true},
    city: {type: String, default: null},
    address: {type: String, default: null},
    ower: {type: String, default: null},
    license_number: {type: Number, default: null},
    total_floor: {type: Number, default: null},
    image: {type: String, default: null}
});


module.exports = mongoose.model('hotels', categorySchema);