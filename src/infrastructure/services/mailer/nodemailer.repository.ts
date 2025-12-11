export type Attachments = {
   path: string;
   filename: string;
   content: string;
};

export type MessageMail = {
   from: string;
   to: string[];
   subject: string;
   body: string;
   attachments?: Attachments[];
};

export type MessageMailResponse = {
   id: string;
};

export interface MailMessageService {
   send(message: MessageMail): Promise<MessageMailResponse | void>;
}