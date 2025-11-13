# 🚀 Quick Start - Email Setup

## Your Template ID: `template_bf0zmmn`

Since EmailJS free tier only allows 1 template, you're using the password reset template for now.

---

## Step 1: Create `.env.local` File

Create a file named `.env.local` in your project root and add:

```env
# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_PRIVATE_KEY=your_private_key_here

# Your template ID (using same for both features)
EMAILJS_VERIFICATION_TEMPLATE_ID=template_bf0zmmn
EMAILJS_RESET_PASSWORD_TEMPLATE_ID=template_bf0zmmn

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## Step 2: Get Your EmailJS Credentials

### Get Service ID:
1. Go to https://dashboard.emailjs.com/admin
2. Click **"Email Services"**
3. You should see your connected email service
4. Copy the **Service ID** (e.g., `service_abc123`)
5. Paste it in `.env.local` as `EMAILJS_SERVICE_ID`

### Get Public & Private Keys:
1. Go to https://dashboard.emailjs.com/admin/account
2. Scroll to **"API Keys"** section
3. Copy **Public Key** (starts with `user_...` or similar)
4. Copy **Private Key** (click "Show" to reveal it)
5. Paste both in `.env.local`

---

## Step 3: Generate NextAuth Secret

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env.local`

---

## Step 4: Restart Your Server

After saving `.env.local`, restart the dev server:

```bash
# Press Ctrl+C to stop the current server, then:
npm run dev
```

---

## Step 5: Test Password Reset

### Using API:

**1. Request password reset:**
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**2. Check your email for the reset link**

**3. Reset password:**
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"your_token_from_email","password":"newpassword123"}'
```

---

## 🎯 Your `.env.local` Should Look Like:

```env
# EmailJS Configuration
EMAILJS_SERVICE_ID=service_abc123xyz
EMAILJS_PUBLIC_KEY=user_abc123xyz
EMAILJS_PRIVATE_KEY=abc123xyz789

# Template ID
EMAILJS_VERIFICATION_TEMPLATE_ID=template_bf0zmmn
EMAILJS_RESET_PASSWORD_TEMPLATE_ID=template_bf0zmmn

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NEXTAUTH_URL=http://localhost:3000

# Google Sheets (Optional - if you want production storage)
# GOOGLE_SERVICE_ACCOUNT_EMAIL=
# GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
# GOOGLE_SPREADSHEET_ID=
```

---

## ✅ That's It!

Once you add these credentials:
1. Password reset emails will be sent automatically
2. Verification codes will be stored (but won't send emails for now with free tier)
3. Everything is stored in `.data/` folder locally

---

## 📧 Need More Templates?

**EmailJS Pricing:**
- Free: 200 emails/month, 1 template
- Personal: $7/month, unlimited templates, 1000 emails/month

Upgrade if you need the verification code email feature!

---

## 🐛 Troubleshooting

**"Email service not configured" error?**
- Make sure `.env.local` exists in project root
- Restart the dev server after creating `.env.local`
- Check all credentials are correct

**Emails not sending?**
- Check EmailJS dashboard for error logs
- Verify your email service is connected
- Make sure Service ID and keys are correct

---

**Ready to test!** 🚀
