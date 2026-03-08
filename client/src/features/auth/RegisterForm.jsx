import { useState } from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import PasswordRequirements from './PasswordRequirements';

function RegisterForm() {
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <form>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            required
          />

          {passwordFocused && <PasswordRequirements password={password} />}
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;
