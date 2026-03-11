import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/useAuth';
import SunIcon from '@/assets/light-mode.svg?react';

function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="w-full bg-primary text-primary-foreground border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        <NavLink to="/" className="text-2xl font-semibold">
          Testly
        </NavLink>

        <div className="ml-auto flex items-center gap-4">
          {/* <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:opacity-80 transition-opacity"
          >
            <SunIcon className="h-8 w-8 text-primary-foreground" />
          </Button> */}

          <Button
            className="text-lg font-medium hover:opacity-80 transition-opacity"
            onClick={logout}
          >
            Log out
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
