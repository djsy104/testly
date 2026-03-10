import RegisterForm from '../features/auth/RegisterForm';
import AuthCard from '@/features/auth/AuthCard';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/useAuth';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e, { name, email, password }) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <AuthCard
        title="Create an account"
        description="Enter your info below to create your account."
        action={
          <Button asChild variant="link">
            <Link to="/login" className="text-base">
              Login
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

            <Button type="submit" className="w-full" form="register-form" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create account'}
            </Button>
          </div>
        }
      >
        <RegisterForm onSubmit={handleSubmit} submitting={submitting} />
      </AuthCard>
    </div>
  );
}

export default Register;
