# webtask-contact-form

[![Build Status](https://travis-ci.org/systemdevs/webtask-contact-form.svg?branch=master)](https://travis-ci.org/systemdevs/webtask-contact-form)

A serverless contact form for your static page using [webtask.io](https://webtask.io/).

Many times you find yourself creating a static HTML page. Everything goes smoothly until you need to implement a contact form. Maybe you've reached this repo after googling how to do this or maybe you've just implemented it using some of the PHP's ones out there because cheap hosting.

Well... this solution implements the server-side part of a contact form in node.js in a way you can deploy it absolutely for free.

## Features

- Deploy it with no effort in [webtask.io](https://webtask.io/)
- Form & params validations.
- Disposable email validation.
- Captcha to prevent massive spam using [reCaptcha](https://www.google.com/recaptcha/intro/index.html).
- Works with any SMTP server (a custom one or services like gmail)
- Fully customizable webtask using secret params.

## Installation & Deploy

In order to deploy your own webtask, the first thing you'll need is a [webtask.io](https://webtask.io/) account.

Because some of the modules we use are not available on webtask, we'll be using the [webtask-bundle](https://github.com/auth0/webtask-bundle) module.

First, install the [wt-cli](https://github.com/auth0/wt-cli) utility for deploying tasks to webtask from your command line.

```sh
$ npm install -g wt-cli webtask-bundle
```

Then, clone this repo:

```sh
$ git clone git@github.com:systemdevs/webtask-contact-form.git
$ cd webtask-contact-form
```

Install needed dependencies:

```sh
$ npm install
```

The following step is to bundle all the code in a single script for webtask:

```sh
$ wt-bundle --output ./build/webtask.js ./app.js
```

The webtask to deploy will be in `./build/webtask.js`.

Now we're almost ready to deploy our webtask! From here, we'll need a SMTP server and a [reCaptcha](https://www.google.com/recaptcha/intro/index.html) account.

- [ ] Follow the steps at [reCaptcha](https://www.google.com/recaptcha/intro/index.html) in order to get your reCaptcha API Key.
- [ ] Get an SMTP server. For this example, we'll be using Gmail.

> To use Gmail you may need to configure ["Allow Less Secure Apps"](https://www.google.com/settings/security/lesssecureapps) in your Gmail account unless you are using 2FA in which case you would have to create an [Application Specific](https://security.google.com/settings/security/apppasswords) password. You also may need to unlock your account with ["Allow access to your Google account"](https://accounts.google.com/DisplayUnlockCaptcha) to use SMTP.

To sum up, make sure you have the following data:

- [ ] SMTP Host and Port.
- [ ] SMTP User and password.
- [ ] reCaptcha URL and secret.

Now we're ready to deploy the task. Make sure you are logged into your webtask account in your console and run:

```sh
wt create -s SMTP_PORT=465 -s SMTP_HOST=smtp.gmail.com -s SMTP_SECURE=true \
-s SMTP_REQUIRE_TLS=true -s SMTP_USER=youruser@gmail.com -s SMTP_PASS=yourpassword \
-s MAIL_TO=info@yourcompany.com -s RECAPTCHA_URL=https://www.google.com/recaptcha/api/siteverify \
-s RECAPTCHA_SECRET=yourRecapchaSecret --name contact-form ./build/webtask.js
```

Make sure to replace the secrets with yours. The secrets are:

- `SMTP_PORT`: is the SMTP port to connect to (usually 25 or 465).
- `SMTP_HOST`: is the SMTP hostname or IP address to connect to (i.e. smtp.gmail.com).
- `SMTP_SECURE`: if `true`the SMTP connection will only use TLS. If `false`, TLS may still be upgraded to if available via the STARTTLS command.
- `SMTP_REQUIRE_TLS`: if this is `true` and `SMTP_SECURE` is false, it forces to use STARTTLS even if the server does not advertise support for it.
- `SMTP_USER`: is the username to use in the SMTP connection.
- `SMTP_PASS`: is the password to use in the SMTP connection.
- `MAIL_TO`: is the email address where you want to receive the submitted contact messages.
- `RECAPTCHA_URL`: is the URL against the captcha challenge will be validated (ussualy <https://www.google.com/recaptcha/api/siteverify>).
- `RECAPTCHA_SECRET`: is the app secret obtained from [reCaptcha](https://www.google.com/recaptcha/intro/index.html).

## Usage
Now that our webtask is deployed, please review the [webtask's docs](https://webtask.io/docs/101) for more
info on how to execute it.

You may also check the `examples` folder for a client-side example form.
