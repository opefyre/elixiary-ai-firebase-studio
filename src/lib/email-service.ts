import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Elixiary AI <hello@elixiary.com>',
      to: [to],
      subject,
      html,
      replyTo: replyTo || 'hello@elixiary.com',
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
