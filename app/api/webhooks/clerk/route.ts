import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const headersList = await headers()
  const svix_id = headersList.get('svix-id')
  const svix_timestamp = headersList.get('svix-timestamp')
  const svix_signature = headersList.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.text()
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Handle user creation
  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const primaryEmail = email_addresses?.[0]?.email_address

    const { error } = await supabase.from('users').insert({
      id,
      email: primaryEmail,
      first_name,
      last_name,
      avatar_url: image_url,
    })

    if (error) {
      console.error('Error syncing user:', error)
      return new Response('Error syncing user', { status: 500 })
    }
  }

  // Handle user deletion
  if (evt.type === 'user.deleted') {
    const { id } = evt.data

    const { error } = await supabase.from('users').delete().eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('Webhook processed', { status: 200 })
}
