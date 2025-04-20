export const mockPets = [
  {
    _id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Male',
    size: 'Large',
    description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks.',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d'],
    shelterId: '1'
  },
  {
    _id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 1,
    gender: 'Female',
    size: 'Medium',
    description: 'Luna is a graceful Siamese cat who enjoys peaceful naps in sunny spots and gentle play sessions.',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'],
    shelterId: '2'
  },
  // Add more pets here with different breeds, species, and descriptions
  {
    _id: '3',
    name: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 3,
    gender: 'Male',
    size: 'Large',
    description: 'Rocky is a loyal and intelligent German Shepherd with excellent training potential.',
    status: 'available',
    shelterId: '1'
  },
  // ... Add 47 more pets with various characteristics
  {
    _id: '4',
    name: 'Bella',
    species: 'Dog',
    breed: 'Labrador Retriever',
    age: 1,
    gender: 'Female',
    size: 'Large',
    description: 'Bella is a playful and energetic Labrador who loves water and playing fetch.',
    status: 'available',
    shelterId: '1'
  },
  {
    _id: '5',
    name: 'Oliver',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 3,
    gender: 'Male',
    size: 'Large',
    description: 'Oliver is a gentle giant with a luxurious coat and friendly personality.',
    status: 'available',
    shelterId: '2'
  },
  // Add more pets with different characteristics
  {
    _id: '6',
    name: 'Charlie',
    species: 'Dog',
    breed: 'French Bulldog',
    age: 2,
    gender: 'Male',
    size: 'Small',
    description: 'Charlie is a charming Frenchie who loves cuddles and short walks.',
    status: 'available',
    shelterId: '3'
  },
  // ... continue adding more pets
  {
    _id: '7',
    name: 'Milo',
    species: 'Cat',
    breed: 'Persian',
    age: 4,
    gender: 'Male',
    size: 'Medium',
    description: 'Milo is a regal Persian cat who enjoys lounging in sunny spots and gentle grooming sessions.',
    status: 'available',
    shelterId: '4'
  },
  {
    _id: '8',
    name: 'Lucy',
    species: 'Dog',
    breed: 'Beagle',
    age: 2,
    gender: 'Female',
    size: 'Medium',
    description: 'Lucy is an adventurous Beagle with a keen nose and loving personality.',
    status: 'available',
    shelterId: '1'
  },
  {
    _id: '9',
    name: 'Shadow',
    species: 'Cat',
    breed: 'Russian Blue',
    age: 1,
    gender: 'Male',
    size: 'Medium',
    description: 'Shadow is a quiet and elegant Russian Blue who bonds deeply with his family.',
    status: 'available',
    shelterId: '5'
  },
  {
    _id: '10',
    name: 'Daisy',
    species: 'Dog',
    breed: 'Poodle',
    age: 3,
    gender: 'Female',
    size: 'Small',
    description: 'Daisy is a smart and elegant Poodle who loves learning new tricks.',
    status: 'available',
    shelterId: '2'
  },
  {
    _id: '50',
    name: 'Zeus',
    species: 'Dog',
    breed: 'Great Dane',
    age: 2,
    gender: 'Male',
    size: 'Large',
    description: 'Zeus is a gentle giant who thinks he\'s a lap dog. Great with kids and other pets.',
    status: 'available',
    shelterId: '3'
  }
];

export const mockShelters = [
  {
    _id: '1',
    name: 'Happy Tails Shelter',
    description: 'A no-kill shelter dedicated to finding homes for all pets.',
    address: {
      street: '123 Pet Lane',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    contact: {
      phone: '(555) 123-4567',
      email: 'info@happytails.org',
      website: 'https://happytails.org'
    },
    rating: 4.5,
    isVerified: true,
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1']
  },
  {
    _id: '2',
    name: 'Paws & Claws Rescue',
    description: 'Specializing in rescuing and rehoming cats and dogs.',
    address: {
      street: '456 Animal Ave',
      city: 'Petville',
      state: 'NY',
      zipCode: '67890',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    contact: {
      phone: '(555) 987-6543',
      email: 'contact@pawsandclaws.org',
      website: 'https://pawsandclaws.org'
    },
    rating: 4.2,
    isVerified: true,
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1']
  },
  // Add more shelters with different locations and specialties
  {
    _id: '3',
    name: 'Second Chance Animal Sanctuary',
    description: 'Providing a safe haven for abandoned and rescued animals.',
    address: {
      street: '789 Hope Street',
      city: 'Rescue City',
      state: 'TX',
      zipCode: '45678',
      coordinates: { lat: 29.7604, lng: -95.3698 }
    },
    contact: {
      phone: '(555) 246-8135',
      email: 'info@secondchance.org',
      website: 'https://secondchance.org'
    },
    rating: 4.8,
    isVerified: true
  },
  {
    _id: '4',
    name: 'Forever Friends Animal Rescue',
    description: 'Specializing in senior pet adoption and special needs animals.',
    address: {
      street: '321 Rescue Road',
      city: 'Hopeville',
      state: 'FL',
      zipCode: '33101',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    contact: {
      phone: '(555) 789-0123',
      email: 'info@foreverfriends.org',
      website: 'https://foreverfriends.org'
    },
    rating: 4.9,
    isVerified: true
  },
  {
    _id: '5',
    name: 'Little Paws Sanctuary',
    description: 'A cozy shelter focusing on small breed dogs and cats.',
    address: {
      street: '567 Pet Haven Lane',
      city: 'Sunshine',
      state: 'AZ',
      zipCode: '85001',
      coordinates: { lat: 33.4484, lng: -112.0740 }
    },
    contact: {
      phone: '(555) 456-7890',
      email: 'adopt@littlepaws.org',
      website: 'https://littlepaws.org'
    },
    rating: 4.7,
    isVerified: true
  },
  {
    _id: '6',
    name: 'Pawsome Pet Haven',
    description: 'A modern facility specializing in rehabilitation and adoption of rescued pets.',
    address: {
      street: '789 Adoption Avenue',
      city: 'Riverside',
      state: 'CA',
      zipCode: '92501',
      coordinates: { lat: 33.9806, lng: -117.3755 }
    },
    contact: {
      phone: '(555) 234-5678',
      email: 'info@pawsomehaven.org',
      website: 'https://pawsomehaven.org'
    },
    rating: 4.6,
    isVerified: true
  },
  {
    _id: '7',
    name: 'Furry Friends Foundation',
    description: 'Dedicated to finding homes for senior pets and those with special needs.',
    address: {
      street: '456 Compassion Court',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      coordinates: { lat: 45.5155, lng: -122.6789 }
    },
    contact: {
      phone: '(555) 345-6789',
      email: 'adopt@furryfriends.org',
      website: 'https://furryfriends.org'
    },
    rating: 4.8,
    isVerified: true
  },
  {
    _id: '8',
    name: 'Hope Harbor Animal Sanctuary',
    description: 'A peaceful sanctuary providing care and rehabilitation for abandoned pets.',
    address: {
      street: '123 Serenity Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    contact: {
      phone: '(555) 456-7890',
      email: 'info@hopeharbor.org',
      website: 'https://hopeharbor.org'
    },
    rating: 4.7,
    isVerified: true
  },
  {
    _id: '9',
    name: 'Loving Hearts Pet Rescue',
    description: 'Family-run rescue focusing on creating perfect matches between pets and adopters.',
    address: {
      street: '789 Harmony Lane',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      coordinates: { lat: 39.7392, lng: -104.9903 }
    },
    contact: {
      phone: '(555) 567-8901',
      email: 'adopt@lovinghearts.org',
      website: 'https://lovinghearts.org'
    },
    rating: 4.9,
    isVerified: true
  },
  {
    _id: '10',
    name: 'Safe Haven Pet Sanctuary',
    description: 'Providing a safe and nurturing environment for pets awaiting their forever homes.',
    address: {
      street: '321 Tranquility Trail',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    contact: {
      phone: '(555) 678-9012',
      email: 'info@safehaven.org',
      website: 'https://safehaven.org'
    },
    rating: 4.8,
    isVerified: true
  }
]; 