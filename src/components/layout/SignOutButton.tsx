"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

interface SignOutButtonProps {
  className?: string;
  variant?: "ghost" | "outline" | "default" | "destructive" | "icon" | "list-item";
  showText?: boolean;
}

export function SignOutButton({
  className,
  variant = "ghost",
  showText = true,
}: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={handleSignOut}
        title="Sign Out"
        className={
          className ??
          "p-2 rounded-full text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        }
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-red-500" />
        ) : (
          <LogOut className="h-5 w-5" />
        )}
      </button>
    );
  }

  if (variant === "list-item") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={handleSignOut}
        className={
          className ??
          "w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-colors group"
        }
      >
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-red-600 dark:text-red-400">
              {isPending ? "Signing Out..." : "Sign Out of Account"}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              Securely exit your Kadashe session on this device
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <Button
      variant={variant === "destructive" ? "destructive" : "ghost"}
      size="sm"
      disabled={isPending}
      onClick={handleSignOut}
      className={className ?? "text-muted-foreground hover:text-red-600 dark:hover:text-red-400"}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          {showText && <span>Sign Out</span>}
        </>
      )}
    </Button>
  );
}
