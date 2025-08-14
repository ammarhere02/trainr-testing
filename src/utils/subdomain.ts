// Utility functions for handling subdirectories
export const getSubdirectory = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(part => part.length > 0);
  
  // Check if we're on a subdirectory (first path segment)
  if (parts.length >= 1) {
    const subdirectory = parts[0];
    // Exclude common paths that aren't educator portals
    if (!['login', 'signup', 'api', 'admin', 'studio', 'library', 'courses', 'dashboard', 'settings', 'profile'].includes(subdirectory)) {
      return subdirectory;
    }
  }
  
  return null;
};

export const isSubdirectory = (): boolean => {
  return getSubdirectory() !== null;
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

export const buildSubdirectoryUrl = (subdirectory: string): string => {
  const protocol = window.location.protocol;
  const mainDomain = getMainDomain();
  return `${protocol}//${mainDomain}/${subdirectory}`;
};

// Mock educator data - in production this would come from your API  
export const getEducatorBySubdirectory = async (subdirectory: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock educator data based on subdirectory
  const mockEducators: { [key: string]: any } = {
    'johndoe': {
      id: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      businessName: 'Web Development Academy',
      subdirectory: 'johndoe',
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
      subdirectory: 'sarahjohnson',
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
  
  return mockEducators[subdirectory] || null;
};