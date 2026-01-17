import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Welcome to Fast Next.js CLI</h1>
        <p className="text-lg text-muted-foreground">
          Get started by editing src/app/page.tsx
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
