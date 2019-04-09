var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    room_number:  {type: String, unique : true, required : true, dropDups: true},
    floor: {type: Number, default: null},
    hotelid: {type: Schema.Types.ObjectId, ref : "hotels" },
    single_rooms: {type: String, default: null},
    price: {type: Number, default: null},
    status: {type: Number, default: null},
    detail: {type: String, default: null},
    image: {type: String, default: null}
});


module.exports = mongoose.model('rooms', categorySchema);