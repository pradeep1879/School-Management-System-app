import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, Search, Sparkles } from "lucide-react";

import type { ShellCommandItem } from "@/components/layout/shell.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AppCommandPaletteProps = {
  items: ShellCommandItem[];
};

export const AppCommandPalette = ({ items }: AppCommandPaletteProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return items.slice(0, 8);
    }

    return items.filter((item) => {
      const haystack = [
        item.title,
        item.url,
        item.section,
        ...(item.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(trimmedQuery);
    });
  }, [items, query]);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    navigate(url);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="hidden h-11 min-w-65 items-center justify-between rounded-2xl border bg-card/70 px-4 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-card md:flex lg:min-w-[320px]"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search pages and quick actions
        </span>
        <span className="rounded-md border bg-background px-2 py-0.5 text-xs text-foreground">
          ⌘K
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border bg-background/95 p-0 shadow-2xl backdrop-blur">
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick navigation
            </DialogTitle>
            <DialogDescription>
              Jump to pages, settings, and common actions without leaving the keyboard.
            </DialogDescription>
          </DialogHeader>

          <div className="border-b px-6 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search dashboard, announcements, exams..."
                className="h-12 rounded-2xl border bg-muted/35 pl-11 pr-4"
              />
            </div>
          </div>

          <div className="command-scrollbar max-h-105 overflow-y-auto p-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={`${item.title}-${item.url}`}
                  type="button"
                  onClick={() => handleSelect(item.url)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{item.title}</span>
                      {item.section ? (
                        <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-[0.18em]">
                          {item.section}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.url}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Open</span>
                    <CornerDownLeft className="h-4 w-4" />
                  </div>
                </button>
              ))
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/20 text-center">
                <Search className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="font-medium">No matching pages found</p>
                  <p className="text-sm text-muted-foreground">
                    Try another keyword like dashboard, subjects, or announcements.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
