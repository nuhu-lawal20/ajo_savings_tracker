"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Crown,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  Search,
  Users,
  CircleDollarSign,
  Award,
  X,
  Loader2,
  Calendar,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
} from "lucide-react";


export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  trust_score: number;
  kyc_tier: number;
  is_admin: boolean;
  admin_role?: "super_admin" | "helper_admin" | "none";
  is_suspended?: boolean;
  created_at: string;
  avatar_url?: string | null;
  created_circles_count?: number;
}

interface AdminUserManagementProps {
  users: AdminUser[];
  currentOperator: {
    id: string;
    isSuperAdmin: boolean;
    isHelperAdmin: boolean;
  };
}

export function AdminUserManagement({ users, currentOperator }: AdminUserManagementProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "super_admin" | "helper_admin" | "organizer" | "member" | "suspended">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPhone, setNewAdminPhone] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminFeedback, setAddAdminFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Directly Create and Provision Helper Admin
  async function handleCreateHelperAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) return;

    setAddAdminLoading(true);
    setAddAdminFeedback(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newAdminName.trim(),
          email: newAdminEmail.trim(),
          phone: newAdminPhone.trim() || null,
        }),
      });

      const data = await res.json();
      setAddAdminLoading(false);

      if (!res.ok) {
        setAddAdminFeedback({ type: "error", text: data.error || "Failed to create helper admin." });
        return;
      }

      setAddAdminFeedback({ type: "success", text: data.message });
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPhone("");
      router.refresh();
      setTimeout(() => {
        setShowAddAdminModal(false);
        setAddAdminFeedback(null);
      }, 1800);
    } catch (err: any) {
      setAddAdminLoading(false);
      setAddAdminFeedback({ type: "error", text: err.message || "An unexpected error occurred." });
    }
  }


  // Filter Logic
  const filteredUsers = users.filter((u) => {
    // Search query match
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      u.full_name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    const isSuper = u.admin_role === "super_admin" || (u.is_admin && u.admin_role !== "helper_admin");
    const isHelper = u.admin_role === "helper_admin";
    const isSuspended = u.is_suspended === true;
    const isOrganizer = (u.created_circles_count ?? 0) > 0;

    switch (filterTab) {
      case "super_admin":
        return isSuper;
      case "helper_admin":
        return isHelper;
      case "organizer":
        return isOrganizer;
      case "member":
        return !isSuper && !isHelper;
      case "suspended":
        return isSuspended;
      default:
        return true;
    }
  });

  // Action Dispatcher (Suspend, Unsuspend, Promote, Demote)
  async function handleUserAction(action: "suspend" | "unsuspend" | "promote_helper" | "demote_helper") {
    if (!selectedUser) return;

    const actionText =
      action === "suspend"
        ? `SUSPEND "${selectedUser.full_name}"? They will be locked out of logging in and participating in circles.`
        : action === "unsuspend"
        ? `REACTIVATE "${selectedUser.full_name}"?`
        : action === "promote_helper"
        ? `Promote "${selectedUser.full_name}" to HELPER ADMIN (Moderator)?`
        : `Demote "${selectedUser.full_name}" to regular member?`;

    if (!confirm(`Are you sure you want to ${actionText}`)) {
      return;
    }

    setActionLoading(true);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          action,
        }),
      });

      const data = await res.json();
      setActionLoading(false);

      if (!res.ok) {
        setActionMessage({ type: "error", text: data.error || "Action failed." });
        return;
      }

      setActionMessage({ type: "success", text: data.message });

      // Update local state
      setSelectedUser((prev) => {
        if (!prev) return null;
        if (action === "suspend") return { ...prev, is_suspended: true };
        if (action === "unsuspend") return { ...prev, is_suspended: false };
        if (action === "promote_helper") return { ...prev, admin_role: "helper_admin", is_admin: true };
        if (action === "demote_helper") return { ...prev, admin_role: "none", is_admin: false };
        return prev;
      });

      router.refresh();
    } catch (err: any) {
      setActionLoading(false);
      setActionMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    }
  }

  // Super Admin Simulation Mode (Read-Only Preview)
  async function handleSimulateUser(userId: string) {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMessage({ type: "error", text: data.error || "Failed to start simulation." });
        setActionLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setActionLoading(false);
      setActionMessage({ type: "error", text: err.message || "Failed to start simulation." });
    }
  }


  // Counts for tabs
  const superCount = users.filter((u) => u.admin_role === "super_admin" || (u.is_admin && u.admin_role !== "helper_admin")).length;
  const helperCount = users.filter((u) => u.admin_role === "helper_admin").length;
  const suspendedCount = users.filter((u) => u.is_suspended === true).length;

  return (
    <div className="space-y-4">
      {/* Search & Action Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members by name, email, or phone..."
              className="h-10 pl-9 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 border-[#e1e8f0] dark:border-sky-500/20 text-xs"
            />
          </div>

          {/* Super Admin Action: Appoint Helper Admin Button */}
          {currentOperator.isSuperAdmin && (
            <Button
              onClick={() => {
                setShowAddAdminModal(true);
                setAddAdminFeedback(null);
              }}
              className="h-10 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-[#0284C7] hover:from-sky-700 hover:to-[#0369A1] text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Shield className="h-3.5 w-3.5 text-sky-200" />
              + Appoint Helper Admin
            </Button>
          )}
        </div>


        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all shrink-0 ${
              filterTab === "all"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "bg-[#f4f7fb] dark:bg-sky-950/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({users.length})
          </button>

          <button
            onClick={() => setFilterTab("super_admin")}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all shrink-0 flex items-center gap-1 ${
              filterTab === "super_admin"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "bg-[#f4f7fb] dark:bg-sky-950/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crown className="h-3 w-3 text-amber-500" />
            Super Admins ({superCount})
          </button>

          <button
            onClick={() => setFilterTab("helper_admin")}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all shrink-0 flex items-center gap-1 ${
              filterTab === "helper_admin"
                ? "bg-sky-500 text-white shadow-xs"
                : "bg-[#f4f7fb] dark:bg-sky-950/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="h-3 w-3 text-sky-400" />
            Helper Admins ({helperCount})
          </button>

          <button
            onClick={() => setFilterTab("organizer")}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all shrink-0 flex items-center gap-1 ${
              filterTab === "organizer"
                ? "bg-[#0F2744] text-white dark:bg-sky-800 shadow-xs"
                : "bg-[#f4f7fb] dark:bg-sky-950/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <CircleDollarSign className="h-3 w-3 text-[#0284C7]" />
            Organizers
          </button>

          <button
            onClick={() => setFilterTab("member")}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all shrink-0 ${
              filterTab === "member"
                ? "bg-[#0284C7] text-white shadow-xs"
                : "bg-[#f4f7fb] dark:bg-sky-950/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            Members
          </button>

          <button
            onClick={() => setFilterTab("suspended")}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all shrink-0 flex items-center gap-1 ${
              filterTab === "suspended"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-[#f4f7fb] dark:bg-sky-950/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserX className="h-3 w-3 text-red-500" />
            Suspended ({suspendedCount})
          </button>
        </div>
      </div>

      {/* User Directory List */}
      <div className="space-y-2.5">
        {filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted-foreground">
            No members match your search or filter.
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isSuper = u.admin_role === "super_admin" || (u.is_admin && u.admin_role !== "helper_admin");
            const isHelper = u.admin_role === "helper_admin";
            const isSuspended = u.is_suspended === true;

            return (
              <div
                key={u.id}
                onClick={() => {
                  setSelectedUser(u);
                  setActionMessage(null);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSuspended
                    ? "bg-red-950/20 border-red-500/30 hover:border-red-500/60"
                    : isSuper
                    ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60"
                    : "bg-[#f4f7fb] dark:bg-sky-950/30 border-[#e1e8f0] dark:border-sky-500/15 hover:border-sky-400/40"
                }`}
              >
                {/* Left: Avatar & Identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#0284C7] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {u.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    {isSuspended && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold">
                        ✕
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {u.full_name}
                      </p>
                      {isSuper && (
                        <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30 text-[9px] font-black px-1.5 py-0">
                          <Crown className="h-2.5 w-2.5 mr-0.5" />
                          Super Admin
                        </Badge>
                      )}
                      {isHelper && (
                        <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-300 border-sky-500/30 text-[9px] font-black px-1.5 py-0">
                          <Shield className="h-2.5 w-2.5 mr-0.5" />
                          Helper Admin
                        </Badge>
                      )}
                      {isSuspended && (
                        <Badge className="bg-red-500/20 text-red-600 dark:text-red-300 border-red-500/30 text-[9px] font-black px-1.5 py-0">
                          Suspended
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                    <p className="text-[10px] text-muted-foreground/80 truncate">
                      {u.phone ? `Phone: ${u.phone}` : "No phone registered"}
                    </p>
                  </div>
                </div>

                {/* Right: Trust & Actions */}
                <div className="text-right shrink-0 space-y-1">
                  <Badge
                    className={`text-[9px] px-2 py-0.5 font-bold border-0 ${
                      u.trust_score >= 70
                        ? "bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300"
                        : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    Trust: {isSuper ? 100 : u.trust_score}/100
                  </Badge>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {isSuper
                      ? "Admin Verified"
                      : isHelper
                      ? "Helper Verified"
                      : u.kyc_tier >= 2
                      ? "Tier 1 Verified"
                      : "Unverified"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* DETAILED USER DOSSIER & ACTION MODAL                                      */}
      {/* ========================================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#071322] border border-sky-500/30 p-6 sm:p-7 shadow-2xl text-white space-y-5">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-sky-950/60 border border-sky-500/20 text-muted-foreground hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* User Header */}
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#0284C7] text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                {selectedUser.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-black text-white truncate">
                    {selectedUser.full_name}
                  </h2>
                  {selectedUser.is_suspended && (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/40 text-[9px] font-bold">
                      Suspended
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-sky-200/90 font-medium truncate">{selectedUser.email}</p>
              </div>
            </div>

            {/* Dossier Metric Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-sky-950/60 border border-sky-500/20 text-center">
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold">KYC Status</span>
                <p className="text-xs font-black text-sky-300 mt-0.5">
                  {selectedUser.admin_role === "super_admin" || (selectedUser.is_admin && selectedUser.admin_role !== "helper_admin")
                    ? "Admin"
                    : selectedUser.kyc_tier >= 2
                    ? "Tier 1"
                    : "Unverified"}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold">Trust Rating</span>
                <p className="text-xs font-black text-emerald-400 mt-0.5">
                  {selectedUser.is_admin ? 100 : selectedUser.trust_score}/100
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold">Role</span>
                <p className="text-xs font-black text-amber-300 mt-0.5">
                  {selectedUser.admin_role === "super_admin" || (selectedUser.is_admin && selectedUser.admin_role !== "helper_admin")
                    ? "Super Admin"
                    : selectedUser.admin_role === "helper_admin"
                    ? "Helper Admin"
                    : "Member"}
                </p>
              </div>
            </div>

            {/* Profile Meta Details */}
            <div className="space-y-2 text-xs text-sky-100/80 bg-sky-950/40 p-3.5 rounded-2xl border border-sky-500/15">
              <div className="flex items-center justify-between py-1 border-b border-sky-500/10">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-sky-400" /> Phone:
                </span>
                <span className="font-semibold text-white">{selectedUser.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-sky-500/10">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-sky-400" /> Joined:
                </span>
                <span className="font-semibold text-white">
                  {new Date(selectedUser.created_at).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-400" /> Account Status:
                </span>
                <span className={`font-bold ${selectedUser.is_suspended ? "text-red-400" : "text-emerald-400"}`}>
                  {selectedUser.is_suspended ? "Paused / Suspended" : "Active & Operational"}
                </span>
              </div>
            </div>

            {/* Notification alert message */}
            {actionMessage && (
              <div
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                  actionMessage.type === "success"
                    ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
                    : "bg-red-950/80 border-red-500/40 text-red-200"
                }`}
              >
                {actionMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                )}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Governance Action Controls */}
            <div className="space-y-2.5 pt-1 border-t border-sky-500/20">
              {/* IMMUNITY RULE: Super Admin Protected */}
              {selectedUser.admin_role === "super_admin" || (selectedUser.is_admin && selectedUser.admin_role !== "helper_admin") ? (
                <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Security Immunity: Super Admin accounts cannot be suspended or altered.</span>
                </div>
              ) : (
                <>
                  {/* Suspension Toggle */}
                  {selectedUser.is_suspended ? (
                    <Button
                      onClick={() => handleUserAction("unsuspend")}
                      disabled={actionLoading}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xs"
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                      <span>Reactivate Account</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUserAction("suspend")}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full h-11 border-red-500/40 bg-red-950/40 hover:bg-red-950/70 text-red-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xs"
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4 text-red-400" />}
                      <span>Suspend Account (Pause Access)</span>
                    </Button>
                  )}

                  {/* Super Admin-Only Role Management & Simulation */}
                  {currentOperator.isSuperAdmin && (
                    <div className="pt-1 space-y-2">
                      <Button
                        onClick={() => handleSimulateUser(selectedUser.id)}
                        disabled={actionLoading}
                        variant="outline"
                        className="w-full h-10 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all"
                      >
                        {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5 text-amber-500" />}
                        <span>Simulate Member View (Read-Only Preview)</span>
                      </Button>


                      {selectedUser.admin_role === "helper_admin" ? (
                        <Button
                          onClick={() => handleUserAction("demote_helper")}
                          disabled={actionLoading}
                          variant="ghost"
                          className="w-full h-10 text-xs text-muted-foreground hover:text-red-400 hover:bg-red-950/30 rounded-2xl"
                        >
                          Revoke Helper Admin Privileges
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleUserAction("promote_helper")}
                          disabled={actionLoading}
                          className="w-full h-10 bg-gradient-to-r from-sky-600 to-[#0284C7] hover:from-sky-700 hover:to-[#0369A1] text-white font-bold text-xs rounded-2xl shadow-xs"
                        >
                          <Shield className="h-3.5 w-3.5 mr-1.5" />
                          Promote to Helper Admin (Moderator)
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIRECT APPOINT HELPER ADMIN MODAL (BY EMAIL OR SELECTION)                */}
      {/* ========================================================================= */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#071322] border border-sky-500/30 p-6 sm:p-7 shadow-2xl text-white space-y-5">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowAddAdminModal(false);
                setAddAdminFeedback(null);
              }}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-sky-950/60 border border-sky-500/20 text-muted-foreground hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">
                  Appoint Helper Admin
                </h2>
                <p className="text-xs text-sky-200/80 font-medium">
                  Delegate operational oversight & fraud moderation
                </p>
              </div>
            </div>

            {/* Permissions Summary Card */}
            <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/15 space-y-2 text-xs">
              <p className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                Helper Admin Privileges
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Audit savings circles & freeze suspicious pools
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Inspect member trust ratings & KYC dossiers
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Suspend non-compliant or fraudulent accounts
                </li>
                <li className="flex items-center gap-1.5 text-red-400/80">
                  <X className="h-3 w-3" /> Cannot alter database keys or Super Admin accounts
                </li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateHelperAdmin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-sky-200">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="h-10 rounded-2xl bg-sky-950/60 border-sky-500/20 text-xs text-white placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-sky-200">
                  Admin Email Address <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. amina.moderator@kadashe.ng"
                  className="h-10 rounded-2xl bg-sky-950/60 border-sky-500/20 text-xs text-white placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-sky-200">
                  Phone Number <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Input
                  type="tel"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="h-10 rounded-2xl bg-sky-950/60 border-sky-500/20 text-xs text-white placeholder:text-muted-foreground"
                />
              </div>

              {/* Feedback Alert */}
              {addAdminFeedback && (
                <div
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                    addAdminFeedback.type === "success"
                      ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
                      : "bg-red-950/80 border-red-500/40 text-red-200"
                  }`}
                >
                  {addAdminFeedback.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <span>{addAdminFeedback.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={addAdminLoading || !newAdminEmail.trim() || !newAdminName.trim()}
                className="w-full h-11 bg-gradient-to-r from-sky-600 to-[#0284C7] hover:from-sky-700 hover:to-[#0369A1] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md mt-2"
              >
                {addAdminLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating & Provisioning Account...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Create Helper Admin Account
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

