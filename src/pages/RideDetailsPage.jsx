import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Star, Euro, Car, MessageCircle, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import MapView from '@/components/MapView';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const RideDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ride, setRide] = useState(null);
  const { t } = useTranslation();
  const { bookRide } = useAuth();

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rides/${id}`);
        setRide(response.data);
      } catch (error) {
        console.error('Error fetching ride details:', error);
        toast({
          title: "Error",
          description: "Failed to load ride details. Please try again later.",
          variant: "destructive",
        });
        navigate('/find-ride'); // Redirect if ride not found or error occurs
      }
    };
    fetchRideDetails();
  }, [id, navigate, toast]);

  const handleBookRide = () => {
    bookRide(ride);
    toast({
      title: "🎉 Ride booked successfully!",
      description: "You can view your booked rides in your profile.",
    });
  };

  const handleContactDriver = () => {
    toast({
      title: t('toast.notImplemented'),
    });
  };

  const handleCallDriver = () => {
    toast({
      title: t('toast.notImplemented'),
    });
  };

  const getTrustScoreClass = (score) => {
    switch (score) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrustScoreText = (score) => {
    switch (score) {
      case 'high': return t('findRide.trustScoreHigh');
      case 'medium': return t('findRide.trustScoreMedium');
      case 'low': return t('findRide.trustScoreLow');
      default: return t('findRide.trustScoreMedium');
    }
  };

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚗</div>
          <p className="text-gray-600">{t('rideDetails.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('rideDetails.back')}
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {ride.from} → {ride.to}
                      </h1>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{ride.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{ride.departure}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{t('rideDetails.seatsAvailable', { count: ride.seats })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">€{ride.price}</div>
                      <div className="text-sm text-gray-500">{t('rideDetails.perPerson')}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{ride.duration}</div>
                      <div className="text-sm text-gray-600">{t('rideDetails.duration')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{ride.distance}</div>
                      <div className="text-sm text-gray-600">{t('rideDetails.distance')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">€{(ride.price / parseFloat(ride.distance.split(' ')[0]) * 100).toFixed(1)}</div>
                      <div className="text-sm text-gray-600">{t('rideDetails.pricePerKm')}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                      {t('rideDetails.routeDetails')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">{t('rideDetails.stops')}</h4>
                        <div className="space-y-2">
                          {ride.routeDetails.stops.map((stop, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-green-500' : 
                                index === ride.routeDetails.stops.length - 1 ? 'bg-red-500' : 'bg-blue-500'
                              }`}></div>
                              <span className="text-gray-700">{stop}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t('rideDetails.routeDescription')}</h4>
                        <p className="text-gray-700">{ride.routeDetails.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="mr-2 h-5 w-5 text-blue-600" />
                      {t('rideDetails.carDetails')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">{t('rideDetails.vehicle')}</h4>
                        <p className="text-gray-700">{ride.car.model} ({ride.car.year})</p>
                        <p className="text-gray-600 text-sm">Farbe: {ride.car.color}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t('rideDetails.features')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {ride.car.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('rideDetails.additionalInfo')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">{t('rideDetails.description')}</h4>
                        <p className="text-gray-700">{ride.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t('rideDetails.rules')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {ride.rules.map((rule, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {rule}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6">
                  <div className="text-center mb-4">
                    <div className="relative inline-block mb-3">
                      <img  
                        alt={`${ride.driver.name} Profilbild`}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
                       src={ride.driver.avatar} />
                      {ride.driver.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{ride.driver.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{t('rideDetails.memberSince', { date: ride.driver.memberSince })}</p>
                    
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{ride.driver.rating}</span>
                      <span className="text-gray-500 text-sm">({ride.driver.trips} {t('rideDetails.rides')})</span>
                    </div>

                    <Badge className={`mb-4 ${getTrustScoreClass(ride.trustScore)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getTrustScoreText(ride.trustScore)}
                    </Badge>

                    <p className="text-gray-700 text-sm mb-4">{ride.driver.bio}</p>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleBookRide}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                    >
                      {t('rideDetails.bookRide')}
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    {t('rideDetails.mapTitle')}
                  </h3>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapView rides={[ride]} />
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsPage;