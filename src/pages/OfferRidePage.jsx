import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, Euro, Car, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OfferRidePage = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    price: '',
    description: '',
    carModel: '',
    recurring: false
  });
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: t('offerRide.loginRequired.title'),
        description: t('offerRide.loginRequired.description'),
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newRide = {
        from: formData.from,
        to: formData.to,
        date: formData.date,
        departure: formData.time,
        price: parseFloat(formData.price) || 0,
        seats: parseInt(formData.seats),
        duration: 'N/A',
        distance: 'N/A',
        userId: user._id, // Send user ID as userId
        driver: {
          name: user.name,
          rating: user.rating || 0,
          trustScore: user.trustScore || 'low',
          avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
          trips: user.trips || 0,
          memberSince: user.memberSince || new Date().toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' }),
          verified: user.verified || false,
          bio: user.bio || t('offerRide.newUserBio')
        },
        car: {
          model: formData.carModel || t('offerRide.notSpecified'),
          year: new Date().getFullYear(),
          color: t('offerRide.notSpecified'),
          features: [t('offerRide.nonSmoker')]
        },
        description: formData.description,
        rules: [t('offerRide.punctuality')],
        // Mock route for map display. In a real app, you'd get this from a mapping service.
        route: [[49.378, 10.179], [49.791, 9.938]], 
        routeDetails: { stops: [formData.from, formData.to], description: t('offerRide.userAddedRide') }
      };
      
      const response = await axios.post('http://localhost:5000/api/rides', newRide);
      console.log('Ride created:', response.data);

      toast({
        title: `🎉 ${t('offerRide.success.title')}`,
        description: t('offerRide.success.description'),
      });

      setFormData({
        from: '',
        to: '',
        date: '',
        time: '',
        seats: 1,
        price: '',
        description: '',
        carModel: '',
        recurring: false
      });
      localStorage.setItem('newRideAdded', 'true'); // Set flag
      navigate('/find-ride'); // Navigate to find-ride page after successful submission
    } catch (error) {
      console.error('Error creating ride:', error);
      toast({
        title: t('offerRide.errorTitle'),
        description: error.response?.data?.error || error.message || t('offerRide.errorDescription'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('offerRide.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('offerRide.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="mr-2 h-6 w-6 text-blue-600" />
                    {t('offerRide.routeInfo')}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('offerRide.fromLabel')}
                      </Label>
                      <Input
                        id="from"
                        placeholder={t('offerRide.fromPlaceholder')}
                        value={formData.from}
                        onChange={(e) => handleInputChange('from', e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="to" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('offerRide.toLabel')}
                      </Label>
                      <Input
                        id="to"
                        placeholder={t('offerRide.toPlaceholder')}
                        value={formData.to}
                        onChange={(e) => handleInputChange('to', e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-blue-600" />
                    {t('offerRide.dateTime')}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('offerRide.dateLabel')}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('offerRide.timeLabel')}
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Car className="mr-2 h-6 w-6 text-blue-600" />
                    {t('offerRide.rideDetails')}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="seats" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('offerRide.seatsLabel')}
                      </Label>
                      <Input
                        id="seats"
                        type="number"
                        min="1"
                        max="7"
                        value={formData.seats}
                        onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('offerRide.priceLabel')}
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.50"
                        placeholder={t('offerRide.pricePlaceholder')}
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="carModel" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('offerRide.carModelLabel')}
                      </Label>
                      <Input
                        id="carModel"
                        placeholder={t('offerRide.carModelPlaceholder')}
                        value={formData.carModel}
                        onChange={(e) => handleInputChange('carModel', e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('offerRide.extraInfoLabel')}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t('offerRide.extraInfoPlaceholder')}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-semibold"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    {t('offerRide.publishButton')}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('offerRide.tipsTitle')}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('offerRide.tip1')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('offerRide.tip2')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('offerRide.tip3')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('offerRide.tip4')}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OfferRidePage;