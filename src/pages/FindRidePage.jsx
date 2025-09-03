import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MapPin, Users, Euro, Star } from 'lucide-react';
import RideMap from '@/components/RideMap';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const FindRidePage = () => {
  const { t } = useTranslation();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const { bookRide, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rides');
        console.log("Fetched rides:", response.data);
        setRides(response.data);
        setFilteredRides(response.data);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast({
          title: "Error",
          description: "Failed to load rides. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchRides();

    // Check for new ride flag from localStorage
    if (localStorage.getItem('newRideAdded') === 'true') {
      fetchRides();
      localStorage.removeItem('newRideAdded'); // Clear the flag
    }
  }, []);

  const allRoutes = rides.map(ride => ride.route);

  const getTrustScoreText = (score) => {
    switch (score) {
      case 'high': return t('findRide.trustScoreHigh');
      case 'medium': return t('findRide.trustScoreMedium');
      case 'low': return t('findRide.trustScoreLow');
      default: return t('findRide.trustScoreMedium');
    }
  };

  const handleBookRide = async (ride) => {
    try {
      await bookRide(ride);
      setSelectedRoute(ride.route); // Set the selected route for map display
      toast({
        title: t('findRide.bookingSuccess'),
        description: `${ride.driver.name} ${t('findRide.bookingConfirmed')}`,
      });
    } catch (error) {
      console.error('Error booking ride:', error);
      toast({
        title: "Error",
        description: "Failed to book ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('findRide.title')}</h1>
            <p className="text-gray-600 mt-1">{t('findRide.subtitle')}</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 flex flex-col md:flex-row gap-4">
                <Input placeholder={t('findRide.from')} className="flex-1" value={from} onChange={(e) => setFrom(e.target.value)} />
                <Input placeholder={t('findRide.to')} className="flex-1" value={to} onChange={(e) => setTo(e.target.value)} />
                <Button className="w-full md:w-auto" onClick={() => {
                  const filtered = rides.filter(ride => {
                    const fromMatch = from ? ride.from.toLowerCase().includes(from.toLowerCase()) : true;
                    const toMatch = to ? ride.to.toLowerCase().includes(to.toLowerCase()) : true;
                    return fromMatch && toMatch;
                  });
                  setFilteredRides(filtered);
                }}>{t('findRide.search')}</Button>
              </CardContent>
            </Card>
            <h2 className="text-2xl font-semibold">{t('findRide.availableRides')}</h2>
            {filteredRides.filter(ride => ride.seats > 0).map(ride => {
              const isBooked = user && user.bookedRides.includes(ride._id);
              return (
                <Card key={ride._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 flex items-center space-x-4">
                      <img src={ride.driver.avatar} alt={ride.driver.name} className="w-16 h-16 rounded-full" />
                      <div>
                        <p className="font-semibold">{ride.driver.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{ride.driver.rating}</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">{getTrustScoreText(ride.driver.trustScore)}</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">{ride.from}</p>
                          <p className="text-sm text-gray-500">{t('to')}: {ride.to}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-blue-600">{ride.departure}</p>
                      <p className="text-sm text-gray-500">{ride.seats} {t('findRide.seatsAvailable')}</p>
                    </div>
                    <div className="md:col-span-1 flex flex-col items-end justify-between">
                      <div className="text-right">
                        <p className="text-2xl font-bold">€{ride.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{t('findRide.perPerson')}</p>
                      </div>
                      <Link to={`/ride/${ride._id}`} className="w-full mt-2">
                        <Button
                          className="w-full mt-2"
                          onClick={() => handleBookRide(ride)}
                          disabled={isBooked}
                        >
                          {isBooked ? t('findRide.booked') : t('bookRide')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('findRide.mapTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RideMap routes={selectedRoute ? [selectedRoute] : allRoutes} height="500px" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindRidePage;