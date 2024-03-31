import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import MessageClient, { MessageTemplate, MessageTemplateBindings, MessageTemplateQuickAction, MessageTemplateValue } from "@azure-rest/communication-messages";
import { EmailClient, EmailMessage, KnownEmailSendStatus } from "@azure/communication-email";
import { z } from "zod";
import otpEmailTemplates from "../../Templates/otpEmailTemplates";
import sendMail from "../services/SendMail";


const validationSc = z.object({
    phoneNumber: z.string()
        .regex(
            /^\+\d{1,2}\s\(\d{3}\)\s\d{3}-\d{4}$|^\+\d{1,2}\s\(\d{3}\)\s\d{9}$/,
            "Invalid Phone Number, please provide it in international format +94 (123) 456-7890",
        )
        .min(1, "phone is Required").optional(),
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

            const message: EmailMessage = {
                senderAddress: "DoNotReply@kiyas-cloud.live",
                content: {
                    subject: "2FA OTP For CloudCare",

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


            await sendMail(message);


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

        return { jsonBody: { message: `Error While Sending OTP,  ${error}` }, status: 400 };
    }


};
