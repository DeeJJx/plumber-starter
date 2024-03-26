import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.TWENNY_EMAIL, //add email and password to .env file and pull through as const - email and pw will be hidden - do same on main twenny site too
        pass: process.env.TWENNY_PASS
      }
    });

    try {
 
      await transporter.sendMail({
        from: 'twennyCommunication@gmail.com',
        to: 'daniel.turnbull94@gmail.com', //need to change to template customers email
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      });

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}