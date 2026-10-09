import { Vehicle, BusinessSettings } from '../types';

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  showroomName: 'Leghari Motors',
  ownerName: 'Shahid Leghari',
  city: 'Dera Ghazi Khan',
  province: 'Punjab',
  country: 'Pakistan',
  phone: '+92 300 0000000',
  whatsappNumber: '923000000000', // Configurable international format without '+' for direct wa.me link
  email: 'contact@legharimotors.pk',
  address: 'Indus Highway, Commercial Car Market, Dera Ghazi Khan, Punjab, Pakistan',
  googleMapsUrl: 'https://maps.google.com/?q=Dera+Ghazi+Khan+Punjab+Pakistan',
  businessHours: 'Monday – Saturday: 10:00 AM – 9:00 PM (Friday Closed 1:00 PM – 3:00 PM)',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
};

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'LM-2023-01',
    make: 'Toyota',
    model: 'Land Cruiser',
    variant: 'ZX 300 Series V6 Twin-Turbo',
    year: 2023,
    pricePKR: 115000000, // 11.5 Crore PKR
    mileageKm: 12500,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    engineCapacityCc: 3346,
    exteriorColor: 'Pearl White',
    interiorColor: 'Beige & Black Semi-Aniline Leather',
    bodyType: 'SUV',
    registrationCity: 'Islamabad',
    importStatus: 'Brand New Import',
    condition: 'Excellent',
    features: [
      'Multi-Terrain Select & Crawl Control',
      'Adaptive Variable Suspension (AVS)',
      '12.3-inch Touchscreen Navigation',
      'JBL 14-Speaker Premium Audio',
      'Panoramic 360-Degree Camera',
      'Ventilated & Heated Electric Seats',
      'Head-Up Display (HUD)',
      'Rear Seat Dual Entertainment Screens',
      'Toyota Safety Sense with Lane Tracing',
      'Powered Tailgate with Hands-Free Kick Sensor'
    ],
    description: 'Immaculate 2023 Toyota Land Cruiser 300 Series ZX in flagship Pearl White. Full factory original paint, driven sparingly with genuine 12,500 km. Islamabad registered. Equipped with complete off-road crawl electronics, twin-turbo V6 power, adaptive suspension, and bespoke rear entertainment setup. Available for inspection at Leghari Motors showroom in Dera Ghazi Khan.',
    images: [
      {
        id: 'img-lc300-1',
        url: '/src/assets/images/toyota_land_cruiser_lc300_1791518851093.jpg',
        order: 1,
        viewLabel: 'Front Three-Quarter',
        isVerified: true,
        altText: '2023 Toyota Land Cruiser 300 ZX Pearl White front three-quarter view'
      }
    ],
    status: 'Available',
    isFeatured: true,
    dateAdded: '2024-03-15T10:00:00Z',
    lastUpdated: '2024-03-15T10:00:00Z',
    adminNotes: 'Direct private purchase from original owner. All import customs duty documentation verified.'
  },
  {
    id: 'LM-2023-02',
    make: 'Honda',
    model: 'Civic',
    variant: 'RS 1.5 VTEC Turbo',
    year: 2023,
    pricePKR: 9450000, // 94.5 Lakh PKR
    mileageKm: 18200,
    transmission: 'CVT',
    fuelType: 'Petrol',
    engineCapacityCc: 1498,
    exteriorColor: 'Crystal Black Pearl',
    interiorColor: 'Black with Red Contrast Stitching',
    bodyType: 'Sedan',
    registrationCity: 'Lahore',
    importStatus: 'Local Assembled',
    condition: 'Excellent',
    features: [
      'Honda SENSING Driver Assist Suite',
      'Collision Mitigation Braking System',
      'Adaptive Cruise Control with Low-Speed Follow',
      'Bose Centerpoint Premium Sound',
      'Electric Sunroof',
      '18-inch Matte Black Alloy Wheels',
      'Dual Exhaust Sport Finishers',
      'Digital 10.2-inch Instrument Cluster',
      'Wireless Apple CarPlay & Android Auto',
      'Paddle Shifters & Sport Drive Mode'
    ],
    description: 'Showroom condition 11th Generation Honda Civic RS Turbo in aggressive Crystal Black Pearl. Bumper-to-bumper genuine condition with complete authorized dealership service history. Equipped with Honda SENSING safety technologies, RS aero body kit, and Bose premium acoustics.',
    images: [
      {
        id: 'img-civic-1',
        url: '/src/assets/images/honda_civic_rs_11th_gen_1791518865244.jpg',
        order: 1,
        viewLabel: 'Front Three-Quarter',
        isVerified: true,
        altText: '2023 Honda Civic RS Turbo Crystal Black Pearl front three-quarter angle'
      }
    ],
    status: 'Available',
    isFeatured: true,
    dateAdded: '2024-03-10T12:00:00Z',
    lastUpdated: '2024-03-14T09:30:00Z',
    adminNotes: 'Single owner car, zero accidents, inspected and approved.'
  },
  {
    id: 'LM-2022-03',
    make: 'Toyota',
    model: 'Corolla',
    variant: 'Altis Grande 1.8 Dual VVT-i',
    year: 2022,
    pricePKR: 7350000, // 73.5 Lakh PKR
    mileageKm: 32000,
    transmission: 'CVT',
    fuelType: 'Petrol',
    engineCapacityCc: 1798,
    exteriorColor: 'Super White',
    interiorColor: 'Ivory & Black Dual Tone',
    bodyType: 'Sedan',
    registrationCity: 'Multan',
    importStatus: 'Local Assembled',
    condition: 'Certified Pre-Owned',
    features: [
      'Sunroof with Jam Protection',
      'Push Start & Smart Keyless Entry',
      'Bi-Beam LED Headlamps with DRLs',
      'Paddle Shifter Steering Controls',
      'Cruise Control',
      'Vehicle Stability Control (VSC)',
      '9-inch In-Dash Android Infotainment',
      'Reverse Camera with Dynamic Guidelines',
      'Automatic Climate Control',
      'Original Alloy Wheels'
    ],
    description: 'Top-of-the-line 2022 Toyota Corolla Altis Grande 1.8 in pristine Super White. Exceptionally maintained family sedan with 32,000 genuine kilometers. Multan registered with complete book and original file in hand. Spotless interior and smooth CVT drivetrain.',
    images: [
      {
        id: 'img-corolla-1',
        url: '/src/assets/images/toyota_corolla_altis_grande_1791518880584.jpg',
        order: 1,
        viewLabel: 'Front Three-Quarter',
        isVerified: true,
        altText: '2022 Toyota Corolla Altis Grande Super White showroom photo'
      }
    ],
    status: 'Available',
    isFeatured: true,
    dateAdded: '2024-03-01T08:00:00Z',
    lastUpdated: '2024-03-16T14:00:00Z',
    adminNotes: 'Token tax paid up to date. Biometric ready on spot.'
  },
  {
    id: 'LM-2023-04',
    make: 'Suzuki',
    model: 'Alto',
    variant: 'VXL 660cc AGS',
    year: 2023,
    pricePKR: 2980000, // 29.8 Lakh PKR
    mileageKm: 9800,
    transmission: 'AGS',
    fuelType: 'Petrol',
    engineCapacityCc: 658,
    exteriorColor: 'Silky Silver Metallic',
    interiorColor: 'Grey & Charcoal Fabric',
    bodyType: 'Hatchback',
    registrationCity: 'Dera Ghazi Khan',
    importStatus: 'Local Assembled',
    condition: 'Excellent',
    features: [
      'Auto Gear Shift (AGS) Transmission',
      'Dual Front Airbags',
      'Anti-Lock Braking System (ABS)',
      'Power Windows & Retractable Mirrors',
      'Touchscreen Infotainment with Bluetooth',
      'Keyless Entry & Immobilizer',
      'Air Conditioner with Heater',
      'High Fuel Efficiency (~20-22 km/l)'
    ],
    description: 'Practically brand new 2023 Suzuki Alto VXL in Silky Silver Metallic. Only 9,800 kilometers driven on city roads. Registered locally in Dera Ghazi Khan with original smart card. Outstanding fuel economy and hassle-free automatic transmission.',
    images: [
      {
        id: 'img-alto-1',
        url: '/src/assets/images/suzuki_alto_vxl_pakistan_1791518892835.jpg',
        order: 1,
        viewLabel: 'Front Three-Quarter',
        isVerified: true,
        altText: '2023 Suzuki Alto VXL Silky Silver compact hatchback'
      }
    ],
    status: 'Available',
    isFeatured: false,
    dateAdded: '2024-03-12T11:00:00Z',
    lastUpdated: '2024-03-12T11:00:00Z',
    adminNotes: 'First owner, warranty booklet intact.'
  },
  {
    id: 'LM-2022-05',
    make: 'Kia',
    model: 'Sportage',
    variant: 'AWD 2.0 Nu MPI',
    year: 2022,
    pricePKR: 7800000, // 78 Lakh PKR
    mileageKm: 28000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineCapacityCc: 1999,
    exteriorColor: 'Clear White',
    interiorColor: 'Black & Grey Leatherette',
    bodyType: 'SUV',
    registrationCity: 'Rawalpindi',
    importStatus: 'Local Assembled',
    condition: 'Certified Pre-Owned',
    features: [
      'Dynamax All-Wheel Drive (AWD)',
      'Panoramic Glass Sunroof',
      'Electrically Adjustable Driver Seat with Lumbar',
      'Dual-Zone Auto Climate Control',
      'Smart Powered Tailgate',
      'Electronic Parking Brake with Auto Hold',
      '18-inch Machine Finish Alloys',
      'Projector Fog Lamps & LED DRLs'
    ],
    description: 'Kia Sportage AWD 2.0 in Clear White. Full panoramic sunroof, intelligent all-wheel drive, and comfortable executive ride. Certified pre-owned with clean history and genuine mileage.',
    images: [], // Demonstrates graceful verified branded placeholder requirement
    status: 'Available',
    isFeatured: false,
    dateAdded: '2024-03-05T09:00:00Z',
    lastUpdated: '2024-03-05T09:00:00Z',
    adminNotes: 'Genuine showroom photos scheduled for studio photography.'
  },
  {
    id: 'LM-2023-06',
    make: 'Hyundai',
    model: 'Tucson',
    variant: 'AWD A/T Ultimate',
    year: 2023,
    pricePKR: 8250000, // 82.5 Lakh PKR
    mileageKm: 15000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineCapacityCc: 1999,
    exteriorColor: 'Phantom Black',
    interiorColor: 'Dark Grey Leather',
    bodyType: 'SUV',
    registrationCity: 'Lahore',
    importStatus: 'Local Assembled',
    condition: 'Excellent',
    features: [
      'HTRAC All-Wheel Drive System',
      'Panoramic Sunroof',
      'Wireless Phone Charging',
      'Electronic Chromic Mirror',
      'Full Leather Upholstery',
      'Downhill Brake Control'
    ],
    description: '2023 Hyundai Tucson AWD in Phantom Black. Recently sold to a respected client from Rajanpur. Maintained here for showroom catalog and historical reference.',
    images: [],
    status: 'Sold', // Demonstrates sold status handling
    isFeatured: false,
    dateAdded: '2024-02-20T14:00:00Z',
    lastUpdated: '2024-03-14T16:00:00Z',
    adminNotes: 'Vehicle sold on 14 March 2024.'
  }
];
