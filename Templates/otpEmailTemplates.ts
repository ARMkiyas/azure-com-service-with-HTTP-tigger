const otpEmailTemplates = (otp: string, username: string) => {
    return `<html lang="en">
    <body>
      <p>
        Dear ${username},<br /><br />Greetings from Cloud Care! We hope
        you're doing well.<br /><br />To enhance the security of your Cloud Care
        account, we have implemented a two-factor authentication (2FA) process. As
        a part of this security measure, you are required to enter a one-time
        password (OTP) to complete the authentication process.<br /><br /><b
          ><strong>Here is your OTP:</strong></b
        >
       <b><strong>${otp}</strong></b>(Note: This code is valid for a single
        use and will expire in <b><strong>one hour</strong></b
        >.)<br /><br />Please use this OTP to verify your identity and finalize
        the authentication process. If you did not initiate this request or if you
        have any concerns, please contact our support team immediately at
        <a href="mailto:support@cloudcare.kiyas-cloud.live"
          >support@cloudcare.kiyas-cloud.live</a
        >
        &nbsp;<br />We appreciate your commitment to maintaining the security and
        privacy of your Cloud Care account.<br /><br />Thank you<br /><br />Best
        regards,<br />Cloud Care Support Team<br /><a
          href="mailto:support@cloudcare.kiyas-cloud.live"
          >support@cloudcare.kiyas-cloud.live</a
        ><br /><br /><br /><br /><br /><br />&nbsp;
      </p>
    </body>
    </html>`
}


export default otpEmailTemplates;