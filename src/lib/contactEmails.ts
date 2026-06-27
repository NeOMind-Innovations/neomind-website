import "server-only";

import { Resend } from "resend";

const FROM_ADDRESS = "NeOMind <onboarding@resend.dev>";
const SUPPORT_EMAIL = "support@neomindinnovations.in";

export type ContactEmailDetails = {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  message: string;
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function emailShell(preheader: string, heading: string, content: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;background:#f8fafc;color:#111827;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#1e3a8a;padding:28px 32px;">
                <div style="color:#ffffff;font-size:26px;font-weight:700;">NeOMind</div>
                <div style="margin-top:6px;color:#bfdbfe;font-size:14px;">Transforming Ideas into Intelligent Solutions</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 18px;color:#111827;font-size:24px;line-height:1.3;">${escapeHtml(heading)}</h1>
                ${content}
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e2e8f0;padding:20px 32px;color:#64748b;font-size:12px;line-height:1.6;">
                THE NEOMIND INNOVATIONS LLP<br>
                AI &bull; SaaS &bull; Automation &bull; Mobile Apps
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="width:150px;border-bottom:1px solid #e2e8f0;padding:11px 12px;color:#475569;font-size:13px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="border-bottom:1px solid #e2e8f0;padding:11px 12px;color:#111827;font-size:14px;line-height:1.6;vertical-align:top;">${escapeHtml(value).replace(/\r?\n/g, "<br>")}</td>
  </tr>`;
}

function inquiryDetails(details: ContactEmailDetails) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;">
    ${detailRow("Name", details.name)}
    ${detailRow("Email", details.email)}
    ${detailRow("Phone", details.phone)}
    ${detailRow("Company", details.company)}
    ${detailRow("Service interest", details.serviceInterest)}
    ${detailRow("Message", details.message)}
  </table>`;
}

function internalEmailHtml(details: ContactEmailDetails) {
  return emailShell(
    `New website inquiry from ${details.name}`,
    "New website inquiry",
    `<p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
      A new inquiry has been saved from the NeOMind website.
    </p>
    ${inquiryDetails(details)}
    <p style="margin:24px 0 0;color:#475569;font-size:13px;line-height:1.6;">
      Reply directly to this email to contact ${escapeHtml(details.name)}.
    </p>`,
  );
}

function acknowledgementEmailHtml(details: ContactEmailDetails) {
  return emailShell(
    "We have received your NeOMind inquiry.",
    `Thank you, ${details.name}`,
    `<p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.7;">
      Thank you for contacting NeOMind. Our team has received your inquiry and will follow up soon.
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
      Here is a copy of the information you submitted:
    </p>
    ${inquiryDetails(details)}
    <div style="margin-top:24px;border-left:4px solid #14b8a6;background:#f0fdfa;padding:16px;color:#134e4a;font-size:14px;line-height:1.6;">
      Need to add something? Reply to this email and our team will receive it.
    </div>`,
  );
}

function internalEmailText(details: ContactEmailDetails) {
  return `New website inquiry

Name: ${details.name}
Email: ${details.email}
Phone: ${details.phone}
Company: ${details.company}
Service interest: ${details.serviceInterest}
Message: ${details.message}`;
}

function acknowledgementEmailText(details: ContactEmailDetails) {
  return `Thank you, ${details.name}.

Thank you for contacting NeOMind. Our team has received your inquiry and will follow up soon.

Your inquiry:
Company: ${details.company}
Service interest: ${details.serviceInterest}
Message: ${details.message}

NeOMind
Transforming Ideas into Intelligent Solutions`;
}

export async function sendContactInquiryEmails(details: ContactEmailDetails) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Resend email delivery is not configured.");
  }

  const resend = new Resend(apiKey);
  const deliveries = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: SUPPORT_EMAIL,
      replyTo: details.email,
      subject: "New Website Inquiry - NeOMind",
      html: internalEmailHtml(details),
      text: internalEmailText(details),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: details.email,
      replyTo: SUPPORT_EMAIL,
      subject: "Thank you for contacting NeOMind",
      html: acknowledgementEmailHtml(details),
      text: acknowledgementEmailText(details),
    }),
  ]);

  const failedDeliveries = deliveries.filter(
    (delivery) =>
      delivery.status === "rejected" ||
      (delivery.status === "fulfilled" && delivery.value.error),
  );

  if (failedDeliveries.length > 0) {
    throw new Error(
      `${failedDeliveries.length} contact email notification(s) failed.`,
    );
  }
}
