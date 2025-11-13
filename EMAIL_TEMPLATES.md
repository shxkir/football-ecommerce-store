# EmailJS Templates - Copy & Paste Ready

Use these templates in your EmailJS dashboard when creating email templates.

---

## Template 1: Verification Code Email

### Template Settings:
- **Template Name:** `verification_code`
- **Template ID:** Copy this ID to your `.env.local` as `EMAILJS_VERIFICATION_TEMPLATE_ID`

### Subject Line:
```
Your Verification Code - {{verification_code}}
```

### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .code-box {
            background: white;
            border: 2px dashed #667eea;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
            border-radius: 8px;
        }
        .code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚽ Football Store</h1>
        <p>Email Verification</p>
    </div>

    <div class="content">
        <p>Hello <strong>{{to_name}}</strong>,</p>

        <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>

        <div class="code-box">
            <div class="code">{{verification_code}}</div>
        </div>

        <div class="warning">
            ⚠️ <strong>Important:</strong> This code will expire in <strong>10 minutes</strong>.
        </div>

        <p>If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.</p>

        <p>Best regards,<br>
        <strong>Football Ecommerce Store Team</strong></p>
    </div>

    <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; 2024 Football Ecommerce Store. All rights reserved.</p>
    </div>
</body>
</html>
```

### Plain Text Version (fallback):
```
Hello {{to_name}},

Thank you for signing up!

Your verification code is: {{verification_code}}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Football Ecommerce Store Team

---
This is an automated email. Please do not reply.
```

---

## Template 2: Password Reset Email

### Template Settings:
- **Template Name:** `password_reset`
- **Template ID:** Copy this ID to your `.env.local` as `EMAILJS_RESET_PASSWORD_TEMPLATE_ID`

### Subject Line:
```
Reset Your Password - Football Store
```

### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 5px;
            margin: 25px 0;
            font-weight: bold;
            text-align: center;
        }
        .button:hover {
            opacity: 0.9;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
        }
        .security-notice {
            background: #d1ecf1;
            border-left: 4px solid #0c5460;
            padding: 12px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
        .link-box {
            background: white;
            padding: 15px;
            border-radius: 5px;
            word-break: break-all;
            margin: 15px 0;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔐 Password Reset</h1>
        <p>Football Ecommerce Store</p>
    </div>

    <div class="content">
        <p>Hello <strong>{{to_name}}</strong>,</p>

        <p>We received a request to reset your password. Click the button below to create a new password:</p>

        <div style="text-align: center;">
            <a href="{{reset_url}}" class="button">Reset My Password</a>
        </div>

        <p>Or copy and paste this link into your browser:</p>
        <div class="link-box">
            {{reset_url}}
        </div>

        <div class="warning">
            ⚠️ <strong>Important:</strong> This link will expire in <strong>1 hour</strong>.
        </div>

        <div class="security-notice">
            🛡️ <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged. You may want to change your password if you suspect unauthorized access.
        </div>

        <p>Best regards,<br>
        <strong>Football Ecommerce Store Team</strong></p>
    </div>

    <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; 2024 Football Ecommerce Store. All rights reserved.</p>
    </div>
</body>
</html>
```

### Plain Text Version (fallback):
```
Hello {{to_name}},

We received a request to reset your password.

Reset your password by clicking this link:
{{reset_url}}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Best regards,
Football Ecommerce Store Team

---
This is an automated email. Please do not reply.
```

---

## Template 3 (BONUS): Order Confirmation Email

### Template Settings:
- **Template Name:** `order_confirmation`
- **Template ID:** Save for future use

### Subject Line:
```
Order Confirmed - Order #{{order_id}}
```

### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .order-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 2px solid #11998e;
        }
        .order-id {
            font-size: 24px;
            font-weight: bold;
            color: #11998e;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f1f1f1;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Order Confirmed!</h1>
        <p>Thank you for your purchase</p>
    </div>

    <div class="content">
        <p>Hello <strong>{{customer_name}}</strong>,</p>

        <p>Your order has been confirmed and is being processed!</p>

        <div class="order-box">
            <p>Order Number:</p>
            <div class="order-id">#{{order_id}}</div>
            <p style="margin-top: 15px;"><strong>Total:</strong> ${{order_total}}</p>
        </div>

        <h3>Order Details:</h3>
        <table>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            <tr>
                <td>{{item_name}}</td>
                <td>{{item_quantity}}</td>
                <td>${{item_price}}</td>
            </tr>
        </table>

        <h3>Shipping Address:</h3>
        <p>
            {{shipping_name}}<br>
            {{shipping_address}}<br>
            {{shipping_city}}<br>
            {{shipping_country}}
        </p>

        <p>We'll send you another email when your order ships.</p>

        <p>Best regards,<br>
        <strong>Football Ecommerce Store Team</strong></p>
    </div>

    <div class="footer">
        <p>Questions? Contact us at support@footballstore.com</p>
        <p>&copy; 2024 Football Ecommerce Store. All rights reserved.</p>
    </div>
</body>
</html>
```

---

## How to Use These Templates in EmailJS:

### Step 1: Go to EmailJS Dashboard
1. Log in to https://dashboard.emailjs.com/
2. Click on **"Email Templates"** in the left sidebar

### Step 2: Create Template 1 (Verification Code)
1. Click **"Create New Template"**
2. Copy the **Subject Line** from above
3. Paste the **HTML Body** into the content editor
4. Add the **Plain Text** version in the "Text" tab
5. **Save** and copy the **Template ID**
6. Add to `.env.local`: `EMAILJS_VERIFICATION_TEMPLATE_ID=your_template_id_here`

### Step 3: Create Template 2 (Password Reset)
1. Click **"Create New Template"** again
2. Copy the **Subject Line** from above
3. Paste the **HTML Body** into the content editor
4. Add the **Plain Text** version in the "Text" tab
5. **Save** and copy the **Template ID**
6. Add to `.env.local`: `EMAILJS_RESET_PASSWORD_TEMPLATE_ID=your_template_id_here`

### Step 4: Test Your Templates
1. Use the "Test" button in EmailJS dashboard
2. Fill in sample values:
   - `to_name`: "John Doe"
   - `to_email`: your email
   - `verification_code`: "123456"
   - `reset_url`: "http://localhost:3000/reset-password?token=test123"
3. Send test emails!

---

## Template Variables Reference:

### Verification Code Template:
- `{{to_name}}` - User's name
- `{{to_email}}` - User's email address
- `{{verification_code}}` - 6-digit code

### Password Reset Template:
- `{{to_name}}` - User's name
- `{{to_email}}` - User's email address
- `{{reset_url}}` - Full password reset URL with token

---

## Customization Tips:

1. **Change Colors:** Update the gradient colors in the `<style>` section
2. **Add Logo:** Replace "⚽ Football Store" with `<img src="your-logo-url">`
3. **Modify Text:** Edit any text to match your brand voice
4. **Add Social Links:** Add footer links to your social media

---

🎉 **Ready to copy and paste!** These templates are production-ready and mobile-responsive.
