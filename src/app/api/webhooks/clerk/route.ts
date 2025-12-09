import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import HealthcareInstitution from '@/models/HealthcareInstitution';
import Vendor from '@/models/Vendor';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  const { id, email_addresses, first_name, last_name, image_url } = evt.data;

  await connectDB();

  try {
    switch (eventType) {
      case 'user.created':
        // Create user in database
        await User.create({
          userId: id,
          clerkId: id,
          email: email_addresses[0]?.email_address || '',
          emailVerified: email_addresses[0]?.verification?.status === 'verified',
          firstName: first_name || '',
          lastName: last_name || '',
          imageUrl: image_url || '',
          lastLoginAt: new Date(),
          lastActivityAt: new Date(),
          metadata: {
            createdAt: evt.data.created_at,
          },
        });
        break;

      case 'user.updated':
        // Update user in database
        await User.findOneAndUpdate(
          { userId: id },
          {
            email: email_addresses[0]?.email_address,
            emailVerified: email_addresses[0]?.verification?.status === 'verified',
            firstName: first_name,
            lastName: last_name,
            imageUrl: image_url,
            metadata: {
              updatedAt: evt.data.updated_at,
              lastSignInAt: evt.data.last_sign_in_at,
            },
          },
          { new: true }
        );
        break;

      case 'user.deleted':
        // Soft delete: mark user as inactive and anonymize data
        await User.findOneAndUpdate(
          { userId: id },
          {
            isActive: false,
            email: `deleted_${id}@deleted.local`,
            firstName: 'Deleted',
            lastName: 'User',
            imageUrl: null,
          }
        );
        
        // Optionally: Delete related profiles or mark them as inactive
        // await HealthcareInstitution.findOneAndUpdate(
        //   { userId: id },
        //   { status: 'inactive' }
        // );
        // await Vendor.findOneAndUpdate(
        //   { userId: id },
        //   { status: 'inactive' }
        // );
        break;

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}

