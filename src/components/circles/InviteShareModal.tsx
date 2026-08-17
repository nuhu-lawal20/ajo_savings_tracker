"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Share2 } from "lucide-react";

export function InviteShareModal({
  inviteCode,
  circleName,
}: {
  inviteCode: string;
  circleName: string;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/join/${inviteCode}` : `/join/${inviteCode}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="font-semibold text-xs gap-1.5"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share Invite
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Invite Members to {circleName}</DialogTitle>
            <DialogDescription className="text-xs">
              Share this link or code with trusted peers to have them join this rotating savings circle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Invite Code Box */}
            <div className="p-3 rounded-lg bg-muted text-center space-y-1">
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Circle Code</p>
              <p className="font-mono text-2xl font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
                {inviteCode}
              </p>
            </div>

            {/* Full Link with Copy */}
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={inviteUrl}
                className="h-10 flex-1 px-3 rounded-lg border border-border bg-background text-xs font-mono text-muted-foreground"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCopy}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
