// Utility functions for handling subdomains
export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if we're on a subdomain (more than 2 parts for domain.com)
  // or more than 3 parts for domain.co.uk style domains
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Exclude common subdomains that aren't educator portals
    if (!['www', 'api', 'admin', 'mail', 'ftp'].includes(subdomain)) {
      return subdomain;
    }
  }
  
  return null;
};

export const isSubdomain = (): boolean => {
  return getSubdomain() !== null;
};

export const getMainDomain = (): string => {
  if (typeof window === 'undefined') return 'trytrainr.com';
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Return the main domain (last two parts for .com, last three for .co.uk)
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  
  return 'trytrainr.com';
};

export const buildSubdomainUrl = (subdomain: string): string => {
  const protocol = window.location.protocol;
  const mainDomain = getMainDomain();
  return `${protocol}//${subdomain}.${mainDomain}`;
};

// Mock educator data - in production this would come from your API
export const getEducatorBySubdomain = async (subdomain: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock educator data based on subdomain
  const mockEducators: { [key: string]: any } = {
    'johndoe': {
      id: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      businessName: 'Web Development Academy',
      subdomain: 'johndoe',
      description: 'Learn modern web development with hands-on projects',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        students: 1247,
        courses: 8,
        rating: 4.9,
        reviews: 456
      },
      courses: [
        {
          id: 1,
          title: 'Complete Web Development Bootcamp',
          description: 'Learn HTML, CSS, JavaScript, React, and Node.js',
          price: 199,
          image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
          students: 847,
          rating: 4.8
        },
        {
          id: 2,
          title: 'Advanced React Patterns',
          description: 'Master advanced React concepts and patterns',
          price: 149,
          image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
          students: 400,
          rating: 4.9
        }
      ]
    },
    'sarahjohnson': {
      id: 'sarahjohnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      businessName: 'Design Mastery Academy',
      subdomain: 'sarahjohnson',
      description: 'Master UI/UX design and create stunning digital experiences',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        students: 2156,
        courses: 12,
        rating: 4.9,
        reviews: 892
      },
      courses: [
        {
          id: 1,
          title: 'UI/UX Design Fundamentals',
          description: 'Learn the principles of great design',
          price: 179,
          image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
          students: 1200,
          rating: 4.9
        }
      ]
    }
  };
  
  return mockEducators[subdomain] || null;
};