
const mongoose = require('mongoose');

// --- Copy/paste the User and Ride schemas from server.js ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const rideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: {
    name: { type: String },
    rating: { type: Number, default: 0 },
    trustScore: { type: String, default: 'medium' },
    avatar: { type: String, default: '' },
    trips: { type: Number, default: 0 },
    memberSince: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    bio: { type: String, default: '' },
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  departure: { type: String, required: true },
  price: { type: Number, required: true },
  seats: { type: Number, required: true },
  duration: { type: String },
  distance: { type: String },
  route: { type: Array },
  routeDetails: {
    stops: { type: Array },
    description: { type: String }
  },
  car: {
    model: { type: String },
    year: { type: Number },
    color: { type: String },
    features: { type: Array }
  },
  description: { type: String },
  rules: { type: Array },
}, { timestamps: true });
const Ride = mongoose.model('Ride', rideSchema);
// --- End of copy/paste ---

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ride_sharing_app';

const mockRides = [
    {
    id: 1,
    driver: { 
      name: 'Max Mustermann', 
      rating: 4.8, 
      trustScore: 'high', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      trips: 127,
      memberSince: 'März 2022',
      verified: true,
      bio: 'Ich fahre regelmäßig zwischen Rothenburg und Würzburg für die Arbeit. Freue mich auf nette Mitfahrer!'
    },
    from: 'Rothenburg ob der Tauber',
    to: 'Würzburg',
    date: '2024-07-03',
    departure: '08:00',
    price: 12.50,
    seats: 2,
    duration: '45 min',
    distance: '65 km',
    route: [[49.378, 10.179], [49.791, 9.938]],
    routeDetails: {
      stops: ['Rothenburg ob der Tauber Bahnhof', 'Creglingen', 'Würzburg Hauptbahnhof'],
      description: 'Fahre über die A7, kann bei Bedarf kleine Umwege machen.'
    },
    car: {
      model: 'VW Golf',
      year: 2020,
      color: 'Blau',
      features: ['Klimaanlage', 'Nichtraucher', 'Musik erlaubt']
    },
    description: 'Entspannte Fahrt zur Arbeit. Höre gerne Musik, bin aber auch für Gespräche zu haben. Pünktlichkeit ist mir wichtig!',
    rules: ['Pünktlichkeit', 'Nichtraucher', 'Keine Haustiere']
  },
  {
    id: 2,
    driver: { 
      name: 'Erika Mustermann', 
      rating: 4.9, 
      trustScore: 'high', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      trips: 84,
      memberSince: 'Januar 2023',
      verified: true,
      bio: 'Studentin, die am Wochenende nach Hause fährt. Biete gerne eine Mitfahrgelegenheit an.'
    },
    from: 'Nürnberg',
    to: 'Frankfurt',
    date: '2024-07-05',
    departure: '09:30',
    price: 25.00,
    seats: 3,
    duration: '2h 15min',
    distance: '220 km',
    route: [[49.452, 11.076], [50.110, 8.682]],
    routeDetails: {
      stops: ['Nürnberg Hbf', 'Würzburg Hbf', 'Frankfurt Flughafen'],
      description: 'Direkte Fahrt auf der A3.'
    },
    car: {
      model: 'Opel Corsa',
      year: 2021,
      color: 'Rot',
      features: ['Klimaanlage', 'USB-Ladeanschluss']
    },
    description: 'Gepäckraum ist begrenzt, bitte nur ein Handgepäckstück mitnehmen.',
    rules: ['Keine großen Koffer', 'Musik nach Absprache']
  },
  {
    id: 3,
    driver: { 
      name: 'Klaus Weber', 
      rating: 4.7, 
      trustScore: 'medium', 
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
      trips: 42,
      memberSince: 'Oktober 2023',
      verified: false,
      bio: 'Gelegentliche Fahrten für Ausflüge. Bin flexibel bei den Haltestellen.'
    },
    from: 'Bamberg',
    to: 'Munich',
    date: '2024-07-06',
    departure: '07:15',
    price: 30.00,
    seats: 1,
    duration: '2h 45min',
    distance: '230 km',
    route: [[49.898, 10.922], [48.135, 11.582]],
    routeDetails: {
      stops: ['Bamberg', 'Nürnberg', 'Ingolstadt', 'München'],
      description: 'Fahrt über die A9. Kann Leute entlang der Strecke absetzen.'
    },
    car: {
      model: 'Audi A4',
      year: 2019,
      color: 'Schwarz',
      features: ['Ledersitze', 'Gutes Soundsystem']
    },
    description: 'Ich fahre nach München für ein Konzert. Biete eine entspannte Fahrt mit guter Musik.',
    rules: ['Gepäck nach Absprache']
  },
  {
    id: 4,
    driver: {
      name: 'Sabine Meier',
      rating: 4.9,
      trustScore: 'high',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      trips: 211,
      memberSince: 'Juni 2021',
      verified: true,
      bio: 'Berufspendlerin mit viel Fahrerfahrung. Freue mich auf eine ruhige und angenehme Fahrt.'
    },
    from: 'Hamburg',
    to: 'Berlin',
    date: '2024-07-08',
    departure: '10:00',
    price: 35.00,
    seats: 2,
    duration: '3h',
    distance: '290 km',
    route: [[53.551, 9.993], [52.520, 13.404]],
    routeDetails: {
      stops: ['Hamburg ZOB', 'Raststätte Walsleben', 'Berlin ZOB'],
      description: 'Schnelle Fahrt über die A24.'
    },
    car: {
      model: 'Mercedes E-Klasse',
      year: 2022,
      color: 'Silber',
      features: ['Komfortsitze', 'WLAN an Bord']
    },
    description: 'Biete eine komfortable und schnelle Fahrt. Ideal für Geschäftsreisende.',
    rules: ['Nur Handgepäck', 'Keine Tiere']
  },
  {
    id: 5,
    driver: {
      name: 'Tom Schneider',
      rating: 4.6,
      trustScore: 'medium',
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face',
      trips: 33,
      memberSince: 'Februar 2024',
      verified: false,
      bio: 'Wochenend-Abenteurer. Fahre oft ins Grüne.'
    },
    from: 'Köln',
    to: 'Düsseldorf',
    date: '2024-07-10',
    departure: '14:00',
    price: 8.00,
    seats: 3,
    duration: '40min',
    distance: '45 km',
    route: [[50.937, 6.960], [51.227, 6.773]],
    routeDetails: {
      stops: ['Köln Hbf', 'Leverkusen Mitte', 'Düsseldorf Hbf'],
      description: 'Entspannte Fahrt am Rhein entlang.'
    },
    car: {
      model: 'Ford Fiesta',
      year: 2018,
      color: 'Weiß',
      features: ['Geringer Verbrauch']
    },
    description: 'Perfekt für einen kurzen Trip zwischen den Städten.',
    rules: []
  },
  {
    id: 6,
    driver: {
      name: 'Laura Schmidt',
      rating: 4.9,
      trustScore: 'high',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      trips: 150,
      memberSince: 'Mai 2022',
      verified: true,
      bio: 'Ich bin eine zuverlässige Fahrerin und freue mich auf nette Gesellschaft.'
    },
    from: 'Stuttgart',
    to: 'Karlsruhe',
    date: '2024-07-12',
    departure: '17:00',
    price: 15.00,
    seats: 2,
    duration: '1h',
    distance: '80 km',
    route: [[48.775, 9.182], [49.006, 8.403]],
    routeDetails: {
      stops: ['Stuttgart Hbf', 'Pforzheim', 'Karlsruhe Hbf'],
      description: 'Fahre direkt nach der Arbeit los.'
    },
    car: {
      model: 'BMW 3er',
      year: 2021,
      color: 'Grau',
      features: ['Klimaanlage', 'Sitzheizung']
    },
    description: 'Biete eine angenehme Fahrt mit guter Musik.',
    rules: ['Pünktlichkeit', 'Keine Haustiere']
  },
  {
    id: 7,
    driver: {
      name: 'Jonas Becker',
      rating: 4.7,
      trustScore: 'medium',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face',
      trips: 55,
      memberSince: 'September 2023',
      verified: true,
      bio: 'Ich fahre oft am Wochenende in die Berge und nehme gerne Leute mit.'
    },
    from: 'München',
    to: 'Garmisch-Partenkirchen',
    date: '2024-07-13',
    departure: '08:30',
    price: 18.00,
    seats: 3,
    duration: '1h 15min',
    distance: '90 km',
    route: [[48.135, 11.582], [47.492, 11.095]],
    routeDetails: {
      stops: ['München-Pasing', 'Starnberg', 'Garmisch-Partenkirchen Bahnhof'],
      description: 'Perfekt für einen Tagesausflug in die Alpen.'
    },
    car: {
      model: 'Audi Q5',
      year: 2020,
      color: 'Weiß',
      features: ['Allradantrieb', 'Großer Kofferraum']
    },
    description: 'Platz für Skier oder Snowboard vorhanden.',
    rules: ['Gepäck nach Absprache']
  },
  {
    id: 8,
    driver: {
      name: 'Anna Fischer',
      rating: 4.8,
      trustScore: 'high',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      trips: 95,
      memberSince: 'April 2023',
      verified: true,
      bio: 'Ich pendle regelmäßig zwischen Leipzig und Dresden.'
    },
    from: 'Leipzig',
    to: 'Dresden',
    date: '2024-07-15',
    departure: '07:00',
    price: 14.00,
    seats: 1,
    duration: '1h 30min',
    distance: '120 km',
    route: [[51.339, 12.373], [51.050, 13.737]],
    routeDetails: {
      stops: ['Leipzig Hbf', 'Raststätte Dresdner Tor', 'Dresden Hbf'],
      description: 'Schnelle und direkte Fahrt über die A14.'
    },
    car: {
      model: 'VW Passat',
      year: 2022,
      color: 'Schwarz',
      features: ['Komfortsitze', 'Nichtraucher']
    },
    description: 'Ich freue mich auf eine ruhige Fahrt.',
    rules: ['Nur Handgepäck']
  },
  {
    id: 9,
    driver: {
      name: 'Peter Wolf',
      rating: 4.6,
      trustScore: 'medium',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      trips: 25,
      memberSince: 'Januar 2024',
      verified: false,
      bio: 'Ich fahre gelegentlich zu Fußballspielen und biete Mitfahrgelegenheiten an.'
    },
    from: 'Dortmund',
    to: 'Gelsenkirchen',
    date: '2024-07-17',
    departure: '18:00',
    price: 7.00,
    seats: 2,
    duration: '30min',
    distance: '30 km',
    route: [[51.513, 7.465], [51.517, 7.094]],
    routeDetails: {
      stops: ['Dortmund Signal Iduna Park', 'Veltins-Arena'],
      description: 'Perfekt für Fußballfans.'
    },
    car: {
      model: 'Opel Astra',
      year: 2019,
      color: 'Blau',
      features: ['Gutes Soundsystem']
    },
    description: 'Biete eine Fahrt zum Spiel an. Gute Stimmung ist garantiert!',
    rules: ['Vereinsfarben sind willkommen']
  },
  {
    id: 10,
    driver: {
      name: 'Maria Keller',
      rating: 4.9,
      trustScore: 'high',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      trips: 180,
      memberSince: 'März 2022',
      verified: true,
      bio: 'Ich reise gerne und lerne neue Leute kennen.'
    },
    from: 'Freiburg',
    to: 'Basel',
    date: '2024-07-19',
    departure: '11:00',
    price: 10.00,
    seats: 2,
    duration: '1h',
    distance: '70 km',
    route: [[47.999, 7.842], [47.559, 7.588]],
    routeDetails: {
      stops: ['Freiburg Hbf', 'Neuenburg am Rhein', 'Basel Badischer Bahnhof'],
      description: 'Einfache Fahrt über die A5.'
    },
    car: {
      model: 'Renault Clio',
      year: 2021,
      color: 'Rot',
      features: ['Klimaanlage', 'Panoramadach']
    },
    description: 'Ich freue mich auf eine unterhaltsame Fahrt.',
    rules: ['Gute Laune mitbringen']
  },
  {
    id: 11,
    driver: {
      name: 'Frank Lehmann',
      rating: 4.8,
      trustScore: 'high',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      trips: 110,
      memberSince: 'Juli 2022',
      verified: true,
      bio: 'Ich bin ein erfahrener Fahrer und biete sichere und pünktliche Fahrten an.'
    },
    from: 'Hannover',
    to: 'Bremen',
    date: '2024-07-20',
    departure: '09:00',
    price: 18.00,
    seats: 3,
    duration: '1h 30min',
    distance: '125 km',
    route: [[52.375, 9.732], [53.079, 8.801]],
    routeDetails: {
      stops: ['Hannover Hbf', 'Raststätte Grundbergsee', 'Bremen Hbf'],
      description: 'Direkte Fahrt über die A27.'
    },
    car: {
      model: 'Skoda Octavia',
      year: 2020,
      color: 'Grau',
      features: ['Großer Kofferraum', 'WLAN']
    },
    description: 'Biete eine komfortable Fahrt für Pendler und Reisende.',
    rules: ['Pünktlichkeit wird erwartet']
  },
  {
    id: 12,
    driver: {
      name: 'Julia Richter',
      rating: 4.7,
      trustScore: 'medium',
      avatar: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150&h=150&fit=crop&crop=face',
      trips: 45,
      memberSince: 'August 2023',
      verified: true,
      bio: 'Ich fahre gerne am Meer entlang und genieße die Aussicht.'
    },
    from: 'Rostock',
    to: 'Lübeck',
    date: '2024-07-22',
    departure: '13:00',
    price: 16.00,
    seats: 2,
    duration: '1h 45min',
    distance: '140 km',
    route: [[54.092, 12.140], [53.865, 10.686]],
    routeDetails: {
      stops: ['Rostock Hbf', 'Wismar', 'Lübeck Hbf'],
      description: 'Schöne Fahrt entlang der Ostseeküste.'
    },
    car: {
      model: 'VW Polo',
      year: 2021,
      color: 'Blau',
      features: ['Klimaanlage', 'Geringer Verbrauch']
    },
    description: 'Ich freue mich auf eine entspannte Fahrt mit netten Leuten.',
    rules: ['Keine Haustiere']
  },
  {
    id: 13,
    driver: {
      name: 'Markus Braun',
      rating: 4.9,
      trustScore: 'high',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
      trips: 200,
      memberSince: 'Februar 2022',
      verified: true,
      bio: 'Ich bin ein sehr erfahrener Fahrer und biete schnelle und sichere Fahrten an.'
    },
    from: 'Frankfurt',
    to: 'Köln',
    date: '2024-07-24',
    departure: '16:00',
    price: 22.00,
    seats: 2,
    duration: '2h',
    distance: '190 km',
    route: [[50.110, 8.682], [50.937, 6.960]],
    routeDetails: {
      stops: ['Frankfurt Flughafen', 'Limburg an der Lahn', 'Köln Hbf'],
      description: 'Direkte Fahrt über die A3.'
    },
    car: {
      model: 'Porsche Taycan',
      year: 2023,
      color: 'Schwarz',
      features: ['Elektroauto', 'Sehr schnell']
    },
    description: 'Biete eine schnelle und sportliche Fahrt.',
    rules: ['Nur kleines Gepäck']
  },
  {
    id: 14,
    driver: {
      name: 'Sandra Neumann',
      rating: 4.8,
      trustScore: 'high',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      trips: 130,
      memberSince: 'Oktober 2022',
      verified: true,
      bio: 'Ich fahre oft zu meiner Familie und habe noch Plätze frei.'
    },
    from: 'Bremen',
    to: 'Hamburg',
    date: '2024-07-26',
    departure: '15:00',
    price: 17.00,
    seats: 1,
    duration: '1h 30min',
    distance: '120 km',
    route: [[53.079, 8.801], [53.551, 9.993]],
    routeDetails: {
      stops: ['Bremen Hbf', 'Raststätte Stillhorn', 'Hamburg Hbf'],
      description: 'Entspannte Fahrt am Freitagnachmittag.'
    },
    car: {
      model: 'Mercedes A-Klasse',
      year: 2022,
      color: 'Weiß',
      features: ['Komfortsitze', 'Gutes Soundsystem']
    },
    description: 'Ich freue mich auf eine angenehme Fahrt.',
    rules: ['Keine Tiere']
  },
  {
    id: 15,
    driver: {
      name: 'Christian Vogel',
      rating: 4.7,
      trustScore: 'medium',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      trips: 60,
      memberSince: 'Mai 2023',
      verified: true,
      bio: 'Ich bin Student und fahre am Wochenende nach Hause.'
    },
    from: 'Heidelberg',
    to: 'Stuttgart',
    date: '2024-07-27',
    departure: '12:00',
    price: 12.00,
    seats: 2,
    duration: '1h 15min',
    distance: '120 km',
    route: [[49.407, 8.691], [48.775, 9.182]],
    routeDetails: {
      stops: ['Heidelberg Hbf', 'Heilbronn', 'Stuttgart Hbf'],
      description: 'Fahre über die A6 und A81.'
    },
    car: {
      model: 'Ford Focus',
      year: 2019,
      color: 'Silber',
      features: ['Klimaanlage', 'USB-Ladeanschluss']
    },
    description: 'Biete eine entspannte Fahrt mit Musik.',
    rules: ['Gepäck nach Absprache']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Ride.deleteMany({});
    console.log('Cleared existing users and rides.');

    // Create dummy users
    const user1 = new User({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password',
    });
    await user1.save();
    console.log('Created dummy user Alice.');

    const user2 = new User({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password',
    });
    await user2.save();
    console.log('Created dummy user Bob.');

    // Distribute rides between users
    const ridesToCreate = mockRides.map((ride, index) => {
      const { id, ...rideData } = ride;
      return {
        ...rideData,
        userId: index % 2 === 0 ? user1._id : user2._id,
      };
    });

    await Ride.insertMany(ridesToCreate);
    console.log(`Seeded ${ridesToCreate.length} rides.`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDatabase();
