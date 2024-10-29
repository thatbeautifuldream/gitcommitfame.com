import { Suspense } from "react";
import { getUserPublicGists } from "@/server/github";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { GistContent } from "@/components/gist-content";
import LoadingGists from "./loading";
import type { GistFile } from "@/types/github";

interface PageProps {
  params: {
    username: string;
  };
}

export default async function GistsPage({ params }: PageProps) {
  const gists = await getUserPublicGists(params.username);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Public gists shared by {params.username}
      </h1>

      <Suspense fallback={<LoadingGists />}>
        <div className="space-y-8">
          {gists.map((gist) => (
            <div key={gist.id} className="bg-card rounded-lg border p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  {gist.description || "No description"}
                </h2>
                <div className="text-muted-foreground mt-2 flex flex-col gap-2 text-sm sm:flex-row sm:gap-4">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Created: {new Date(gist.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Updated: {new Date(gist.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(gist.files).map(([filename, file]) => (
                  <div key={filename} className="bg-muted rounded-lg p-4">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="break-all text-sm font-medium">
                        {filename}
                      </h3>
                      <Badge variant="secondary" className="w-fit">
                        {file.language || "Plain Text"}
                      </Badge>
                    </div>
                    <div className="bg-background rounded-md border">
                      <GistContent file={file as GistFile} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
}
