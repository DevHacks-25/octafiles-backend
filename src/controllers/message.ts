import Message from "../models/Message";

type File = {
    url: string;
    fileType: string;
};

const createMessageForBooking = async ({
    senderId,
    senderType,
    subject,
    body,
    files,
    chatId,
}: {
    senderId: string;
    senderType: string;
    subject: string;
    body: string;
    files: File[];
    chatId: string;
}) => {
    const messages: any[] = [];

    const data = {
        sender: senderId,
        senderType,
        chat: chatId,
    };

    const message = await Message.create({
        ...data,
        subject,
        body,
        contentType: "text",
    });

    messages.push(message);

    for (const file of files) {
        const message = await Message.create({
            ...data,
            file: file.url,
            contentType: file.fileType,
        });
        messages.push(message);
    }

    const latestMessage = messages[messages.length - 1];
    return {
        latestMessage,
    };
};

export { createMessageForBooking };
