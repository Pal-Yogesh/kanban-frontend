import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-background to-secondary p-6 shadow-sm">
      <div className="absolute inset-0 opacity-60 pointer-events-none" style={{ backgroundImage: "var(--gradient-primary)" }} />
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            Full Stack Assignment
          </h1>
          <p className="text-muted-foreground mt-1">A delightful Kanban to keep your work flowing.</p>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{user.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Please log in to use the Kanban board
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
