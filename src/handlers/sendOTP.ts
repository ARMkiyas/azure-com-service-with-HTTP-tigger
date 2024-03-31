import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import MessageClient, { MessageTemplate, MessageTemplateBindings, MessageTemplateQuickAction, MessageTemplateValue } from "@azure-rest/communication-messages";
import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import { z } from "zod";
import otpEmailTemplates from "../../Templates/otpEmailTemplates";


const validationSc = z.object({
    phoneNumber: z.string()
        .regex(
            /^\+\d{1,2}\s\(\d{3}\)\s\d{3}-\d{4}$|^\+\d{1,2}\s\(\d{3}\)\s\d{9}$/,
            "Invalid Phone Number, please provide it in international format +94 (123) 456-7890",
        )
        .min(1, "phone is Required"),
    email: z.string().email(),
    username: z.string().optional(),
    otp: z.string()
});

type SendOTPRequest = z.infer<typeof validationSc>;

export async function sendOTP(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try {
        const data = await request.json() as SendOTPRequest;


        if (!validationSc.safeParse(data).success) {
            return { jsonBody: { message: "OTP Has Not been sent, invalid Data", data: data }, status: 400 };
        }


        if (!data.email && !data.phoneNumber) {
            return { jsonBody: { message: "OTP Has Not been sent", data: data }, status: 400 };
        }

        if (data.email) {
            const POLLER_WAIT_TIME = 10
            const emailClient = new EmailClient(process.env["connectionString"]);
            const message = {
                senderAddress: "DoNotReply@kiyas-cloud.live",
                content: {
                    subject: "2FA OTP For CloudCare",
                    plainText: "This email message is sent from Azure Communication Services Email using the JavaScript SDK.",
                    html: otpEmailTemplates(data.otp, data.username),
                },
                recipients: {
                    to: [
                        {
                            address: data.email,
                            displayName: data.username,
                        },
                    ],
                },
            };

            const poller = await emailClient.beginSend(message);

            if (!poller.getOperationState().isStarted) {
                throw "Poller was not started."
            }

            let timeElapsed = 0;
            while (!poller.isDone()) {
                poller.poll();
                console.log("Email send polling in progress");

                await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
                timeElapsed += 10;

                if (timeElapsed > 18 * POLLER_WAIT_TIME) {
                    throw "Polling timed out.";
                }
            }

            if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
                console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
            }
            else {
                throw poller.getResult().error;
            }

        }




        if (data.phoneNumber) {
            const wpclient = MessageClient(process.env["connectionString"]);

            const channelRegistrationId = process.env["channelRegistrationId"];

            const recipientList = [data.phoneNumber];

            const bodyValue: MessageTemplateValue = {
                kind: "text",
                name: "otp",
                text: data.otp
            };

            const copybuttonValue: MessageTemplateQuickAction = {
                kind: "quickAction",
                name: "url",
                payload: data.otp,
            }


            const bindings: MessageTemplateBindings = {
                kind: "whatsApp",
                body: [
                    {
                        refValue: bodyValue.name,
                    }
                ],
                buttons: [
                    {
                        subType: "URL",
                        refValue: copybuttonValue.name
                    }
                ]
            }

            const template: MessageTemplate = {
                name: "otp",
                language: "en",
                bindings: bindings,
                values: [bodyValue, copybuttonValue]

            };

            const templateMessageResult = await wpclient
                .path("/messages/notifications:send")
                .post({
                    contentType: "application/json",
                    body: {
                        channelRegistrationId: channelRegistrationId,
                        to: recipientList,
                        kind: "template",
                        template: template,

                    },
                });


            console.log(templateMessageResult);
        }





        return { jsonBody: { message: "OTP sent", data: data }, status: 200 };



    } catch (error) {

        return { jsonBody: { message: "Error While Sending OTP" }, status: 400 };
    }


};
