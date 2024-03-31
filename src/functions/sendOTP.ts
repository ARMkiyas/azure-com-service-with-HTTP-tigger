import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sendOTP } from "../handlers/sendOTP";


app.http('sendOTP', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: sendOTP
});

app.http('sendRestPWD', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: sendOTP
});


