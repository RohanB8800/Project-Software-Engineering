import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      login(response.data.user);
      toast({
        title: t('login.success.title', 'Login Successful'),
        description: t('login.success.description', 'Welcome back!'),
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: t('login.error.title', 'Login Failed'),
        description: error.response?.data?.message || t('login.error.description', 'Invalid credentials or an error occurred.'),
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
            <CardTitle className="text-2xl">{t('login.title', 'Sign in to your account')}</CardTitle>
            <CardDescription>
              {t('login.description', 'Enter your email and password to sign in.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('login.email', 'Email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder', 'name@example.com')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('login.password', 'Password')}</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                {t('login.signIn', 'Sign in')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('login.noAccount', "Don't have an account?")} <Link to="/register" className="underline">{t('login.signUp', 'Sign up')}</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;