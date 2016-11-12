'use strict';

'use latest';

const contact = require('./lib/contact');

function task(context, callback) {
    return contact.validateParams(context)
        .then(() => {
            return contact.validateForm(context);
        })
        .then(() => {
            return contact.sendMail(contact.createMessage(context), context);
        })
        .then((info) => {
            console.info('Message sent: ' + info.response);
            return callback(null, {
                message: 'We\'ve received your message and we\'ll contact you very soon!'
            });
        })
        .catch((err) => {
            console.error(err);
            return callback('There was a problem sending your message. Please try again in a few minutes');
        });
}

module.exports = task;
