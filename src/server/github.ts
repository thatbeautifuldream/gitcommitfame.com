import { env } from "@/env";
import { Octokit } from "@octokit/rest";
import { db } from "@/server/db";
import { type User, type GitHubEvent } from "@prisma/client";

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

interface GitHubUserResponse {
  user: User;
  events: GitHubEvent[];
}

export async function getGitHubUserData(
  username: string,
): Promise<GitHubUserResponse> {
  try {
    // First, check if we have recent data in our database
    const existingUser = await db.user.findFirst({
      where: { githubLogin: username },
      include: {
        githubEvents: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    // If data is less than 1 hour old, return it
    if (
      existingUser &&
      existingUser.updatedAt > new Date(Date.now() - 3600000)
    ) {
      return {
        user: existingUser,
        events: existingUser.githubEvents,
      };
    }

    // Otherwise, fetch fresh data from GitHub
    const [userResponse, eventsResponse] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.activity.listPublicEventsForUser({ username }),
    ]);

    const githubUser = userResponse.data;
    const events = eventsResponse.data
      .filter((event) => event.type === "PushEvent")
      .slice(0, 10);

    // Update or create user in database
    const updatedUser = await db.user.upsert({
      where: { githubLogin: username },
      create: {
        githubId: githubUser.id,
        githubLogin: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        htmlUrl: githubUser.html_url,
        bio: githubUser.bio ?? null,
        location: githubUser.location ?? null,
        company: githubUser.company ?? null,
        blog: githubUser.blog ?? null,
        twitterUsername: githubUser.twitter_username ?? null,
        publicRepos: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
      },
      update: {
        avatarUrl: githubUser.avatar_url,
        bio: githubUser.bio ?? null,
        location: githubUser.location ?? null,
        company: githubUser.company ?? null,
        blog: githubUser.blog ?? null,
        twitterUsername: githubUser.twitter_username ?? null,
        publicRepos: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
      },
    });

    // Update events using a transaction
    await db.$transaction(
      events.map((event) =>
        db.gitHubEvent.upsert({
          where: { id: event.id },
          create: {
            id: event.id,
            type: event.type ?? "unknown",
            repoId: event.repo.id,
            repoName: event.repo.name,
            repoUrl: event.repo.url,
            isPublic: event.public,
            createdAt: new Date(event.created_at ?? Date.now()),
            action: event.payload?.action ?? null,
            commitCount: event.payload?.pages?.length ?? null,
            userId: updatedUser.id,
          },
          update: {}, // Events are immutable, so no updates needed
        }),
      ),
    );

    const updatedEvents = await db.gitHubEvent.findMany({
      where: { userId: updatedUser.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return {
      user: updatedUser,
      events: updatedEvents,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching user data for ${username}:`, error.message);
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getUserPublicGists(username: string) {
  try {
    const { data: gists } = await octokit.gists.listForUser({
      username,
      per_page: 100,
    });

    return gists;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching gists:", error.message);

      if ("status" in error && typeof error.status === "number") {
        if (error.status === 404) throw new Error("User not found");
        if (error.status === 401) throw new Error("Unauthorized");
      }
    }

    throw new Error("Failed to fetch gists");
  }
}
