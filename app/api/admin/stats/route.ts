import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

type PersonaCountRow = {
  persona_slug: string;
};

type RecentSessionRow = {
  id: string;
  user_id: string;
  persona_slug: string;
  title: string | null;
  created_at: string;
  messages?: { id: string }[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
  );
}

const db = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function GET() {
  const { userId } = await auth();
  const user = await currentUser();

  const configuredAdminEmails = (process.env.CLERK_ADMIN_EMAILS || "thedeveloper.shruti@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const configuredAdminUserId = process.env.CLERK_ADMIN_USER_ID?.trim();

  const isAdminEmail = user?.emailAddresses?.some(({ emailAddress }) =>
    configuredAdminEmails.includes(emailAddress.toLowerCase())
  );

  const isAdminUserId = Boolean(configuredAdminUserId && userId === configuredAdminUserId);

  if (!userId || (!isAdminEmail && !isAdminUserId)) {
    return Response.json(
      {
        error: "Unauthorized. Sign in with an allowed admin Clerk account.",
        debug: {
          userId,
          configuredAdminEmails,
          configuredAdminUserId,
        },
      },
      { status: 401 }
    );
  }

  try {
    // Get total users
    const { count: userCount } = await db
      .from("users")
      .select("*", { count: "exact", head: true });

    // Get total sessions
    const { count: sessionCount } = await db
      .from("sessions")
      .select("*", { count: "exact", head: true });

    // Get total messages
    const { count: messageCount } = await db
      .from("messages")
      .select("*", { count: "exact", head: true });

    // Get top personas
    const { data: topPersonas } = await db
      .from("sessions")
      .select("persona_slug")
      .order("created_at", { ascending: false })
      .limit(1000);

    const personaCounts = topPersonas?.reduce(
      (acc: Record<string, number>, session: PersonaCountRow) => {
        const slug = session.persona_slug;
        acc[slug] = (acc[slug] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

    const topPersonasList = Object.entries(personaCounts)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 5)
      .map(([slug, count]) => ({
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        count,
      }));

    // Get recent sessions with message counts
    const { data: sessions } = await db
      .from("sessions")
      .select(
        `
        id,
        user_id,
        persona_slug,
        title,
        created_at,
        messages(id)
      `
      )
      .order("created_at", { ascending: false })
      .limit(15);

    const recentSessions =
      sessions?.map((session: RecentSessionRow) => ({
        id: session.id,
        userId: session.user_id,
        personaSlug: session.persona_slug,
        title: session.title || "Untitled",
        messageCount: session.messages?.length || 0,
        createdAt: session.created_at,
      })) || [];

    const stats = {
      totalSessions: sessionCount || 0,
      totalMessages: messageCount || 0,
      totalUsers: userCount || 0,
      avgMessagesPerSession:
        (messageCount || 0) / Math.max(1, sessionCount || 1),
      topPersonas: topPersonasList,
      recentSessions,
    };

    return Response.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
