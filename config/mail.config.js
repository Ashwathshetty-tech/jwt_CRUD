const mailconfig = {
    host: process.env.MAIL_HOST || 'localhost',
    port: process.env.MAIL_PORT || 1025,
    secure: process.env.MAIL_SECURE || false
};
// -SmtpServer 10.198.246.36 -Port 2500
module.exports = mailconfig
;