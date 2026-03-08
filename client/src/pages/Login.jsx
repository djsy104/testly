import { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../features/auth/LoginForm';
import AuthCard from '@/features/auth/AuthCard';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <AuthCard
        title="Login to your account"
        description="Enter your credentials to login"
        action={
          <Button asChild variant="link">
            <Link to="/register" className="text-base text-text-950">
              Sign Up
            </Link>
          </Button>
        }
        footer={
          <Button type="submit" className="w-full" form="register-form">
            Login
          </Button>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}

export default Login;
