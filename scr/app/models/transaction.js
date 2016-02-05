var mongoose = require('mongoose');

var CashTpe = ['visa', 'credit']
var Schema = mongoose.Schema;



var Transaction = new Schema({
    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    Amount: { Type: Number },
    PaymentMethod: { type: String, enum: CashTpe }
});

module.exports = mongoose.model('Transaction', Transaction);