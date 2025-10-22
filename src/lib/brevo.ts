import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();

// Initialize with API key
if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

export async function sendWelcomeEmail(email: string, displayName?: string) {
  const name = displayName || 'there';

  const sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Welcome to Elixiary AI! 🍸";
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.sender = { email: 'hello@elixiary.com', name: 'Elixiary AI' };
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; font-size: 28px; margin: 0;">Welcome to Elixiary AI!</h1>
        <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Your AI-powered cocktail companion</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px;">Hi ${name},</p>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to Elixiary AI! 🎉 We're excited to have you join our community of cocktail enthusiasts.</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">What you can do:</h2>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">🍸</span>
            Generate 10 unique cocktail recipes per month
          </li>
          <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">💾</span>
            Save up to 20 favorite recipes
          </li>
          <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">🔍</span>
            Search and filter recipes
          </li>
          <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">📱</span>
            Share recipes with friends
          </li>
          <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">🎲</span>
            Random cocktail inspiration
          </li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com'}" 
           style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
          Start Creating Cocktails
        </a>
      </div>
      
      <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">💡 Want More?</h3>
        <p style="margin: 0; font-size: 14px; color: #1e40af;">
          Upgrade to Pro for unlimited recipe generation, PDF exports, advanced customization, shopping lists, and gamified badges for just $2.49/month or $1.99/month billed annually!
        </p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Need Help?</h2>
        <p style="margin: 0; font-size: 14px; color: #666;">
          If you have any questions, just reply to this email or contact us at 
          <a href="mailto:hello@elixiary.com" style="color: #8b5cf6;">hello@elixiary.com</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="margin: 0; font-size: 16px; color: #333;">Cheers! 🍸</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">The Elixiary AI Team</p>
      </div>
      
      <hr style="margin: 30px 0 15px 0; border: none; border-top: 1px solid #e5e7eb;">
      <div style="text-align: center;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          You're receiving this because you signed up for Elixiary AI.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com'}/privacy" style="color: #8b5cf6;">Privacy Policy</a>
        </p>
      </div>
    </div>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    // Welcome email sent successfully
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

