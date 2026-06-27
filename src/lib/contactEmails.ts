import "server-only";

import { Resend } from "resend";

const FROM_ADDRESS = "NeOMind <no-reply@neomindinnovations.in>";
const DEFAULT_INTERNAL_LEAD_EMAIL = "neo.neolearn.ai@gmail.com";
const WEBSITE_URL = "https://neomindinnovations.in";

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
                <div style="color:#ffffff;font-size:26px;font-weight:700;">NeOMind Innovations LLP</div>
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
              <td style="border-top:1px solid #e2e8f0;background:#f8fafc;padding:22px 32px;color:#64748b;font-size:12px;line-height:1.7;">
                <strong style="color:#1e3a8a;">NeOMind Innovations LLP</strong><br>
                Transforming Ideas into Intelligent Solutions<br>
                <a href="${WEBSITE_URL}" style="color:#2563eb;text-decoration:none;">${WEBSITE_URL}</a>
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

function internalEmailHtml(
  details: ContactEmailDetails,
  receivedAt: string,
) {
  return emailShell(
    `New website inquiry from ${details.name}`,
    "New website inquiry",
    `<div style="margin:0 0 24px;background:#fff7ed;border:1px solid #fed7aa;border-left:5px solid #7c3aed;padding:14px 16px;color:#7c2d12;font-size:13px;font-weight:700;">
      NEW WEBSITE LEAD &bull; FOLLOW-UP REQUIRED
    </div>
    <h2 style="margin:0 0 12px;color:#1e3a8a;font-size:17px;">Lead summary</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#eff6ff;border:1px solid #bfdbfe;">
      <tr>
        <td style="padding:16px;color:#475569;font-size:12px;line-height:1.5;vertical-align:top;">
          SERVICE INTEREST<br>
          <strong style="color:#111827;font-size:14px;">${escapeHtml(details.serviceInterest || "General Inquiry")}</strong>
        </td>
        <td style="padding:16px;color:#475569;font-size:12px;line-height:1.5;vertical-align:top;">
          COMPANY<br>
          <strong style="color:#111827;font-size:14px;">${escapeHtml(details.company)}</strong>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border:1px solid #e2e8f0;">
      ${detailRow("Received at", receivedAt)}
      ${detailRow("Lead source", "NeOMind website contact form")}
    </table>
    <h2 style="margin:0 0 12px;color:#1e3a8a;font-size:17px;">Submitted information</h2>
    ${inquiryDetails(details)}
    <p style="margin:24px 0 0;color:#475569;font-size:13px;line-height:1.6;">
      Reply directly to this notification to contact ${escapeHtml(details.name)} at ${escapeHtml(details.email)}.
    </p>`,
  );
}

function acknowledgementEmailHtml(details: ContactEmailDetails) {
  return emailShell(
    "We have received your NeOMind inquiry.",
    `Thank you, ${details.name}`,
    `<p style="margin:0 0 16px;color:#475569;font-size:16px;line-height:1.75;">
      Welcome to NeOMind Innovations LLP. Thank you for sharing your goals with us. Your inquiry has been received, and our team will review it with care.
    </p>
    <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.7;">
      We build intelligent, scalable digital solutions designed around real business needs.
    </p>
    <h2 style="margin:0 0 14px;color:#1e3a8a;font-size:18px;">What happens next?</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
      <tr>
        <td style="width:34px;padding:0 12px 14px 0;vertical-align:top;"><div style="background:#2563eb;color:#ffffff;width:30px;height:30px;line-height:30px;text-align:center;font-size:14px;font-weight:700;">1</div></td>
        <td style="padding:2px 0 14px;color:#475569;font-size:14px;line-height:1.6;"><strong style="color:#111827;">Thoughtful review</strong><br>Our team will assess your requirements and the outcomes you want to achieve.</td>
      </tr>
      <tr>
        <td style="width:34px;padding:0 12px 14px 0;vertical-align:top;"><div style="background:#14b8a6;color:#ffffff;width:30px;height:30px;line-height:30px;text-align:center;font-size:14px;font-weight:700;">2</div></td>
        <td style="padding:2px 0 14px;color:#475569;font-size:14px;line-height:1.6;"><strong style="color:#111827;">A focused conversation</strong><br>A NeOMind specialist will contact you to understand the opportunity in greater detail.</td>
      </tr>
      <tr>
        <td style="width:34px;padding:0 12px 0 0;vertical-align:top;"><div style="background:#7c3aed;color:#ffffff;width:30px;height:30px;line-height:30px;text-align:center;font-size:14px;font-weight:700;">3</div></td>
        <td style="padding:2px 0 0;color:#475569;font-size:14px;line-height:1.6;"><strong style="color:#111827;">Clear next steps</strong><br>We will recommend a practical path aligned with your priorities, scope, and growth plans.</td>
      </tr>
    </table>
    <h2 style="margin:0 0 14px;color:#1e3a8a;font-size:18px;">Your submitted information</h2>
    ${inquiryDetails(details)}
    <h2 style="margin:28px 0 14px;color:#1e3a8a;font-size:18px;">How NeOMind can help</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;">
      <tr>
        <td style="padding:16px;color:#334155;font-size:14px;line-height:1.9;vertical-align:top;">
          &bull; AI Solutions<br>
          &bull; Custom Software Development<br>
          &bull; Mobile App Development<br>
          &bull; SaaS Product Development
        </td>
        <td style="padding:16px;color:#334155;font-size:14px;line-height:1.9;vertical-align:top;">
          &bull; AI Helpdesk Solutions<br>
          &bull; Business Automation<br>
          &bull; Cloud Applications<br>
          &bull; Digital Transformation
        </td>
      </tr>
    </table>
    <div style="margin-top:28px;text-align:center;">
      <a href="${WEBSITE_URL}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:13px 22px;font-size:14px;font-weight:700;text-decoration:none;">Visit the NeOMind website</a>
    </div>
    <p style="margin:24px 0 0;color:#475569;font-size:13px;line-height:1.6;text-align:center;">
      Need to add something? Reply to this email and our team will receive it.
    </p>`,
  );
}

function internalEmailText(details: ContactEmailDetails, receivedAt: string) {
  return `NEW WEBSITE LEAD - FOLLOW-UP REQUIRED

Lead summary
Service interest: ${details.serviceInterest || "General Inquiry"}
Company: ${details.company}
Received at: ${receivedAt}
Lead source: NeOMind website contact form

Name: ${details.name}
Email: ${details.email}
Phone: ${details.phone}
Company: ${details.company}
Service interest: ${details.serviceInterest}
Message: ${details.message}`;
}

function acknowledgementEmailText(details: ContactEmailDetails) {
  return `Thank you, ${details.name}.

Welcome to NeOMind Innovations LLP. Thank you for sharing your goals with us. Your inquiry has been received, and our team will review it with care.

What happens next?
1. Thoughtful review of your requirements and desired outcomes.
2. A focused conversation with a NeOMind specialist.
3. Clear, practical next steps aligned with your priorities.

Your submitted information:
Name: ${details.name}
Email: ${details.email}
Phone: ${details.phone}
Company: ${details.company}
Service interest: ${details.serviceInterest}
Message: ${details.message}

Our services:
AI Solutions, Custom Software Development, Mobile App Development, SaaS Product Development, AI Helpdesk Solutions, Business Automation, Cloud Applications, and Digital Transformation.

NeOMind Innovations LLP
Transforming Ideas into Intelligent Solutions
${WEBSITE_URL}`;
}

function subjectPart(value: string, fallback: string) {
  return value.replace(/[\r\n]+/g, " ").trim() || fallback;
}

export async function sendContactInquiryEmails(details: ContactEmailDetails) {
  const apiKey = process.env.RESEND_API_KEY;
  const internalLeadEmail =
    process.env.INTERNAL_LEAD_EMAIL?.trim() || DEFAULT_INTERNAL_LEAD_EMAIL;
  const serviceInterest = subjectPart(
    details.serviceInterest,
    "General Inquiry",
  );
  const contactName = subjectPart(details.name, "Website Visitor");
  const receivedAt = new Date().toISOString();

  if (!apiKey) {
    throw new Error("Resend email delivery is not configured.");
  }

  const resend = new Resend(apiKey);
  const deliveries = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: internalLeadEmail,
      replyTo: details.email,
      subject: `🚀 New Website Inquiry | ${serviceInterest} | ${contactName}`,
      html: internalEmailHtml(details, receivedAt),
      text: internalEmailText(details, receivedAt),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: details.email,
      replyTo: internalLeadEmail,
      subject: "Thank you for contacting NeOMind Innovations LLP",
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
