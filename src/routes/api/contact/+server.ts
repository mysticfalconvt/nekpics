import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import type { RequestHandler } from './$types';

interface SMTPError extends Error {
	code?: string;
	command?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, email, message } = await request.json();

		const transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: Number(env.SMTP_PORT),
			secure: false,
			auth: {
				user: env.SMTP_USER,
				pass: env.SMTP_PASSWORD
			}
		});

		await transporter.verify();

		const mailOptions = {
			from: env.SMTP_FROM || 'contact@rboskind.com',
			to: 'rob@boskind.tech',
			subject: `New Contact Form Submission from ${name}`,
			text: `
Name: ${name}
Email: ${email}
Message: ${message}
            `,
			html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
            `
		};

		await transporter.sendMail(mailOptions);
		return json({ success: true });
	} catch (error) {
		const smtpError = error as SMTPError;
		console.error('Error sending email:', {
			name: smtpError.name,
			message: smtpError.message,
			code: smtpError.code
		});
		return json({ success: false, error: 'Failed to send message' }, { status: 500 });
	}
};
