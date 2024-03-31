type AppointmentTemplate = {
    type: "booking" | "checking" | "cancelled" | "completed" | "rescheduled";
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    referenceId: string;
};


const styles = ` <style>
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
.appointment-details {
    font-size: 16px;
    color: #555;
}
.footer {
    text-align: center;
    margin-top: 20px;
    color: #888888;
}
</style>`


const footer = ` <div class="footer">
<p>If you did not request, please ignore this email.</p>
<p>For any assistance, feel free to contact our support team at <a href="mailto:support@cloudcare.kiyas-cloud.live">support@cloudcare.kiyas-cloud.live</a>.</p>
</div>`


const generateAppointmentEmail = ({ type, patientName, doctorName, date, time, referenceId }: AppointmentTemplate): string => {
    switch (type) {
        case "booking":
            return `
            <!DOCTYPE html>
            <html>
            <head>
               ${styles}
            </head>
            <body>
                <div class="container">
                <h1>Appointment Booked Confirmation</h1>
                <p>Hello ${patientName},</p>
                <p>Your appointment with ${doctorName} has been successfully booked.</p>
                <p>Appointment Details:</p>
                <p>Date: ${date}</p>
                <p>Time: ${time}</p>
                <p>Reference ID: ${referenceId}</p>
                <p>If you have any questions or need to reschedule, please contact our hospital.</p>
                <p>Thank you!</p>
                </div>
               ${footer}
            </body>
            </html>
            `;
        case "checking":
            return `
            <!DOCTYPE html>
            <html>
            <head>
               ${styles}
            </head>
            <body>
            <div class="container">
            <h1>Appointment Check-In Reminder</h1>
            <p>Hello ${patientName},</p>
            <p>Your scheduled appointment with  ${doctorName} is approaching.</p>
            <p>Appointment Details:</p>
            <p class="appointment-details">Date: ${date}</p>
            <p class="appointment-details">Time: ${time}</p>
            <p class="appointment-details">Reference ID: ${referenceId}</p>
            <p>Please arrive at least 15 minutes before your appointment time for check-in.</p>
            <p>Thank you!</p>
        </div>
               ${footer}
            </body>
            </html>

`
            break;
        case "cancelled":
            return `

            <!DOCTYPE html>
            <html>
            <head>
               ${styles}
            </head>
            <body>
            <div class="container">
        <h1>Appointment Canceled</h1>
        <p>Hello ${patientName},</p>
        <p>Your appointment with ${doctorName} on ${date} at ${time} has been canceled, Reference ID: ${referenceId}.</p>
        <p>If you have any further questions or need assistance, please feel free to contact our hospital.</p>
        <p>Thank you!</p>
    </div>
               ${footer}
            </body>
            </html>


           `
            break;
        case "completed":
            return `
            <!DOCTYPE html>
            <html>
            <head>
               ${styles}
            </head>
            <body>
            <div class="container">
        <h1>Appointment Completed</h1>
        <p>Hello ${patientName},</p>
        <p>Your appointment with ${doctorName} on ${date} at ${time} has been successfully completed,Reference ID: ${referenceId}.</p>
        <p>Thank you!</p>
    </div>
               ${footer}
            </body>
            </html>
    `



            break;
        case "rescheduled":
            return `


            <!DOCTYPE html>
            <html>
            <head>
               ${styles}
            </head>
            <body>
            <div class="container">
            <h1>Appointment Booked Confirmation</h1>
         <p>Hello [Patient Name],</p>
         <p>Your appointment with ${doctorName} has been successfully booked.</p>
         <p>Appointment Details:</p>
         <p class="appointment-details">Date: ${doctorName}</p>
         <p class="appointment-details">Time: ${time}</p>
         <p class="appointment-details">Reference ID: ${referenceId}</p>
         <p>If you have any questions or need to reschedule, please contact our hospital.</p>
         <p>Thank you!</p>
         </div>
               ${footer}
            </body>
            </html>

             
            `;
        default:
            return "You don't have appointment to send email ";
    }
};


export default generateAppointmentEmail;