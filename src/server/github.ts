import { env } from "@/env";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

// Helper function to validate GitHub username
const isValidGitHubUsername = (username: string): boolean => {
  const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubUsernameRegex.test(username);
};

export async function getGitHubUserData(username: string) {
  if (!isValidGitHubUsername(username)) {
    throw new Error("Invalid GitHub username");
  }

  try {
    const [userResponse, eventsResponse] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.activity.listPublicEventsForUser({ username }),
    ]);

    const user = userResponse?.data;
    const events = eventsResponse?.data
      .filter((event) => event.type === "PushEvent")
      .slice(0, 10);

    return { user, events };
  } catch (error: any) {
    console.error(`Error fetching user data for ${username}:`, error);

    if (error.status === 404) {
      throw new Error("GitHub user not found");
    }

    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}

export async function getUserPublicGists(username: string) {
  if (!username) {
    throw new Error("Username is required");
  }

  try {
    const { data: gists } = await octokit.gists.listForUser({
      username,
      per_page: 100, // Adjust this value based on your needs
    });

    return gists;
  } catch (error: any) {
    console.error("Error fetching gists:", error);

    if (error.status === 404) {
      throw new Error("User not found");
    }

    if (error.status === 401) {
      throw new Error("Unauthorized");
    }

    throw new Error("Failed to fetch gists");
  }
}
