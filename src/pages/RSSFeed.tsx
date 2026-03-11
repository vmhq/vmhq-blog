import { useEffect } from "react";
import { generateRSSFeed } from "@/lib/posts";

const RSSFeed = () => {
  useEffect(() => {
    const xml = generateRSSFeed(window.location.origin);
    const blob = new Blob([xml], { type: "application/rss+xml" });
    const url = URL.createObjectURL(blob);
    window.location.replace(url);
  }, []);

  return null;
};

export default RSSFeed;
