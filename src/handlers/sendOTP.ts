import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import MessageClient, { MessageTemplate, MessageTemplateBindings, MessageTemplateQuickAction, MessageTemplateValue } from "@azure-rest/communication-messages";
import { EmailClient, EmailMessage, KnownEmailSendStatus } from "@azure/communication-email";
import { z } from "zod";
import otpEmailTemplates from "../../Templates/otpEmailTemplates";
import sendMail from "../services/SendMail";
import { phoneValidationSc } from "../utils/validSc";
import sendMessage from "../services/SendMessage";


const validationSc = z.object({
    phoneNumber: phoneValidationSc.optional(),
    email: z.string().email().optional(),
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

            const templateMessageResult = await sendMessage({
                kind: "template",
                recipientList,
                template: template
            })

            console.log(templateMessageResult.status);



        }





        return { jsonBody: { message: "OTP sent", data: data }, status: 200 };



    } catch (error) {

        return { jsonBody: { message: `Error While Sending OTP,  ${error}` }, status: 400 };
    }


};
