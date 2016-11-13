'use strict';

const should     = require('should');
const sinon      = require('sinon');
const proxyquire = require('proxyquire');
const Q          = require('q');
let contact;

describe('#contact', () => {

    beforeEach(() => {
        contact = require('../lib/contact');
    })

    it('should return true when something is undefined', () => {
        contact.isNotDefined(undefined).should.be.true();
    });

    it('should return true when something is empty', () => {
        contact.isNotDefined('').should.be.true();
    });

    it('should return true when something is null', () => {
        contact.isNotDefined(null).should.be.true();
    });

    it('should return false when something is defined', () => {
        contact.isNotDefined('something').should.be.false();
    });

    it('should return false when something is zero', () => {
        contact.isNotDefined(0).should.be.false();
    });

    it('should return true for a valid email', () => {
        let emailValidatorStub           = sinon.stub().returns(true);
        let disposableEmailValidatorStub = sinon.stub().returns(true);
        contact = proxyquire('../lib/contact', {
            'email-validator': {
                validate: emailValidatorStub
            },
            'temporary-email-address-validator': {
                validate: disposableEmailValidatorStub
            }
        });

        contact.isEmailValid('sales@systemdevs.coop').should.be.true();
        emailValidatorStub.calledWith('sales@systemdevs.coop').should.be.true();
        disposableEmailValidatorStub.calledWith('sales@systemdevs.coop').should.be.true();
    });

    it('should return false for a valid disposable email', () => {
        let emailValidatorStub           = sinon.stub().returns(true);
        let disposableEmailValidatorStub = sinon.stub().returns(false);
        contact = proxyquire('../lib/contact', {
            'email-validator': {
                validate: emailValidatorStub
            },
            'temporary-email-address-validator': {
                validate: disposableEmailValidatorStub
            }
        });

        contact.isEmailValid('sales@systemdevs.coop').should.be.false();
        emailValidatorStub.calledWith('sales@systemdevs.coop').should.be.true();
        disposableEmailValidatorStub.calledWith('sales@systemdevs.coop').should.be.true();
    });

    it('should return false for an invalid email', () => {
        let emailValidatorStub           = sinon.stub().returns(false);
        let disposableEmailValidatorStub = sinon.stub().returns(false);
        contact = proxyquire('../lib/contact', {
            'email-validator': {
                validate: emailValidatorStub
            },
            'temporary-email-address-validator': {
                validate: disposableEmailValidatorStub
            }
        });

        contact.isEmailValid('sales@systemdevs.coop').should.be.false();
        emailValidatorStub.calledWith('sales@systemdevs.coop').should.be.true();
        disposableEmailValidatorStub.called.should.be.false();
    });

    it('should fail when SMTP_PORT secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        undefined,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret SMTP_PORT is missing');
            });
    });

    it('should fail when SMTP_HOST secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        undefined,
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret SMTP_HOST is missing');
            });
    });

    it('should fail when SMTP_SECURE secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      undefined,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret SMTP_SECURE is missing');
            });
    });

    it('should fail when SMTP_REQUIRE_TLS secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: undefined,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret SMTP_REQUIRE_TLS is missing');
            });
    });

    it('should fail when SMTP_USER secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        undefined,
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret SMTP_USER is missing');
            });
    });

    it('should fail when SMTP_PASS secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        undefined,
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret SMTP_PASS is missing');
            });
    });

    it('should fail when MAIL_TO secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          undefined,
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret MAIL_TO is missing');
            });
    });

    it('should fail when RECAPTCHA_URL secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    undefined,
                RECAPTCHA_SECRET: 'secret'
            }
        }
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret RECAPTCHA_URL is missing');
            });
    });

    it('should fail when RECAPTCHA_SECRET secret is missing', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: undefined
            }
        };
        return contact.validateParams(context)
            .catch((err) => {
                err.message.should.equal('Secret RECAPTCHA_SECRET is missing');
            });
    });

    it('should not fail when all secrets are there', () => {
        let context = {
            data: {
                SMTP_PORT:        465,
                SMTP_HOST:        'smtp.gmail.com',
                SMTP_SECURE:      true,
                SMTP_REQUIRE_TLS: true,
                SMTP_USER:        'someone',
                SMTP_PASS:        'secret',
                MAIL_TO:          'someone',
                RECAPTCHA_URL:    'RECAPTCHA_URL',
                RECAPTCHA_SECRET: 'secret'
            }
        };
        return contact.validateParams(context)
            .then(() => {
                should(true).be.true();
            });
    });

    it('should fail when captcha is undefined', () => {
        let context = {
            data: {
            }
        }
        return contact.validateForm(context)
            .catch((err) => {
                err.message.should.equal('Sorry, there was a problem validating that you\'re a human!');
            });
    });

    it('should fail when captcha is invalid', () => {
        let context = {
            data: {
                'g-recaptcha-response': 'somecaptcha',
                'RECAPTCHA_URL':        'RECAPTCHA_URL',
                'RECAPTCHA_SECRET':     'secret'
            }
        };

        let requestStub = sinon.stub().returns({
            success: false
        });
        contact = proxyquire('../lib/contact', {
            'request-promise': requestStub
        });

        return contact.validateForm(context)
            .catch((err) => {
                err.message.should.equal('Sorry, there was a problem validating that you\'re a human!');
            });
    });

    it('should fail when captcha validation request fails', () => {
        let context = {
            data: {
                'g-recaptcha-response': 'somecaptcha',
                'RECAPTCHA_URL':        'RECAPTCHA_URL',
                'RECAPTCHA_SECRET':     'secret'
            }
        };

        let requestStub = sinon.stub().returns(Q.reject(new Error('Sorry, there was a problem validating that you\'re a human!')));
        contact = proxyquire('../lib/contact', {
            'request-promise': requestStub
        });

        return contact.validateForm(context)
            .catch((err) => {
                err.message.should.equal('Sorry, there was a problem validating that you\'re a human!');
            });
    });

    it('should fail when name is not in the form', () => {
        let context = {
            data: {
                'g-recaptcha-response': 'somecaptcha',
                'RECAPTCHA_URL':        'RECAPTCHA_URL',
                'RECAPTCHA_SECRET':     'secret'
            }
        };

        let requestStub = sinon.stub().returns({
            success: true
        });
        contact = proxyquire('../lib/contact', {
            'request-promise': requestStub
        });

        return contact.validateForm(context)
            .catch((err) => {
                err.message.should.equal('Sorry, you need to enter a name.');
            });
    });

    it('should fail when email is not in the form', () => {
        let context = {
            data: {
                'g-recaptcha-response': 'somecaptcha',
                'RECAPTCHA_URL':        'RECAPTCHA_URL',
                'RECAPTCHA_SECRET':     'secret',
                'name':                 'somebody'
            }
        };

        let requestStub = sinon.stub().returns({
            success: true
        });
        contact = proxyquire('../lib/contact', {
            'request-promise': requestStub
        });

        return contact.validateForm(context)
            .catch((err) => {
                err.message.should.equal('Sorry, you need to enter a valid email.');
            });
    });

    it('should fail when email is not valid', () => {

        let emailValidatorStub = sinon.stub().returns(false);

        let context = {
            data: {
                'g-recaptcha-response': 'somecaptcha',
                'RECAPTCHA_URL':        'RECAPTCHA_URL',
                'RECAPTCHA_SECRET':     'secret',
                'name':                 'somebody'
            }
        };

        let requestStub = sinon.stub().returns({
            success: true
        });
        contact = proxyquire('../lib/contact', {
            'email-validator': {
                validate: emailValidatorStub
            },
            'request-promise': requestStub
        });

        return contact.validateForm(context)
            .catch((err) => {
                err.message.should.equal('Sorry, you need to enter a valid email.');
            });
    });

    it('should not fail when everything in the form is fine', () => {

        let context = {
            data: {
                'g-recaptcha-response': 'somecaptcha',
                'RECAPTCHA_URL':        'RECAPTCHA_URL',
                'RECAPTCHA_SECRET':     'secret',
                'name':                 'somebody',
                'email':                'sales@systemdevs.coop'
            }
        };

        let requestStub = sinon.stub().returns({
            success: true
        });
        contact = proxyquire('../lib/contact', {
            'request-promise': requestStub
        });

        return contact.validateForm(context)
            .then(() => {
                requestStub
                    .calledWith({
                        method: 'POST',
                        url:    context.data.RECAPTCHA_URL,
                        qs:     {
                            secret:   context.data.RECAPTCHA_SECRET,
                            response: context.data['g-recaptcha-response']
                        },
                        json: true
                    })
                    .should.be.true();
            });
    });

    it('should create a message concatenating properties', () => {

        let context = {
            data: {
                'name':    'somebody',
                'email':   'sales@systemdevs.coop',
                'company': 'SystemDevs',
                'phone':   '123 456',
                'message': 'hi!'
            }
        };

        let message = contact.createMessage(context);

        message.should.equal(
            'Message received from the website\'s contact form:\n\n' +
            'Name: somebody\nEmail: sales@systemdevs.coop\n' +
            'Company: SystemDevs\nPhone: 123 456\n\nMessage: hi!'
        );
    });

    it('should call sendMail with a message', () => {

        let context = {
            data: {
                'name':    'somebody',
                'email':   'sales@systemdevs.coop',
                'company': 'SystemDevs',
                'phone':   '123 456',
                'message': 'hi!'
            }
        };

        let sendMailSpy = sinon.spy();
        contact = proxyquire('../lib/contact', {
            'nodemailer': {
                'createTransport': sinon.stub().returns({
                    'sendMail': () => {
                        return Q.fcall(sendMailSpy);
                    }
                })
            }
        });

        return contact.sendMail('someMessage', context)
            .then(() => {
                sendMailSpy.called.should.be.true();
            });
    });
});
