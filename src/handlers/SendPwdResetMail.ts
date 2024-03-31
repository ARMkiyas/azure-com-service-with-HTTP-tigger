import { EmailMessage } from "@azure/communication-email";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from "zod";
import pwdResetEmailTemplates from "../../Templates/pwdResetEmailTemplates";
import sendMail from "../services/SendMail";


const validationSc = z.object({
    email: z.string().email(),
    url: z.string().url(),
    username: z.string(),

});


type SendPwdResetMailRequest = z.infer<typeof validationSc>;

export async function SendPwdResetMail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {



    try {

        const requestPayload = await request.json() as SendPwdResetMailRequest;

        if (!validationSc.safeParse(requestPayload).success) {
            return { jsonBody: { message: "Invalid Data", data: requestPayload }, status: 400 };
        }

        const message: EmailMessage = {
            senderAddress: "DoNotReply@kiyas-cloud.live",
            content: {
                subject: "CloudCare Password Reset Request",
                html: pwdResetEmailTemplates(requestPayload.username, requestPayload.url),

            },
            recipients: {
                to: [
                    {
                        address: requestPayload.email,
                        displayName: requestPayload.username,
                    },
                ],
            },
        };

        await sendMail(message);

        return { jsonBody: { message: "Your Reset Mail Has Been Send" }, status: 200 };




    } catch (error) {
        console.log(error);
        return { jsonBody: { message: "Your Reset Mail Has not sent" }, status: 400 };
    }




}