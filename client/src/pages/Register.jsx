import { useState, useEffect } from 'react';
import axios from 'axios';
import RegisterForm from '../features/auth/RegisterForm';
import AuthCard from '@/features/auth/AuthCard';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <AuthCard
        title="Create an account"
        description="Enter your info below to create your account."
        action={
          <Button asChild variant="link">
            <Link to="/login" className="text-base text-text-950">
              Login
            </Link>
          </Button>
        }
        footer={
          <>
            <Button type="submit" className="w-full" form="register-form">
              Create account
            </Button>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}

export default Register;
