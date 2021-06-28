const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //1) create a transporter(this is the service that would send the mail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //2) Define the email options
  const mailOptions = {
    from: 'ngolohomes <info@user.io>',
    to: options.email,
    subject: options.subbject,
    text: options.message
    //   html:
  };
  //3) send the mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
