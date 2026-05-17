import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { SplashAndOnboarding } from "@/components/SplashAndOnboarding";
import { AuthProvider } from "@/hooks/use-finova-store";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "FinNova" },
      { name: "description", content: "Track expenses, manage budgets, and get smart spending insights in INR." },
      { name: "author", content: "FinNova" },
      { property: "og:title", content: "FinNova" },
      { property: "og:description", content: "Track expenses, manage budgets, and get smart spending insights in INR." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#6366f1" },
      { name: "twitter:title", content: "FinNova" },
      { name: "twitter:description", content: "Track expenses, manage budgets, and get smart spending insights in INR." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/tLQJqM6Gk8dLGtwODTn10q3sTgh2/social-images/social-1779028961444-FinNova_exceptional_.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/tLQJqM6Gk8dLGtwODTn10q3sTgh2/social-images/social-1779028961444-FinNova_exceptional_.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@500;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <AuthProvider>
      <SplashAndOnboarding>
        <div className="mx-auto max-w-lg min-h-screen bg-background">
          <Outlet />
          {!isLogin && <BottomNav />}
        </div>
      </SplashAndOnboarding>
    </AuthProvider>
  );
}
