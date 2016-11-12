'use strict';

'use latest';

const nodemailer      = require('nodemailer');
const disposableEmail = require('temporary-email-address-validator');
const emailValidator  = require('email-validator');
const request         = require('request-promise');
const Q               = require('q');

function isNotDefined(something) {
    return typeof something === 'undefined' || something === null || something === '';
}

function isEmailValid(email) {
    return emailValidator.validate(email) && disposableEmail.validate(email);
}

function validateParams(context) {
    return Q.fcall(() => {
        let secrets = ['SMTP_PORT', 'SMTP_HOST', 'SMTP_SECURE', 'SMTP_REQUIRE_TLS', 'SMTP_USER',
            'SMTP_PASS', 'MAIL_TO', 'RECAPTCHA_URL', 'RECAPTCHA_SECRET'];

        secrets.forEach((secret) => {
            if (isNotDefined(context.data[secret])) {
                throw new Error('Secret ' + secret + ' is missing');
            }
        });
    });
}

function validateForm(context) {

    return Q.fcall(() => {
        if (isNotDefined(context.data['g-recaptcha-response'])) {
            console.error('Captcha is invalid');
            throw new Error('Sorry, there was a problem validating that you\'re a human!');
        }
    })
        .then(function() {
            return request({
                method: 'POST',
                url:    context.data.RECAPTCHA_URL,
                qs:     {
                    secret:   context.data.RECAPTCHA_SECRET,
                    response: context.data['g-recaptcha-response']
                },
                json: true
            });
        })
        .catch((err) => {
            console.error(err);
            throw new Error('Sorry, there was a problem validating that you\'re a human!');
        })
        .then((response) => {
            if (!response.success) {
                console.error('Invalid Captcha');
                throw new Error('Sorry, there was a problem validating that you\'re a human!');
            }
        })
        .then(() => {
            if (isNotDefined(context.data.name)) {
                console.error('Name is undefined');
                throw new Error('Sorry, you need to enter a name.');
            }

            if (isNotDefined(context.data.email)) {
                console.error('Email is undefined');
                throw new Error('Sorry, you need to enter a valid email.');
            } else if (!isEmailValid(context.data.email)) {
                console.error('Email is invalid');
                throw new Error('Sorry, you need to enter a valid email.');
            }
        });
}

function createMessage(context) {
    let text = 'Message received from the website\'s contact form:\n\n';

    text = text.concat('Name: ' + context.data.name + '\n');
    text = text.concat('Email: ' + context.data.email + '\n');
    text = text.concat('Company: ' + context.data.company + '\n');
    text = text.concat('Phone: ' + context.data.phone + '\n\n');
    text = text.concat('Message: ' + context.data.message);

    return text;
}

function sendMail(message, context) {
    let transporter = nodemailer.createTransport({
        port:       parseInt(context.data.SMTP_PORT),
        host:       context.data.SMTP_HOST,
        secure:     Boolean(context.data.SMTP_SECURE),
        requireTLS: Boolean(context.data.SMTP_REQUIRE_TLS),
        auth:       {
            user: context.data.SMTP_USER,
            pass: context.data.SMTP_PASS
        }
    });

    let mailOptions = {
        from:    context.data.name + ' &lt;' + context.data.email + '&gt;',
        to:      context.data.MAIL_TO,
        subject: 'Contact message from the web!',
        text:    message
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    isNotDefined:   isNotDefined,
    isEmailValid:   isEmailValid,
    validateParams: validateParams,
    validateForm:   validateForm,
    createMessage:  createMessage,
    sendMail:       sendMail
};
