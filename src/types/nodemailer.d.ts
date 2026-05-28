declare module "nodemailer" {
  type TransportOptions = {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string;
      pass?: string;
    };
  };

  type MailOptions = {
    from?: string;
    to: string;
    subject: string;
    html: string;
  };

  type Transporter = {
    sendMail(mailOptions: MailOptions): Promise<unknown>;
  };

  export function createTransport(options: TransportOptions): Transporter;
}
