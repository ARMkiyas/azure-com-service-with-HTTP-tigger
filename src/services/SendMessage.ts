import MessageClient, { MessageTemplate, MessageTemplateBindings, MessageTemplateQuickAction, MessageTemplateValue } from "@azure-rest/communication-messages";



type sendMessage = {
    recipientList: string[],
    kind: "template" | "text",
    template?: MessageTemplate
    Content?: string
}


const sendMessage = async ({ recipientList, kind, template, Content }: sendMessage) => {

    try {

        const wpclient = MessageClient(process.env["connectionString"]);

        const channelRegistrationId = process.env["channelRegistrationId"];

        const templateMessageResult = await wpclient
            .path("/messages/notifications:send")
            .post({
                contentType: "application/json",
                body: {
                    channelRegistrationId: channelRegistrationId,
                    to: recipientList,
                    kind: kind,
                    ...kind === "text" && { content: Content },
                    ...kind === "template" && { template: template },

                },
            });



        return templateMessageResult;

    } catch (error) {
        throw new Error(`Error sending email: ${error}`);
    }

}


export default sendMessage;