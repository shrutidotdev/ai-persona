import { createClerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Clerk client
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncUsers() {
    // Now this should work
    const users = await clerkClient.users.getUserList({ limit: 100 });

    for (const user of users.data) {
        const { error } = await supabase.from('users').upsert({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            first_name: user.firstName,
            last_name: user.lastName,
            avatar_url: user.imageUrl,
        });

        if (error) console.error('Error syncing', user.id, error);
        else console.log('Synced:', user.emailAddresses[0]?.emailAddress);
    }
}

syncUsers();