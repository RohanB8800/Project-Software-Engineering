import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Removed import of motion from framer-motion to isolate warning
import { User, Star, Car, MapPin, Calendar, Settings, Award, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import RideMap from '@/components/RideMap';

const ProfilePage = () => {
  const { user, isAuthenticated, bookedRides = [], cancelRide, cancelOfferedRide } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalRides: 0,
    rating: 0,
    trustScore: 'low',
    savedMoney: 0,
    co2Saved: 0
  });
  const [myOfferedRides, setMyOfferedRides] = useState([]);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const fetchOfferedRides = async () => {
    if (!user || !user._id) {
      console.warn("ProfilePage: User object or _id is missing. Cannot fetch offered rides.");
      setMyOfferedRides([]);
      setUserStats(prevStats => ({
        ...prevStats,
        totalRides: bookedRides.length,
        offeredRides: 0,
        rating: bookedRides.length > 0 ? 4.9 : 0,
        trustScore: bookedRides.length > 10 ? 'high' : (bookedRides.length > 3 ? 'medium' : 'low'),
        savedMoney: (bookedRides.length * 15).toFixed(2),
        co2Saved: (bookedRides.length * 2.3).toFixed(1)
      }));
      return;
    }

    try {
      console.log(`Fetching offered rides for userId: ${user._id}`);
      console.log("ProfilePage: Fetching offered rides for userId:", user._id);
      const response = await axios.get(`http://localhost:5000/api/rides?userId=${user._id}`);
      setMyOfferedRides(response.data);
      const offeredRidesCount = response.data.length;

      setUserStats(prevStats => ({
        ...prevStats,
        totalRides: bookedRides.length + offeredRidesCount,
        offeredRides: offeredRidesCount,
        rating: (bookedRides.length + offeredRidesCount) > 0 ? 4.9 : 0,
        trustScore: (bookedRides.length + offeredRidesCount) > 10 ? 'high' : ((offeredRidesCount) > 3 ? 'medium' : 'low'),
        savedMoney: ((bookedRides.length + offeredRidesCount) * 15).toFixed(2),
        co2Saved: ((bookedRides.length + offeredRidesCount) * 2.3).toFixed(1)
      }));
    } catch (error) {
      console.error('Error fetching offered rides:', error);
      toast({
        title: "Error",
        description: "Failed to load your offered rides.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setUserStats({
      totalRides: bookedRides.length,
      rating: bookedRides.length > 0 ? 4.9 : 0,
      trustScore: bookedRides.length > 10 ? 'high' : (bookedRides.length > 3 ? 'medium' : 'low'),
      savedMoney: (bookedRides.length * 15).toFixed(2),
      co2Saved: (bookedRides.length * 2.3).toFixed(1)
    });

  fetchOfferedRides();

  }, [isAuthenticated, navigate, user, bookedRides, toast]);

  const handleCancelRide = async (rideId) => {
    try {
      await cancelRide(rideId);
      toast({
        title: "Ride Cancelled",
        description: "Your ride has been successfully cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelOfferedRide = async (rideId) => {
    try {
      await cancelOfferedRide(rideId);
      toast({
        title: "Offered Ride Cancelled",
        description: "Your offered ride has been successfully cancelled.",
      });
      // Re-fetch offered rides to update the list
      fetchOfferedRides();
    } catch (error) {
      console.error('Error cancelling offered ride:', error);
      toast({
        title: "Error",
        description: "Failed to cancel offered ride. Please try again.",
        variant: "destructive",
      });
    }
  };
    const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleSettingsClick = () => {
    navigate('/edit-profile');
  };

  const getTrustScoreColor = (score) => {
    switch (score) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrustScoreText = (score) => {
    switch (score) {
      case 'high': return t('profile.trustScoreHigh');
      case 'medium': return t('profile.trustScoreMedium');
      case 'low': return t('profile.trustScoreLow');
      default: return t('profile.trustScoreMedium');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Preprocess bookedRides to filter out rides missing valid _id or incomplete data
  const processedBookedRides = bookedRides.filter(ride => {
    return ride._id && ride.from && ride.to && ride.date;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('profile.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('profile.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      alt="Your profile picture"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{userStats.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({userStats.totalRides} {t('profile.reviews')})</span>
                  </div>

                  <Badge className={`mb-6 ${getTrustScoreColor(userStats.trustScore)}`}>
                    <Award className="h-4 w-4 mr-1" />
                    {getTrustScoreText(userStats.trustScore)}
                  </Badge>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleEditProfile}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {t('Edit Profile')}
                    </Button>
                    <Button 
                      onClick={handleSettingsClick}
                      variant="outline" 
                      className="w-full"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {t('profile.settings')}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium mb-1">{t('profile.totalRides')}</p>
                      <p className="text-3xl font-bold text-blue-900">{userStats.totalRides}</p>
                    </div>
                    <Car className="h-12 w-12 text-blue-600" />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium mb-1">{t('profile.offeredRides')}</p>
                      <p className="text-3xl font-bold text-green-900">{userStats.offeredRides}</p>
                    </div>
                    <MapPin className="h-12 w-12 text-green-600" />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium mb-1">{t('profile.savedMoney')}</p>
                      <p className="text-3xl font-bold text-purple-900">€{userStats.savedMoney}</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-purple-600" />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 font-medium mb-1">{t('profile.co2Saved')}</p>
                      <p className="text-3xl font-bold text-emerald-900">{userStats.co2Saved}kg</p>
                    </div>
                    <div className="text-4xl">🌱</div>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                      {t('profile.myOfferedRides')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {myOfferedRides.length > 0 ? (
                      <div className="space-y-4">
                        {myOfferedRides.map((ride, index) => (
                          <div key={ride._id ? `offered-${ride._id}` : `offered-index-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Car className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {ride.from} → {ride.to}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(ride.date).toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} @ {ride.departure}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link to={`/ride/${ride._id}`}>
                                <Button variant="outline" size="sm">{t('findRide.viewRide')}</Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelOfferedRide(ride._id)}
                              >
                                {t('profile.cancelRide')}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">{t('profile.noRidesOffered')}</p>
                        <Link to="/offer-ride">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('profile.offerOneNow')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-green-600" />
                      My Booked Rides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {processedBookedRides.length > 0 ? (
                      <div className="space-y-4">
                        {console.log("Booked Rides:", processedBookedRides)}
                        {processedBookedRides.map((ride, index) => {
                          return (
                            <div key={`booked-${ride._id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="p-2 bg-green-100 rounded-full">
                                  <Car className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {ride.from} → {ride.to}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(ride.date).toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} @ {ride.departure}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Link to={`/ride/${ride._id}`}>
                                  <Button variant="outline" size="sm">{t('findRide.viewRide')}</Button>
                                </Link>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    console.log("Attempting to cancel booked ride:", ride);
                                    handleCancelRide(ride._id);
                                  }}
                                >
                                  {t('profile.cancelRide')}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't booked any rides yet.</p>
                        <Link to="/find-ride">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Find a Ride
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-yellow-500" />
                      {t('profile.achievements')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: t('profile.achFirstRide'), description: t('profile.achFirstRideDesc'), earned: userStats.totalRides >= 1 },
                        { title: t('profile.achReliableDriver'), description: t('profile.achReliableDriverDesc'), earned: userStats.totalRides >= 5 },
                        { title: t('profile.achEcoWarrior'), description: t('profile.achEcoWarriorDesc'), earned: userStats.co2Saved >= 10 },
                        { title: t('profile.achCommunityHero'), description: t('profile.achCommunityHeroDesc'), earned: userStats.totalRides >= 10 },
                        { title: t('profile.achPerfectRating'), description: t('profile.achPerfectRatingDesc'), earned: userStats.rating >= 4.9 },
                        { title: t('profile.achLongHaulPro'), description: t('profile.achLongHaulProDesc'), earned: userStats.totalRides >= 20 }
                      ].map((achievement, index) => (
                        <div 
                          key={achievement.title} 
                          className={`p-4 rounded-lg border-2 text-center ${
                            achievement.earned 
                              ? 'bg-yellow-50 border-yellow-200' 
                              : 'bg-gray-50 border-gray-200 opacity-50'
                          }`}
                        >
                          <div className="text-2xl mb-2">
                            {achievement.earned ? '🏆' : '🔒'}
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
