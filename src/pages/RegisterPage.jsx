import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: t('register.passwordMismatch.title', 'Passwords do not match'),
        description: t('register.passwordMismatch.description', 'Please check your passwords and try again.'),
        variant: 'destructive',
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
      });
      login(response.data.user);
      toast({
        title: t('register.success.title', 'Registration Successful'),
        description: t('register.success.description', 'You have successfully created an account.'),
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: t('register.error.title', 'Registration Failed'),
        description: error.response?.data?.error || t('register.error.description', 'An error occurred during registration.'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t('register.title', 'Create an account')}</CardTitle>
            <CardDescription>
              {t('register.description', 'Enter your information to create an account.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('register.name', 'Name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('register.namePlaceholder', 'John Doe')}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('register.email', 'Email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('register.emailPlaceholder', 'name@example.com')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('register.password', 'Password')}</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">{t('register.confirmPassword', 'Confirm Password')}</Label>
                <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                {t('register.createAccount', 'Create account')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('register.alreadyHaveAccount', 'Already have an account?')} <Link to="/login" className="underline">{t('register.signIn', 'Sign in')}</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RegisterPage;