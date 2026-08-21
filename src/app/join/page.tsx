import { redirect } from "next/navigation";

export default async function JoinCodeRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params?.code?.trim();

  if (code) {
    const cleanCode = code.toUpperCase();
    redirect(`/join/${encodeURIComponent(cleanCode)}`);
  }

  redirect("/circles");
}
