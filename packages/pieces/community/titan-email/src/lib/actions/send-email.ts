import { createAction, Property } from "@activepieces/pieces-framework";
import { titanEmailAuth, TitanAuth, createTransporter } from "../common";

export const sendEmail = createAction({
  auth: titanEmailAuth,
  name: "send_email",
  displayName: "Send Email",
  description: "Send an email from your Titan Email account via SMTP.",
  props: {
    to: Property.Array({
      displayName: "To",
      description: "Recipient email address(es)",
      required: true,
    }),
    cc: Property.Array({
      displayName: "CC",
      required: false,
    }),
    bcc: Property.Array({
      displayName: "BCC",
      required: false,
    }),
    reply_to: Property.ShortText({
      displayName: "Reply-To",
      description: "Address replies will be sent to (defaults to sender)",
      required: false,
    }),
    from_name: Property.ShortText({
      displayName: "From Name",
      description: "Display name shown to recipients",
      required: false,
    }),
    subject: Property.ShortText({
      displayName: "Subject",
      required: true,
    }),
    content_type: Property.StaticDropdown({
      displayName: "Content Type",
      required: true,
      defaultValue: "html",
      options: {
        options: [
          { label: "HTML", value: "html" },
          { label: "Plain Text", value: "plain" },
        ],
      },
    }),
    body: Property.LongText({
      displayName: "Body",
      description: "The email body (HTML or plain text depending on Content Type)",
      required: true,
    }),
  },

  async run({ auth, propsValue }) {
    const typedAuth = auth as unknown as TitanAuth;
    const transporter = createTransporter(typedAuth);

    const toList = (propsValue.to as string[]).filter(Boolean);
    const ccList = (propsValue.cc as string[] | undefined)?.filter(Boolean);
    const bccList = (propsValue.bcc as string[] | undefined)?.filter(Boolean);

    const from = propsValue.from_name
      ? `"${propsValue.from_name}" <${typedAuth.email}>`
      : typedAuth.email;

    const info = await transporter.sendMail({
      from,
      to: toList.join(", "),
      ...(ccList?.length ? { cc: ccList.join(", ") } : {}),
      ...(bccList?.length ? { bcc: bccList.join(", ") } : {}),
      ...(propsValue.reply_to ? { replyTo: propsValue.reply_to } : {}),
      subject: propsValue.subject,
      [propsValue.content_type === "html" ? "html" : "text"]: propsValue.body,
    });

    return {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  },
});
