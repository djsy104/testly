import { useState } from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

function LoginForm({ onSubmit, submitting = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form id="login-form" onSubmit={(e) => onSubmit(e, { email, password })}>
      <div className="flex flex-col gap-6">
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
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10"
            autoComplete="current-password"
          />
        </div>

        <input type="submit" hidden disabled={submitting} />
      </div>
    </form>
  );
}

export default LoginForm;
