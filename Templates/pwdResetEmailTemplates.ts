

const pwdResetEmailTemplates = (username: string, url: string) => {
    return `
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        /* Add your custom styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 100px;
        }
        .message {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #888888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="message">
            <p>Hello ${username},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href=${url} class="button">Reset Password</a>
            <p>This link will expire within 24 hours for security reasons.</p>
        </div>
        <div class="footer">
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Contact support at <a href="mailto:support@cloudcare.kiyas-cloud.live">support@cloudcare.kiyas-cloud.live</a> for assistance.</p>
        </div>
    </div>
</body>
</html>
    
    
    `
}


export default pwdResetEmailTemplates; 