# Email Configuration Guide

## Problem
Microsoft Outlook/Office 365 has disabled basic authentication (username/password) for security reasons. This is why you're getting the "535 5.7.139 Authentication unsuccessful, basic authentication is disabled" error.

## Solutions

### Option 1: Use Gmail with App Password (Recommended - Easiest)

1. **Switch to Gmail**: Gmail still supports app passwords for SMTP
2. **Enable 2-Factor Authentication** on your Gmail account
3. **Generate an App Password**:
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password instead of your regular password

4. **Update your .env file**:
   ```
   EMAIL_SERVICE=gmail
   USER_EMAIL=your-gmail@gmail.com
   USER_PASSWORD=your-16-character-app-password
   ```

### Option 2: Use Gmail with OAuth2 (More Secure)

This requires more setup but is more secure:

1. Create a Google Cloud Console project
2. Enable Gmail API
3. Configure OAuth2 credentials
4. Get refresh token

### Option 3: Use a Transactional Email Service

Consider using services like:
- **SendGrid** (recommended for production)
- **Mailgun**
- **Amazon SES**
- **Postmark**

These are more reliable for sending transactional emails.

### Option 4: Continue with Outlook (Complex)

To use Outlook/Office 365, you would need to:
1. Set up OAuth2 authentication with Microsoft Graph API
2. Register an application in Azure Active Directory
3. Configure proper permissions and certificates

## Quick Test with Gmail

1. Copy `.env.example` to `.env`
2. Update with your Gmail credentials:
   ```
   EMAIL_SERVICE=gmail
   USER_EMAIL=your-gmail@gmail.com
   USER_PASSWORD=your-app-password
   ```
3. Test the email functionality

## Production Recommendation

For production applications, use a dedicated transactional email service like SendGrid:

```
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
USER_EMAIL=apikey
USER_PASSWORD=your-sendgrid-api-key
```
