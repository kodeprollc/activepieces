import { createPiece } from "@activepieces/pieces-framework";
import { PieceCategory } from "@activepieces/shared";
import { titanEmailAuth } from "./lib/common";
import { sendEmail } from "./lib/actions/send-email";

export const titanEmail = createPiece({
  displayName: "Titan Email",
  description: "Send emails via your Titan Email account using SMTP",
  auth: titanEmailAuth,
  minimumSupportedRelease: "0.36.1",
  logoUrl: "https://cdn.activepieces.com/pieces/mail.png",
  categories: [PieceCategory.COMMUNICATION],
  authors: ["kodeprollc"],
  actions: [sendEmail],
  triggers: [],
});
