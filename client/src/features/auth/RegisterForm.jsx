import { useState } from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import PasswordRequirements from './PasswordRequirements';

function RegisterForm({ onSubmit, submitting = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <form id="register-form" onSubmit={(e) => onSubmit(e, { name, email, password })}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10"
            autoComplete="name"
            disabled={submitting}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10"
            autoComplete="email"
            disabled={submitting}
          />
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
            className="h-10"
            autoComplete="new-password"
            disabled={submitting}
          />

          {passwordFocused && <PasswordRequirements password={password} />}
        </div>

        {/* so pressing Enter submits even if footer button exists */}
        <input type="submit" hidden disabled={submitting} />
      </div>
    </form>
  );
}

export default RegisterForm;
