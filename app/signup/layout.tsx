import { GuestOnly } from "@/lib/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GuestOnly>{children}</GuestOnly>;
}
