import { AuroraBackground } from "@/components/glass/aurora-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden p-4">
      <AuroraBackground />
      {children}
    </div>
  );
}
