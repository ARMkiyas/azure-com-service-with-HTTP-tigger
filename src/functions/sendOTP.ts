import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sendOTP } from "../handlers/sendOTP";
import { SendPwdResetMail } from "../handlers/SendPwdResetMail";


app.http('sendOTP', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: sendOTP
});

app.http('sendRestPWD', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: SendPwdResetMail
});


