import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from "zod";
import { phoneValidationSc } from "../utils/validSc";
import { EmailMessage } from "@azure/communication-email";
import generateAppointmentEmail from "../../Templates/appointmentTemplates";
import sendMail from "../services/SendMail";
import sendMessage from "../services/SendMessage";
import { MessageTemplate, MessageTemplateBindings, MessageTemplateQuickAction, MessageTemplateValue } from "@azure-rest/communication-messages";



const validationSc = z.object({
    email: z.string().email(),
    phoneNumber: phoneValidationSc.optional(),
    type: z.enum(["booking", "checking", "cancelled", "completed", "rescheduled"]),
    patientName: z.string(),
    doctorName: z.string(),
    date: z.string(),
    time: z.string(),
    referenceId: z.string().optional(),


});


type AppointmentRequest = z.infer<typeof validationSc>;



export async function appointmetHanlder(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try {

        const data = await request.json() as AppointmentRequest;

        if (!validationSc.safeParse(data).success) {
            return { jsonBody: { message: "Invalid Data" }, status: 400 };
        }


        if (data.email) {
            const message: EmailMessage = {
                senderAddress: "DoNotReply@kiyas-cloud.live",
                content: {
                    subject: data.type === "booking" ? "Appointment Booked" : data.type === "checking" ? "Appointment Checking" : data.type === "cancelled" ? "Appointment Cancelled" : data.type === "completed" ? "Appointment Completed" : "Appointment Rescheduled",
                    html: generateAppointmentEmail({
                        type: data.type,
                        patientName: data.patientName,
                        doctorName: data.doctorName,
                        date: data.date,
                        time: data.time,
                        referenceId: data.referenceId || "",
                    }),
                },
                recipients: {
                    to: [
                        {
                            address: data.email,
                            displayName: data.patientName,
                        },
                    ],
                },
            };


            await sendMail(message);
        }


        if (data.phoneNumber) {

            const recipientList = [data.phoneNumber];

            const headerValue: MessageTemplateValue = {
                kind: "text",
                name: "type",
                text: data.type === "booking" ? "Appointment Booked" : data.type === "checking" ? "Appointment Checking" : data.type === "cancelled" ? "Appointment Cancelled" : data.type === "completed" ? "Appointment Completed" : "Appointment Rescheduled",
            };

            const bodyvalue1: MessageTemplateValue = {
                kind: "text",
                name: "patientName",
                text: data.patientName
            }

            const bodyvalue2: MessageTemplateValue = {
                kind: "text",
                name: "doctorName",
                text: data.doctorName
            }

            const bodyvalue3: MessageTemplateValue = {
                kind: "text",
                name: "Date",
                text: data.date
            }

            const bodyvalue4: MessageTemplateValue = {
                kind: "text",
                name: "Time",
                text: data.time
            }

            const bodyvalue5: MessageTemplateValue = {
                kind: "text",
                name: "referenceId",
                text: data.referenceId || ""
            };
            const bodyvalue6: MessageTemplateValue = {
                kind: "text",
                name: "Message_type",
                text: data.type === "booking" ? "Scheduled" : data.type === "checking" ? "Scheduled" : data.type === "cancelled" ? "Cancelled" : data.type === "completed" ? "Completed" : "Rescheduled",
            };




            const bindings: MessageTemplateBindings = {
                kind: "whatsApp",
                header: [
                    {
                        refValue: headerValue.name
                    }
                ],
                body: [
                    {
                        refValue: bodyvalue1.name
                    },
                    {
                        refValue: bodyvalue2.name
                    },
                    {
                        refValue: bodyvalue3.name
                    },
                    {
                        refValue: bodyvalue4.name
                    },
                    {
                        refValue: bodyvalue5.name
                    },
                    {
                        refValue: bodyvalue6.name
                    }
                ],

            }

            const template: MessageTemplate = {
                name: "appointment",
                language: "en",
                bindings: bindings,
                values: [headerValue, bodyvalue1, bodyvalue2, bodyvalue3, bodyvalue4, bodyvalue5, bodyvalue6]

            };

            const templateMessageResult = await sendMessage({
                kind: "template",
                recipientList,
                template: template
            })

            console.log(templateMessageResult.body);

        }






        return { jsonBody: { message: "Mail Has been Send" }, status: 200 };


    } catch (error) {
        return { jsonBody: { message: "Mail Has not been Send" }, status: 400 };

    }




}

