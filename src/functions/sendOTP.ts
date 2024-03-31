import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sendOTP } from "../handlers/sendOTP";
import { SendPwdResetMail } from "../handlers/SendPwdResetMail";
import { appointmetHanlder } from "../handlers/appointmetHanlder";


app.http('sendOTP', {
    methods: ['POST'],
    authLevel: 'function',
    handler: sendOTP
});

app.http('sendRestPWD', {
    methods: ['POST'],
    authLevel: 'function',
    handler: SendPwdResetMail
});


app.http('SendAppointment', {
    methods: ['POST'],
    authLevel: 'function',
    handler: appointmetHanlder
})

