import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "jalav@iu.edu",
    subject: `Message from ${name}`,
    text: `${message}\n\nReply to: ${email}`,
  });

  return Response.json({ success: true });
}
