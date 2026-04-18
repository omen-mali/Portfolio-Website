"use client";

import { useState } from "react";

interface BlogTagFilterProps {
  tags: string[];
}

export default function BlogTagFilter({ tags }: BlogTagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  function handleFilter(tag: string | null) {
    setActiveTag(tag);

    // Show/hide blog articles based on tag
    const cards = document.querySelectorAll("article");

    if (!tag) {
      cards.forEach((card) => {
        (card.closest("a")?.parentElement as HTMLElement)?.style.removeProperty("display");
      });
      return;
    }

    cards.forEach((card) => {
      const cardTags = card.querySelectorAll("[data-tag]");
      const hasTag = Array.from(cardTags).some(
        (el) => el.getAttribute("data-tag") === tag
      );
      const wrapper = card.closest("a")?.parentElement as HTMLElement;
      if (wrapper) {
        wrapper.style.display = hasTag ? "" : "none";
      }
    });
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter posts by tag">
      <button
        onClick={() => handleFilter(null)}
        aria-pressed={!activeTag}
        className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
          !activeTag
            ? "bg-white text-black"
            : "border border-border text-muted hover:border-muted hover:bg-white/5"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleFilter(tag)}
          aria-pressed={activeTag === tag}
          className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
            activeTag === tag
              ? "bg-white text-black"
              : "border border-border text-muted hover:border-muted hover:bg-white/5"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
