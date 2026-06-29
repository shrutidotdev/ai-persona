import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId || userId !== "user_2oNWGZXvs6aKmHzQmqqBJPglLxz") {
    // This should match a verified admin user ID from Clerk
    // For development, replace with your actual admin Clerk user ID
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
      (acc, session) => {
        const slug = session.persona_slug;
        acc[slug] = (acc[slug] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

    const topPersonasList = Object.entries(personaCounts)
      .sort(([, a], [, b]) => b - a)
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
      sessions?.map((session: any) => ({
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
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
