const otpEmailTemplates = (otp: string, username: string) => {
  return `<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #777;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>One-Time Password (OTP) for Account Verification</h1>
            <p>Hello ${username},</p>
            <p>Your OTP for account verification is:</p>
            <p class="otp">${otp}</p> <!-- Replace with the actual OTP -->
            <p>This OTP will expire within 1 hour.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>For any assistance, feel free to contact our support team at <a href="mailto:support@cloudcare.kiyas-cloud.live">support@cloudcare.kiyas-cloud.live</a>.</p>
            <p>Thank you!</p>
        </div>
    </body>
    </html>`
}


export default otpEmailTemplates;