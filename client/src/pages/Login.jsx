import LoginForm from '../features/auth/LoginForm';
import AuthCard from '@/features/auth/AuthCard';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e, { email, password }) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.response?.data?.message || 'Login failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <AuthCard
        title="Login to your account"
        description="Enter your credentials to login"
        action={
          <Button asChild variant="link">
            <Link to="/register" className="text-base">
              Sign Up
            </Link>
          </Button>
        }
        footer={
          <div className="w-full space-y-3">
            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="w-full" form="login-form" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Login'}
            </Button>
          </div>
        }
      >
        <LoginForm onSubmit={handleSubmit} submitting={submitting} />
      </AuthCard>
    </div>
  );
}

export default Login;
