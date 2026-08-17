"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export function SignOutButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signOutAction();
        });
      }}
      className={className ?? "text-muted-foreground hover:text-red-600 dark:hover:text-red-400"}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </>
      )}
    </Button>
  );
}
