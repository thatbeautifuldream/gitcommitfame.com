import Loader from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getGitHubUserData } from "@/server/github";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Book, GitFork, Link2, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import GitHubCalendar from "react-github-calendar";

dayjs.extend(relativeTime);

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const { user, events } = await getGitHubUserData(params.username);

  return (
    <Suspense fallback={<Loader />}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar_url} alt={user?.login} />
                <AvatarFallback>{user?.login[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {user?.name || user?.login}
                </CardTitle>
                <p className="text-sm text-gray-500">{user?.bio}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatBlock
                icon={<Users className="h-4 w-4 text-gray-600" />}
                value={user?.followers}
                label="Followers"
                href={`https://github.com/${user?.login}?tab=followers`}
              />
              <StatBlock
                icon={<Users className="h-4 w-4 text-gray-600" />}
                value={user?.following}
                label="Following"
                href={`https://github.com/${user?.login}?tab=following`}
              />
              <StatBlock
                icon={<Book className="h-4 w-4 text-gray-600" />}
                value={user?.public_repos}
                label="Repos"
                href={`https://github.com/${user?.login}?tab=repositories`}
              />
              <StatBlock
                icon={<GitFork className="h-4 w-4 text-gray-600" />}
                value={user?.public_gists}
                label="Gists"
                href={`https://gist.github.com/${user?.login}`}
              />
            </div>
            <div className="mb-6 flex justify-center">
              <GitHubCalendar
                username={user?.login}
                colorScheme="light"
                fontSize={10}
                blockSize={8}
              />
            </div>
            <div className="border-t pt-4">
              <h2 className="mb-3 text-lg font-semibold">Recent Commits</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Repository</TableHead>
                      <TableHead className="w-1/2">Message</TableHead>
                      <TableHead className="w-1/6">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events?.map((event) => (
                      <TableRow key={event?.id}>
                        <TableCell className="py-2">
                          <Link
                            href={event?.repo?.url?.replace(
                              "https://api.github.com/repos/",
                              "https://github.com/",
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm hover:underline"
                          >
                            {event?.repo?.name}
                            <Link2 className="ml-1 h-3 w-3" />
                          </Link>
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {event?.payload?.pages?.map((page) => page.title)}
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {dayjs(event?.created_at).fromNow()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

const StatBlock = ({
  icon,
  value,
  label,
  href,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  href: string;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 rounded-md bg-gray-50 p-2 transition-colors hover:bg-gray-100"
  >
    {icon}
    <div>
      <span className="text-sm font-semibold">{value}</span>
      <span className="block text-xs text-gray-500">{label}</span>
    </div>
  </Link>
);
