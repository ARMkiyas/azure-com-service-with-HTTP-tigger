# Azure Function for Sending Email and WhatsApp Messages with Azure Communication Services

This Azure Function serves as a powerful tool for sending emails and WhatsApp messages, integrating seamlessly with Azure Communication Services. It provides functionality for sending OTPs (One-Time Passwords), password reset notifications, and appointment reminders via HTTP trigger.

## Features

- **Email Notifications**: Send email notifications for various purposes such as OTP delivery, password reset links, and appointment reminders.
- **WhatsApp Messages**: Deliver important messages directly to users' WhatsApp accounts for instant communication.
- **Integration with Azure Communication Services**: Utilize the power of Azure Communication Services for reliable messaging.

## Setup

1. **Azure Account**: Ensure you have an active Azure account.
2. **Azure Communication Services Resource**: Set up an Azure Communication Services resource in your Azure portal.
3. **Function App**: Create an Azure Function App in your Azure portal.
4. **Deployment**: Deploy this code to your Azure Function App.
5. **Configuration**: Set up necessary configurations like connection strings and credentials in your Azure Function App settings.

## Usage

### Sending OTP (One-Time Password)

```http
POST /api/sendOTP HTTP/1.1
Host: your-function-app.azurewebsites.net
Content-Type: application/json

{
    "phoneNumber": "+1234567890",
    "email": "user@example.com",
    "username": "user123",
    "otp": "123456"
}
```

### Sending Password Reset Link

```http
POST /api/sendResetPWD HTTP/1.1
Host: your-function-app.azurewebsites.net
Content-Type: application/json

{
    "email": "user@example.com",
    "url": "https://example.com/reset-password",
    "username": "user123"
}
```

### Sending Appointment Notification

```http
POST /api/sendAppointment HTTP/1.1
Host: your-function-app.azurewebsites.net
Content-Type: application/json

{
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "type": "booking",
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "date": "2024-04-21",
    "time": "10:00 AM",
    "referenceId": "ABC123"
}
```

Make sure to replace `"your-function-app.azurewebsites.net"` with the actual endpoint of your deployed Azure Function. Adjust the JSON payloads accordingly based on your TypeScript and Node.js implementation.

## Contributing

Contributions are welcome! If you have ideas for improving this Azure Function or encounter any issues, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
