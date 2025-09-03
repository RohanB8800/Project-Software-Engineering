import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const EditProfilePage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // For changing password
  const [notificationPreferences, setNotificationPreferences] = useState(false);
  const [theme, setTheme] = useState('light');
  const [otherSetting, setOtherSetting] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setNotificationPreferences(user.notificationPreferences || false);
      setTheme(user.theme || 'light');
      setOtherSetting(user.otherSetting || '');
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ 
        name, 
        email, 
        password: password || undefined, 
        notificationPreferences, 
        theme, 
        otherSetting 
      }); // Only update password if provided
      toast({
        title: t('editProfile.successTitle'),
        description: t('editProfile.successDescription'),
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: t('editProfile.errorTitle'),
        description: error.response?.data?.error || error.message || t('editProfile.errorDescription'),
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    console.log("User not authenticated, navigating to login...");
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Show a loading message instead of null
  }

  // Defensive check: If isAuthenticated is true, user should not be null.
  // But if it is, show loading to prevent errors.
  if (!user) {
    console.log("User data is null even though isAuthenticated is true. This is unexpected. Showing loading...");
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  console.log("isAuthenticated:", isAuthenticated);
  console.log("User:", user);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('Profile Edit')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('')}
            </p>
          </div>

          <Card className="p-6">
            <CardHeader>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">{t('Edit Name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('Edit Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t('Change Password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('editProfile.passwordPlaceholder')}
                  />
                  <p className="text-sm text-gray-500 mt-1">{t('Password Hint: should contain at least 8 Characters')}</p>
                </div>
                <Button type="submit" className="w-full">
                  {t('Save Changes')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="p-6 mt-8">
            <CardHeader>
              <CardTitle>{t('settings.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notificationPreferences"
                    checked={notificationPreferences}
                    onChange={(e) => setNotificationPreferences(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="notificationPreferences">{t('settings.notificationLabel')}</Label>
                </div>
                <p className="text-sm text-gray-500 mt-1">{t('settings.notificationHint')}</p>
              </div>
              <div>
                <Label htmlFor="theme">{t('settings.themeLabel')}</Label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => {
                    setTheme(e.target.value);
                    updateUserTheme(e.target.value);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="light">{t('settings.themeLight')}</option>
                  <option value="dark">{t('settings.themeDark')}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="otherSetting">{t('settings.otherSettingLabel')}</Label>
                <Input
                  id="otherSetting"
                  type="text"
                  value={otherSetting}
                  onChange={(e) => setOtherSetting(e.target.value)}
                  placeholder={t('settings.otherSettingPlaceholder')}
                />
                <p className="text-sm text-gray-500 mt-1">{t('settings.otherSettingHint')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
