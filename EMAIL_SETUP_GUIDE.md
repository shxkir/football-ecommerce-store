# Email Notification Setup Guide

This guide will help you set up EmailJS for email notifications including forgot password and 6-digit verification codes.

## Features Implemented

✅ **6-Digit Verification Code** - Send verification codes via email
✅ **Forgot Password** - Send password reset links via email
✅ **Google Sheets Storage** - Store verification codes and reset tokens (with local fallback)
✅ **Free Service** - EmailJS offers 200 emails/month for free

---

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **Sign Up** and create a free account
3. Verify your email address

---

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for personal projects)
   - **Outlook**
   - **Yahoo**
   - Or any other SMTP provider
4. Follow the prompts to connect your email account
5. **Copy the Service ID** - you'll need this later

---

## Step 3: Create Email Templates

### Template 1: Verification Code Email

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use this template:

**Template Name:** `verification_code`

**Subject:** `Your Verification Code`

**Content:**
```
Hello {{to_name}},

Your verification code is: {{verification_code}}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Football Ecommerce Store Team
```

4. **Copy the Template ID**

---

### Template 2: Password Reset Email

1. Click **Create New Template** again
2. Use this template:

**Template Name:** `password_reset`

**Subject:** `Reset Your Password`

**Content:**
```
Hello {{to_name}},

You requested to reset your password. Click the link below to reset it:

{{reset_url}}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
Football Ecommerce Store Team
```

3. **Copy the Template ID**

---

## Step 4: Get Your API Keys

1. Go to **Account** → **API Keys**
2. You'll see:
   - **Public Key** (starts with something like `user_...`)
   - **Private Key** (click "Show" to reveal)
3. Copy both keys

---

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root with the following:

```env
# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_PRIVATE_KEY=your_private_key_here
EMAILJS_VERIFICATION_TEMPLATE_ID=your_verification_template_id_here
EMAILJS_RESET_PASSWORD_TEMPLATE_ID=your_reset_password_template_id_here

# App URL (for password reset links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Sheets Configuration (Optional - for production)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here

# Firebase Admin (Optional - if you want to use Firestore instead of local storage)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## Step 6: Set Up Google Sheets (Optional but Recommended)

If you want to store verification codes and reset tokens in Google Sheets:

1. **Create a Google Sheet** with three sheets:
   - `Orders` (you should already have this)
   - `VerificationCodes`
   - `PasswordResets`

2. **Set up headers** for each sheet:

   **VerificationCodes Sheet:**
   - Column A: ID
   - Column B: Email
   - Column C: Code
   - Column D: ExpiresAt
   - Column E: CreatedAt
   - Column F: Verified

   **PasswordResets Sheet:**
   - Column A: ID
   - Column B: Email
   - Column C: Token
   - Column D: ExpiresAt
   - Column E: CreatedAt
   - Column F: Used

3. **Share the sheet** with your Google Service Account email
   - Click "Share" → Add the service account email → Give "Editor" access

---

## API Endpoints Available

### 1. Send Verification Code
```
POST /api/auth/send-verification
Body: { "email": "user@example.com" }
```

### 2. Verify Code
```
POST /api/auth/verify-code
Body: { "email": "user@example.com", "code": "123456" }
```

### 3. Forgot Password
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

### 4. Reset Password
```
POST /api/auth/reset-password
Body: { "token": "reset_token_here", "password": "newpassword123" }
```

---

## Testing in Development

In development mode, the API will return the verification code and reset token in the response for testing:

```json
{
  "message": "Verification code sent",
  "code": "123456"  // Only in development
}
```

---

## Storage Options

The system automatically uses:
- **Google Sheets** if configured (recommended for production)
- **Local JSON files** in `.data/` directory as fallback (good for development)

---

## Security Notes

1. ✅ Verification codes expire after 10 minutes
2. ✅ Reset tokens expire after 1 hour
3. ✅ Tokens can only be used once
4. ✅ Emails are validated before sending
5. ✅ No information leakage (same response for existing/non-existing users)

---

## Troubleshooting

### Emails not sending?
- Check your EmailJS dashboard for error logs
- Verify your email service is connected
- Check your API keys are correct
- Make sure your email provider allows SMTP/API access

### "Email service not configured" error?
- Verify all environment variables are set in `.env.local`
- Restart your Next.js server after adding env variables

### Can't find verification codes?
- Check `.data/verification-codes.json` for local storage
- Check Google Sheets if configured
- Codes expire after 10 minutes

---

## Cost

- **EmailJS Free Tier:** 200 emails/month
- **Google Sheets:** Free
- **Total Cost:** $0/month for small projects

---

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- Google Sheets API: https://developers.google.com/sheets/api

---

**You're all set!** 🎉

Start your server and test the endpoints using your favorite API client (Postman, Thunder Client, etc.)
