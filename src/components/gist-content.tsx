"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface GistFile {
  filename: string;
  type: string;
  language: string | null;
  raw_url: string;
  size: number;
  content?: string;
}

const MAX_DISPLAY_SIZE = 100000; // 100KB
const MAX_INITIAL_RENDER = 2000; // Show first 2000 characters initially

export function GistContent({ file }: { file: GistFile }) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [truncated, setTruncated] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Skip fetching if file is too large
        if (file.size > MAX_DISPLAY_SIZE) {
          setContent(
            `File is too large to display (${(file.size / 1024).toFixed(1)} KB)`,
          );
          setTruncated(true);
          return;
        }

        const response = await fetch(file.raw_url);
        const text = await response.text();

        if (text.length > MAX_INITIAL_RENDER) {
          setContent(text.slice(0, MAX_INITIAL_RENDER));
          setTruncated(true);
        } else {
          setContent(text);
        }
      } catch (error) {
        console.error("Error fetching gist content:", error);
        setContent("Error loading content");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setContent("");
    setTruncated(false);
    setShowFull(false);
    fetchContent();
  }, [file.raw_url, file.size]);

  const loadFullContent = async () => {
    try {
      const response = await fetch(file.raw_url);
      const text = await response.text();
      setContent(text);
      setShowFull(true);
    } catch (error) {
      console.error("Error fetching full content:", error);
    }
  };

  if (loading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  return (
    <div className="rounded-md">
      <div className="max-h-[500px] overflow-auto">
        <SyntaxHighlighter
          language={file.language?.toLowerCase() || "text"}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: "0.375rem",
          }}
          showLineNumbers
        >
          {content}
        </SyntaxHighlighter>
      </div>
      {truncated && !showFull && (
        <button
          onClick={loadFullContent}
          className="mt-2 text-sm text-blue-500 hover:text-blue-600"
        >
          Show full content
        </button>
      )}
    </div>
  );
}
