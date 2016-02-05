var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)

}, '{PATH} cannot be empty']


var Imports = new Schema({
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    CreatedDate: { type: Date, default: Date.now },
    Count: { type: Number, min: 0 },
    UploadFileName: { type: String, required: 'please enter file name', validate: RequiredEmptyValidator }
});
module.exports = mongoose.model('Imports', Imports);