var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Deltacode',
    auth: {
        user: 'info@deltacode.co',
        pass: '123123'
    }
});
function sendEmail(_to, _subject, _text, _html) {
    var mailOptions = {
        from: 'info@deltacode.co', // sender address
        to: _to, // list of receivers
        subject: _subject,
        text: _text,
        html: _html
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return error
        }
        else
            return true;

    });
}










