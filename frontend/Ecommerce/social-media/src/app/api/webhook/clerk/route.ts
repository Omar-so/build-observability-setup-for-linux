import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import  prisma  from "@/lib/prisma";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
  try {
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, image_url, first_name, last_name } = evt.data;

      const email = email_addresses?.[0]?.email_address ?? null;
      
      // if (!email) {
      //   console.error('No email provided for user:', id);
      //   return new Response('Email is required', { status: 400 });
      // }

      const userData = {
        id,
        email,
        name: `${first_name || ''} ${last_name || ''}`.trim() || null,
        image: image_url || null,
      };

      await prisma.user.upsert({
        where: { 
          id 
        },
        create: {
          ...userData,
        },
        update: userData,
      });

      return new Response('User data processed', { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Webhook error', { status: 400 });
  }
}