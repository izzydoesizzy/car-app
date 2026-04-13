"use client";

import { useState, useEffect } from "react";
import { Plus, X, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TagData {
  id: string;
  name: string;
  color: string;
}

const TAG_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
];

export function ListingTags({ listingId }: { listingId: string }) {
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [assignedTagIds, setAssignedTagIds] = useState<Set<string>>(new Set());
  const [showPicker, setShowPicker] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch all user tags
      const { data: tags } = await supabase
        .from("tags")
        .select("id, name, color")
        .order("name");

      // Fetch tags assigned to this listing
      const { data: assigned } = await supabase
        .from("listing_tags")
        .select("tag_id")
        .eq("listing_id", listingId);

      setAllTags(tags ?? []);
      setAssignedTagIds(new Set((assigned ?? []).map((a) => a.tag_id)));
    }
    load();
  }, [listingId]);

  async function toggleTag(tagId: string) {
    const supabase = createClient();
    if (assignedTagIds.has(tagId)) {
      await supabase
        .from("listing_tags")
        .delete()
        .eq("listing_id", listingId)
        .eq("tag_id", tagId);
      setAssignedTagIds((prev) => {
        const next = new Set(prev);
        next.delete(tagId);
        return next;
      });
    } else {
      await supabase
        .from("listing_tags")
        .insert({ listing_id: listingId, tag_id: tagId });
      setAssignedTagIds((prev) => new Set(prev).add(tagId));
    }
  }

  async function createTag() {
    const name = newTagName.trim();
    if (!name) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("tags")
      .insert({ user_id: user.id, name, color: newTagColor })
      .select("id, name, color")
      .single();

    if (error) {
      // Likely duplicate name
      return;
    }

    if (data) {
      setAllTags((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      // Auto-assign to this listing
      await supabase
        .from("listing_tags")
        .insert({ listing_id: listingId, tag_id: data.id });
      setAssignedTagIds((prev) => new Set(prev).add(data.id));
      setNewTagName("");
    }
  }

  async function deleteTag(tagId: string) {
    const supabase = createClient();
    await supabase.from("tags").delete().eq("id", tagId);
    setAllTags((prev) => prev.filter((t) => t.id !== tagId));
    setAssignedTagIds((prev) => {
      const next = new Set(prev);
      next.delete(tagId);
      return next;
    });
  }

  const assignedTags = allTags.filter((t) => assignedTagIds.has(t.id));

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Tag className="w-4 h-4" /> Tags
        </h2>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Manage
        </button>
      </div>

      {/* Assigned tags */}
      {assignedTags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {assignedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
              <button
                onClick={() => toggleTag(tag.id)}
                className="hover:opacity-75"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No tags assigned. Click Manage to add tags.</p>
      )}

      {/* Tag picker */}
      {showPicker && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          {/* Existing tags */}
          {allTags.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Click to toggle:</p>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      assignedTagIds.has(tag.id)
                        ? "text-white ring-2 ring-offset-1 ring-black/20"
                        : "text-white opacity-50 hover:opacity-75"
                    }`}
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTag(tag.id);
                      }}
                      className="hover:opacity-75 ml-0.5"
                      title="Delete tag"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create new tag */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Create new tag:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createTag();
                  }
                }}
                placeholder="Tag name..."
                maxLength={30}
                className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={createTag}
                disabled={!newTagName.trim()}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="flex gap-1.5">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    newTagColor === color ? "ring-2 ring-offset-1 ring-foreground scale-110" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
