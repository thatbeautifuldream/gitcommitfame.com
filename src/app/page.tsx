import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { instrumentSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Github,
  GitCommit,
  Share2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const features = [
  {
    icon: GitCommit,
    title: "Showcase Commits",
    description:
      "Visualize your coding journey with beautiful commit history graphs and statistics",
    content:
      "Transform your GitHub activity into an engaging visual story that demonstrates your dedication and consistency",
    color: "text-green-600",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Monitor your growth and development as a programmer over time",
    content:
      "See your skills evolve with detailed analytics and progress tracking features",
    color: "text-blue-600",
  },
  {
    icon: Share2,
    title: "Share & Connect",
    description:
      "Share your profile with recruiters and connect with fellow developers",
    content:
      "Build your professional network and showcase your achievements to potential employers",
    color: "text-purple-600",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col justify-between px-4 py-16">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 sm:px-6 lg:px-8">
        <h1
          className={cn(
            "text-center text-3xl font-normal leading-tight sm:text-4xl md:text-5xl",
            instrumentSerif.className,
          )}
        >
          <span className="text-gray-900">The Developer's Showcase</span>
          <br />
          <span className="text-gray-700">
            to <span className="italic">highlight</span> &amp;{" "}
            <span className="underline">share</span> your GitHub journey!
          </span>
        </h1>
        <h2 className="max-w-2xl text-center text-base text-gray-600 sm:text-lg">
          {[
            "Showcase your commits",
            "visualize your progress",
            "impress recruiters",
          ].map((text, index) => (
            <React.Fragment key={index}>
              <button
                className="rounded font-normal text-gray-600 transition-colors duration-300 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
                type="button"
              >
                {text}
              </button>
              {index < 2 && <span className="mx-1">,</span>}
              {index === 2 && <span className="mx-1">and</span>}
            </React.Fragment>
          ))}
          <span>connect with the most innovative developers.</span>
        </h2>
      </section>

      {/* Feature Cards Section */}
      <section className="mx-auto max-w-2xl">
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-gray-50/30" />
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`${feature.color} rounded-lg bg-gray-50 p-2`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} &lt;GitCommitFame /&gt; by{" "}
          <Link
            href="/thatbeautifuldream"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Take a look at Milind's Commit History"
          >
            Milind Mishra
          </Link>
        </p>
      </footer>
    </div>
  );
}
