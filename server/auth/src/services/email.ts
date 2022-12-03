import mailer from 'nodemailer';

export class Email {
    static sendMail(email: string, subject: string = 'No subject', text: string = 'No text') {
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'asrivatsa6@gmail.com',
                pass: 'htmnpkarciidjfkl'
            }
        });
        const mailOptions = {
            from: 'asrivatsa6@gmail.com',
            to: email,
            subject: subject,
            text: text
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err)
                console.log(err);
            else
                console.log('Email sent: ', info.response);
        })
    }
}