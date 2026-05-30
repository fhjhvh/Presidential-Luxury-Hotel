import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const STORAGE_KEY = 'plhms_language';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        floors: 'Floors',
        rooms: 'Rooms',
        suites: 'Suites',
        services: 'Services',
        premium: 'Premium',
        bookNow: 'Book Now',
        signIn: 'Sign In',
        dashboard: 'Dashboard',
        myProfile: 'My Profile',
        myBookings: 'My Bookings',
        myOrders: 'My Orders',
        hotelStore: 'Hotel Store',
        logout: 'Logout',
        guest: 'Guest',
        guestRole: 'Hotel Guest'
      },
      profile: {
        member: 'Member',
        totalBookings: 'Total Bookings',
        activeBookings: 'Active Bookings',
        totalSpent: 'Total Spent',
        loyaltyPoints: 'Loyalty Points',
        overview: 'Overview',
        myBookings: 'My Bookings',
        settings: 'Settings',
        welcomeBack: 'Welcome back',
        overviewDescription: 'Manage your bookings, explore services, and enjoy your stay.',
        bookRoom: 'Book a Room',
        viewBookings: 'View Bookings',
        exploreServices: 'Explore Services',
        hotelStore: 'Hotel Store',
        recentBookings: 'Recent Bookings',
        noBookings: 'You have no bookings yet.',
        makeFirstBooking: 'Make Your First Booking',
        room: 'Room',
        accountSettings: 'Account Settings',
        personalInfo: 'Personal Information',
        email: 'Email',
        phone: 'Phone',
        addPhone: 'Add phone number',
        dangerZone: 'Danger Zone'
      },
      bookings: {
        myBookings: 'My Bookings',
        manageYourReservations: 'Manage your reservations and view booking details',
        all: 'All',
        active: 'Active',
        completed: 'Completed',
        cancelled: 'Cancelled',
        noBookingsFound: 'No bookings found',
        startBooking: 'Start exploring our rooms and make your first booking!',
        bookNow: 'Book Now',
        bookingNumber: 'Booking #',
        room: 'Room',
        floor: 'Floor',
        checkIn: 'Check-in',
        checkOut: 'Check-out',
        nights: 'nights',
        guests: 'Guests',
        totalPrice: 'Total Price',
        specialRequests: 'Special Requests',
        bookedOn: 'Booked on',
        cancel: 'Cancel Booking',
        newBooking: 'New Booking',
        backToProfile: 'Back to Profile'
      },
      orders: {
        myOrders: 'My Orders',
        trackYourOrders: 'Track your room service and store orders',
        noOrdersFound: 'No orders found',
        startOrdering: 'Visit the hotel store to place your first order!',
        visitStore: 'Visit Store',
        orderNumber: 'Order #',
        total: 'Total',
        goToStore: 'Go to Store',
        backToProfile: 'Back to Profile'
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        close: 'Close',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        submit: 'Submit'
      },
      dashboard: {
        guestPortal: 'Guest Portal',
        adminPanel: 'Admin Panel',
        guestDashboard: 'Guest Dashboard',
        adminDashboard: 'Admin Dashboard',
        welcomeBack: 'Welcome back to Presidential Luxury',
        overview: 'Overview',
        floorManagement: 'Floor Management',
        roomManagement: 'Room Management',
        pricingAvailability: 'Pricing & Availability',
        staffManagement: 'Staff Management',
        analyticsReports: 'Analytics & Reports',
        myReservations: 'My Reservations',
        billing: 'Billing & Invoices',
        serviceRequests: 'Service Requests',
        profile: 'Profile',
        bookingHistory: 'Booking History',
        logout: 'Logout'
      },
      language: {
        label: 'Language',
        en: 'EN',
        ar: 'AR',
        tr: 'TR'
      },
      auth: {
        signIn: 'Sign In',
        register: 'Register',
        backToSelection: 'Back to role selection',
        backToDepartment: 'Back to department selection',
        staffId: 'Staff ID',
        pin: 'PIN',
        invalidCredentials: 'Invalid Staff ID or PIN',
        invalidPin: 'PIN must be at least 4 digits',
        success: {
          registrationTitle: 'Registration Successful!',
          registrationMessage: 'Welcome! Enjoy your 20% first-time guest discount',
          loginTitle: 'Login Successful!',
          welcomeBack: 'Welcome Back!',
          welcomeBackMessage: 'Your 10% loyalty discount is active',
          adminTitle: 'Admin Access Granted',
          adminMessage: 'Welcome to the control panel',
          staffWelcome: 'Welcome to {{department}}'
        },
        accessEntry: {
          title: 'Select Your Access Level',
          subtitle: 'Choose your role to continue',
          footer: 'Secure access to Presidential Luxury Hotel',
          roles: {
            firstTime: {
              title: 'First-Time Guest',
              subtitle: 'New to our luxury experience',
              highlight: '20% Discount',
              cta: 'Register Now'
            },
            returning: {
              title: 'Returning Guest',
              subtitle: 'Welcome back to excellence',
              highlight: '10% Loyalty',
              cta: 'Sign In'
            },
            staff: {
              title: 'Staff Member',
              subtitle: 'Employee access portal',
              highlight: 'Team Access',
              cta: 'Staff Login'
            },
            admin: {
              title: 'Administrator',
              subtitle: 'Management control panel',
              highlight: 'Full Access',
              cta: 'Admin Login'
            }
          }
        },
        guestNew: {
          title: 'First-Time Guest Registration',
          subtitle: 'Join our exclusive community',
          fields: {
            fullName: 'Full Name',
            email: 'Email Address',
            password: 'Password',
            phone: 'Phone Number',
            preferences: 'Special Preferences (Optional)'
          },
          cta: 'Sign In',
          footer: 'Already have an account?',
          footerLink: 'Sign in here',
          errors: {
            invalidName: 'Please enter a valid name',
            invalidEmail: 'Please enter a valid email',
            invalidPassword: 'Password must be at least 6 characters',
            loginFailed: 'Registration failed. Please try again.'
          }
        },
        guestReturning: {
          title: 'Welcome Back',
          subtitle: 'Sign in to your account',
          fields: {
            email: 'Email Address',
            password: 'Password',
            loyaltyId: 'Loyalty ID (Optional)'
          },
          cta: 'Sign In',
          footer: 'New to our hotel?',
          footerLink: 'Register here',
          errors: {
            invalidEmail: 'Please enter a valid email',
            invalidPassword: 'Password is required',
            loginFailed: 'Login failed. Please check your credentials.'
          }
        },
        admin: {
          title: 'Administrator Login',
          subtitle: 'Management control panel access',
          fields: {
            username: 'Admin Username',
            password: 'Admin Password'
          },
          cta: 'Sign In',
          errors: {
            invalidUsername: 'Username is required',
            invalidPassword: 'Password is required',
            loginFailed: 'Invalid admin credentials'
          }
        },
        staff: {
          title: 'Staff Login',
          subtitle: 'Employee access portal',
          fields: {
            staffId: 'Staff ID',
            pin: 'PIN Code'
          },
          cta: 'Sign In'
        },
        staffRoles: {
          title: 'Select Your Department',
          subtitle: 'Choose your staff role to continue',
          roles: {
            cleaning: {
              title: 'Cleaning Staff',
              department: 'Housekeeping'
            },
            maintenance: {
              title: 'Maintenance Staff',
              department: 'Technical Services'
            },
            kitchen: {
              title: 'Kitchen Staff',
              department: 'Culinary'
            },
            club: {
              title: 'Club Staff',
              department: 'Recreation'
            },
            security: {
              title: 'Security Staff',
              department: 'Security'
            },
            nurse: {
              title: 'Medical Nurse',
              department: 'Medical'
            }
          }
        }
      },
      profile: {
        title: 'My Profile',
        editProfile: 'Edit Profile',
        saveChanges: 'Save Changes',
        cancelEdit: 'Cancel',
        defaultName: 'User',
        sections: {
          personalInfo: 'Personal Information',
          accountDetails: 'Account Details',
          privileges: 'Access Privileges',
          invoices: 'My Invoices',
          offers: 'My Active Offers'
        },
        fields: {
          name: 'Full Name',
          fullName: 'Full Name',
          userId: 'User ID',
          username: 'Username',
          email: 'Email Address',
          phone: 'Phone Number',
          phoneNumber: 'Phone Number',
          preferences: 'Preferences',
          specialPreferences: 'Special Preferences',
          role: 'Role',
          accountType: 'Account Type',
          accountStatus: 'Account Status',
          memberId: 'Member ID',
          loyaltyId: 'Loyalty ID',
          memberSince: 'Member Since',
          activeDiscount: 'Active Discount',
          staffId: 'Staff ID',
          department: 'Department'
        },
        status: {
          active: 'Active',
          inactive: 'Inactive'
        },
        roles: {
          guest: 'Guest',
          staff: 'Staff Member',
          admin: 'Administrator'
        },
        accountTypes: {
          firstTime: 'First-Time Guest',
          returning: 'Returning Guest',
          vip: 'VIP Member'
        },
        invoices: {
          number: 'Invoice',
          date: 'Date',
          status: 'Status',
          paid: 'Paid',
          pending: 'Pending',
          total: 'Total Amount',
          discount: 'Discount',
          downloadPdf: 'Download PDF',
          items: {
            suiteBooking: 'Suite Booking',
            nights: 'nights',
            spaServices: 'Spa Services',
            restaurantCharges: 'Restaurant Charges',
            premiumSuite: 'Premium Suite'
          }
        },
        offers: {
          validUntil: 'Valid until:',
          status: 'Status:',
          activeNow: 'Active Now',
          claimOffer: 'Claim Offer',
          luxurySpa: {
            title: 'Luxury Spa Package',
            description: 'Full day spa experience with massage, facial, and body treatment'
          },
          michelinDining: {
            title: 'Michelin Star Dining',
            description: 'Three-course meal at our award-winning restaurant'
          },
          welcomeDiscount: {
            title: 'Your Welcome Discount',
            description: 'Automatic discount applied to all bookings and services'
          },
          loyaltyDiscount: {
            title: 'Your Loyalty Discount',
            description: 'Automatic discount applied to all bookings and services'
          }
        },
        member: 'Gold Member',
        totalBookings: 'Total Bookings',
        activeBookings: 'Active Bookings',
        totalSpent: 'Total Spent',
        loyaltyPoints: 'Loyalty Points',
        overview: 'Overview',
        myBookings: 'My Bookings',
        myOrders: 'My Orders',
        myServices: 'My Services',
        account: 'Account',
        settings: 'Settings',
        welcomeBack: 'Welcome back',
        overviewDescription: 'Manage your reservations, orders, and account from one place.',
        bookRoom: 'Book a Room',
        viewBookings: 'My Bookings',
        exploreServices: 'Services',
        hotelStore: 'Hotel Store',
        recentActivity: 'Recent Activity',
        recentBookings: 'Recent Bookings',
        noBookings: 'No room bookings yet.',
        noOrders: 'No orders yet.',
        noServices: 'No service bookings yet.',
        makeFirstBooking: 'Book a Room',
        room: 'Room',
        accountSettings: 'Account Settings',
        personalInfo: 'Personal Info',
        email: 'Email',
        phone: 'Phone',
        addPhone: 'Add phone number',
        dangerZone: 'Session'
      },
      floors: {
        interactiveMap: 'Interactive Floor Map',
        parkingZones: 'Parking Zones',
        amenities: 'Amenities',
        facilities: 'Facilities',
        zonePrefix: 'Zone',
        capacityLabel: 'Capacity',
        typeLabel: 'Type',
        slotsLabel: 'slots',
        unitsLabel: 'Units Available',
        roomsLabel: 'Rooms'
      },
      receptionist: {
        title: 'Guest Concierge Assistant',
        subtitle: 'Let us guide you to the perfect stay',
        chat: {
          welcome: 'Welcome! I\'m here to help you find the perfect accommodation. May I ask you a few questions?',
          numberOfGuests: 'How many guests will be staying?',
          stayType: 'What type of stay are you looking for?',
          preferences: 'Which features are most important to you?',
          duration: 'How long will you be staying?',
          specialNeeds: 'Do you have any special requirements?',
          summary: 'Based on your preferences, here are our recommendations:',
          letsBegin: 'Let\'s Begin',
          next: 'Next',
          previous: 'Previous',
          finish: 'View Recommendations',
          reset: 'Start Over'
        },
        stayTypes: {
          luxury: 'Luxury Experience',
          family: 'Family Comfort',
          business: 'Business Stay',
          quiet: 'Quiet Retreat'
        },
        features: {
          view: 'Scenic View',
          spa: 'Spa Access',
          restaurant: 'Fine Dining',
          budget: 'Budget Friendly',
          suite: 'Suite Accommodation',
          pool: 'Pool Access',
          gym: 'Fitness Center',
          parking: 'Parking Included'
        },
        duration: {
          short: '1-2 Nights',
          medium: '3-7 Nights',
          long: '7+ Nights',
          extended: 'Extended Stay (Monthly)'
        },
        specialNeeds: {
          children: 'Traveling with Children',
          elderly: 'Elderly Guest',
          medical: 'Medical Requirements',
          vip: 'VIP Services',
          accessibility: 'Accessibility Needs',
          pets: 'Pet Friendly'
        },
        recommendations: {
          title: 'Recommended for You',
          floors: 'Suggested Floors',
          rooms: 'Available Rooms',
          services: 'Recommended Services',
          viewMap: 'View on Map',
          bookNow: 'Book Now',
          learnMore: 'Learn More',
          noResults: 'No matches found. Let\'s adjust your preferences.',
          perfect: 'Perfect Match',
          good: 'Good Match',
          available: 'Available'
        },
        filters: {
          applying: 'Applying your preferences...',
          found: 'Found {{count}} options',
          refining: 'Refining results...'
        }
      },
      guestDashboard: {
        welcome: 'Welcome, {{name}}!',
        welcomeGuest: 'Welcome, Guest!',
        firstTimeDiscount: 'Your 20% First-Time Discount is Active 🎉',
        loyaltyDiscount: 'Your 10% Loyalty Discount is Active ⭐',
        quickAccess: 'Quick Access',
        latestAnnouncements: 'Latest Announcements',
        exclusiveOffers: 'Exclusive Offers',
        actions: {
          bookRoom: 'Book a Room',
          diningReservation: 'Dining Reservation',
          spaBooking: 'Spa Booking',
          premiumServices: 'Premium Services'
        },
        announcements: {
          specialOffer: {
            title: 'Special Weekend Offer',
            description: 'Get an additional 15% off on weekend bookings this month!'
          },
          newRestaurant: {
            title: 'New Restaurant Opening',
            description: 'Experience our brand new Michelin-starred restaurant on Floor 1'
          },
          maintenance: {
            title: 'Pool Maintenance Notice',
            description: 'The rooftop pool will be under maintenance on December 20-21'
          }
        },
        offers: {
          spaPackage: {
            title: '30% OFF Spa Package',
            description: 'Luxury wellness experience',
            validUntil: 'December 31, 2024'
          },
          dining: {
            title: '25% OFF Fine Dining',
            description: 'Michelin-star restaurant',
            validUntil: 'December 25, 2024'
          },
          suite: {
            title: '20% OFF Suite Upgrade',
            description: 'Premium accommodation',
            validUntil: 'December 30, 2024'
          }
        },
        claimOffer: 'Claim Offer',
        viewProfile: 'View Profile'
      },
      concierge: {
        launcherTitle: 'Concierge',
        title: 'Presidential Concierge',
        subtitle: 'Discreet guidance for a tailored stay',
        restart: 'Restart',
        close: 'Close',
        inputPlaceholder: 'Type your answer…',
        send: 'Send',
        services: {
          spa: 'Spa',
          dining: 'Dining',
          private_driver: 'Private Driver',
          medical_support: 'Medical Support'
        },
        messages: {
          greeting: 'Good day. I am your Presidential Concierge.',
          intro: 'May I ask a few quick questions to recommend the perfect stay?',
          validation: 'Kindly choose one of the options, or enter a valid answer.',
          useButtons: 'For this step, please use the buttons below.',
          noPreference: 'No preference',
          recommendationIntro: 'Based on your preferences, I recommend:',
          room: 'Room',
          services: 'Recommended Services',
          experiences: 'Signature Experiences',
          followUp: 'Would you like me to refine this for dates or special requests later?'
        },
        flow: {
          guests: {
            question: 'How many guests will be staying?',
            one: '1',
            two: '2',
            three: '3',
            fourPlus: '4+'
          },
          purpose: {
            question: 'What is the purpose of your stay?',
            business: 'Business',
            leisure: 'Leisure',
            honeymoon: 'Honeymoon',
            family: 'Family'
          },
          services: {
            question: 'Which services would you like to prioritize?',
            spa: 'Spa',
            dining: 'Dining',
            privateDriver: 'Private Driver',
            medicalSupport: 'Medical Support',
            done: 'Done'
          },
          budget: {
            question: 'Which budget level do you prefer?',
            luxury: 'Luxury',
            premium: 'Premium',
            exclusive: 'Exclusive'
          }
        }
      }
      ,
      floorMaps: {
        common: {
          floorLabel: 'Floor {{floor}}',
          instructions: 'Interactive map — select a zone to view details or proceed.',
          ariaLabel: 'Floor {{floor}} interactive map',
          restricted: 'Restricted',
          proceed: 'Proceed',
          details: 'Details',
          legend: {
            interactive: 'Interactive zone',
            restricted: 'Restricted zone'
          },
          routeModal: {
            description:
              'Select an action below to continue. The floor map remains static while this detail view floats above it.',
            destination: 'Destination'
          }
        },
        meta: {
          availability: 'Availability',
          access: 'Access',
          process: 'Process',
          security: 'Security',
          transfer: 'Transfer',
          coverage: 'Coverage',
          control: 'Control',
          function: 'Function',
          capacity: 'Capacity',
          purpose: 'Purpose',
          operations: 'Operations',
          standard: 'Standard',
          design: 'Design',
          flow: 'Flow',
          services: 'Services',
          service: 'Service',
          atmosphere: 'Atmosphere',
          highlights: 'Highlights',
          support: 'Support',
          layouts: 'Layouts',
          use: 'Use',
          bestFor: 'Best for',
          meals: 'Meals',
          separation: 'Separation',
          impact: 'Impact',
          experience: 'Experience'
        },
        actions: {
          proceedToBooking: 'Proceed to Booking',
          exploreChauffeur: 'Explore Chauffeur Service',
          viewPremiumServices: 'View Premium Services',
          exploreConcierge: 'Explore Concierge',
          exploreSpaWellness: 'Explore Spa & Wellness',
          exploreServiceRequests: 'Explore Service Requests',
          requestService: 'Request Service',
          viewStaffResidences: 'View Staff Residences',
          viewServiceRequests: 'View Service Requests',
          exploreWellnessFacilities: 'Explore Wellness Facilities'
        },
        floors: {
          b2: {
            name: 'Main Parking Level',
            zones: {
              valet: {
                label: 'Valet Drop-off',
                hint: 'Premium vehicle handover',
                title: 'Valet Drop-off',
                subtitle: 'Seamless arrival, discreet handling, and priority access.',
                description:
                  'Our valet team operates with security clearance and time-stamped handover protocols. Vehicles are moved through controlled corridors to reserved bays with monitored access.',
                meta: {
                  availability: '24/7',
                  access: 'Guests & VIP',
                  process: 'Verified handover + digital ticket'
                }
              },
              ev: {
                label: 'EV Charging Bay',
                hint: 'Fast charging corridor',
                title: 'EV Charging Bay',
                subtitle: 'Quiet, temperature-controlled charging with monitored bays.',
                description:
                  'Dedicated EV bays are positioned closest to the security corridor. Each station supports scheduled access and smart monitoring to protect both vehicle and guest privacy.',
                meta: {
                  availability: 'Limited slots',
                  access: 'Guest vehicles',
                  security: 'Camera + access log'
                }
              },
              vip: {
                label: 'VIP Reserved Bays',
                hint: 'Controlled access section',
                title: 'VIP Reserved Bays',
                subtitle: 'Security-controlled bays for high-profile arrivals.',
                description:
                  'VIP bays are separated by physical barriers and staffed checkpoints. The access protocol is designed for discretion, rapid elevator transfer, and minimal exposure.',
                meta: {
                  availability: 'By approval',
                  access: 'VIP + Security escort',
                  transfer: 'Private elevator corridor'
                }
              },
              security: {
                label: 'Security Checkpoint',
                hint: 'Controlled entry & monitoring',
                title: 'Security Checkpoint',
                subtitle: 'Monitoring and controlled access for vehicle corridors.',
                description:
                  'This area coordinates CCTV coverage, barrier control, and incident response. Guest access is guided and verified at every critical junction.',
                meta: {
                  access: 'Restricted',
                  coverage: 'CCTV + patrol routes',
                  control: 'Gates + elevator corridor'
                }
              },
              maintenance: {
                label: 'Maintenance Bay',
                hint: 'Service vehicles & equipment',
                title: 'Maintenance Bay',
                subtitle: 'Operational bay for safety and facility reliability.',
                description:
                  'Engineering teams handle routine inspections, incident-ready tooling, and infrastructure support for parking operations. Guest entry is restricted for safety.',
                meta: {
                  access: 'Restricted',
                  function: 'Engineering & safety',
                  availability: '24/7 operations'
                }
              },
              guestElevators: {
                label: 'Guest Elevator Core',
                hint: 'Direct access to lobby'
              }
            }
          },
          b1: {
            name: 'Services & Support Level',
            zones: {
              laundry: {
                label: 'Industrial Laundry',
                hint: 'Linen processing & sterilization',
                title: 'Industrial Laundry',
                subtitle: 'Precision hygiene, daily throughput, and textile care.',
                description:
                  'Linen circulation is handled with strict separation between clean and used flows. This ensures uncompromised guest comfort and operational reliability.',
                meta: {
                  access: 'Restricted',
                  capacity: 'High throughput',
                  purpose: 'Guest linen & uniforms'
                }
              },
              storage: {
                label: 'Storage Units',
                hint: 'Inventory & secure supplies',
                title: 'Storage Units',
                subtitle: 'Controlled inventory zones with audit visibility.',
                description:
                  'Procurement, amenities, and event supplies are stored in structured aisles with restricted access. The zone supports fast replenishment without guest impact.',
                meta: {
                  access: 'Restricted',
                  purpose: 'Amenities & supplies',
                  security: 'Logged access'
                }
              },
              housekeeping: {
                label: 'Housekeeping HQ',
                hint: 'Operations command & dispatch',
                title: 'Housekeeping HQ',
                subtitle: 'Dispatch, quality checks, and guest-ready standards.',
                description:
                  'This hub coordinates room readiness, turndown schedules, and VIP preparation protocols. It is designed for speed, silence, and precise execution.',
                meta: {
                  access: 'Restricted',
                  operations: '24/7',
                  standard: 'VIP preparation protocols'
                }
              },
              serviceElevators: {
                label: 'Service Elevator Core',
                hint: 'Operational vertical access',
                title: 'Service Elevator Core',
                subtitle: 'Separated circulation for staff and operations.',
                description:
                  'Service circulation is architected to keep guest pathways calm and uninterrupted while enabling high-efficiency logistics.',
                meta: {
                  access: 'Restricted',
                  purpose: 'Operations flow',
                  design: 'Guest separation'
                }
              },
              additionalParking: {
                label: 'Additional Parking',
                hint: 'Overflow & staff vehicles'
              },
              guestCore: {
                label: 'Guest Elevator Link',
                hint: 'Direct access to lobby'
              }
            }
          },
          0: {
            name: 'Grand Lobby & Reception',
            zones: {
              entrance: {
                label: 'Grand Entrance',
                hint: 'Arrival axis',
                title: 'Grand Entrance',
                subtitle: 'A ceremonial arrival designed for first impressions.',
                description:
                  'The entrance corridor is intentionally calm: controlled lighting, acoustic treatment, and a clear path toward reception. Staff positioning supports immediate assistance without visual clutter.',
                meta: {
                  access: 'Public',
                  purpose: 'Arrival & welcome',
                  flow: 'Direct to reception'
                }
              },
              reception: {
                label: 'Reception Desk',
                hint: 'Check-in & concierge',
                title: 'Reception Desk',
                subtitle: 'Discreet check-in supported by concierge craftsmanship.',
                description:
                  'Reception operates with layered service: main desk, VIP handling, and priority support. Your requests are routed to the right team instantly.',
                meta: {
                  availability: '24/7',
                  access: 'Public',
                  services: 'Concierge + VIP handling'
                }
              },
              lounge: {
                label: 'Luxury Lounge',
                hint: 'Waiting & hospitality',
                title: 'Luxury Lounge',
                subtitle: 'Quiet comfort, curated refreshments, and city views.',
                description:
                  'The lounge is designed for calm transitions: check-in waiting, informal meetings, and private moments. Seating is arranged to preserve personal space.',
                meta: {
                  access: 'Guests',
                  availability: 'All day',
                  atmosphere: 'Low-noise premium'
                }
              },
              garden: {
                label: 'Indoor Garden',
                hint: 'Waterfall & botanical zone',
                title: 'Indoor Garden',
                subtitle: 'Botanical calm designed to slow time.',
                description:
                  'A climate-managed micro-garden with ambient water acoustics. The space provides a calm anchor for arrivals, meetings, and late-night returns.',
                meta: {
                  access: 'Public',
                  purpose: 'Rest & ambiance',
                  design: 'Acoustic + lighting control'
                }
              },
              retail: {
                label: 'Boutique Shops',
                hint: 'Luxury retail corridor',
                title: 'Boutique Shops',
                subtitle: 'Curated luxury with discreet service.',
                description:
                  'A calm retail corridor featuring premium brands and curated gifts. Staff assistance is available without interrupting guest flow.',
                meta: {
                  access: 'Public',
                  availability: 'Daily',
                  service: 'Gift wrapping + concierge sourcing'
                }
              },
              cafe: {
                label: 'Café & Bar',
                hint: 'Artisan coffee & premium drinks'
              }
            }
          },
          1: {
            name: 'Culinary Excellence',
            zones: {
              main: {
                label: 'Main Restaurant',
                hint: 'Signature dining'
              },
              vip: {
                label: 'VIP Lounge',
                hint: 'Private dining & late hours',
                title: 'VIP Lounge',
                subtitle: 'Private dining, controlled ambiance, discreet access.',
                description:
                  'The VIP lounge is designed for privacy: separated seating clusters, premium audio control, and direct coordination with concierge and security on request.',
                meta: {
                  access: 'Guests + approval',
                  availability: 'Late hours',
                  service: 'Sommelier + private menus'
                }
              },
              cafe: {
                label: 'Café Royale',
                hint: 'All-day café',
                title: 'Café Royale',
                subtitle: 'Artisan coffee, pastries, and quiet conversations.',
                description:
                  'A refined café environment with premium beans and a controlled acoustic profile—ideal for meetings, reading, and casual luxury.',
                meta: {
                  availability: '24/7 concept',
                  access: 'Guests + public',
                  highlights: 'Pastries + signature drinks'
                }
              },
              breakfast: {
                label: 'Breakfast Hall',
                hint: 'Morning buffet & à la carte',
                title: 'Breakfast Hall',
                subtitle: 'A calm morning ritual with premium selection.',
                description:
                  'The breakfast hall is optimized for flow: clear stations, low wait times, and a quiet seating layout. Dietary preferences are supported by dedicated preparation protocols.',
                meta: {
                  availability: 'Morning hours',
                  access: 'Guests',
                  service: 'Dietary accommodations'
                }
              }
            }
          },
          2: {
            name: 'Events & Conferences',
            zones: {
              grandHall: {
                label: 'Grand Wedding Hall',
                hint: 'Ceremonial hall',
                title: 'Grand Wedding Hall',
                subtitle: 'A flagship hall crafted for unforgettable ceremonies.',
                description:
                  'The hall supports flexible seating, dynamic stage configuration, and premium lighting control. On-site planners coordinate timing, catering, and guest flow.',
                meta: {
                  capacity: 'Up to 500',
                  availability: 'By booking',
                  service: 'Planning + catering'
                }
              },
              conference: {
                label: 'Conference Center',
                hint: 'Corporate events',
                title: 'Conference Center',
                subtitle: 'Executive-grade technology and controlled acoustics.',
                description:
                  'A scalable conference environment with dedicated A/V support and a professional hospitality backbone. Suitable for summits, launches, and closed sessions.',
                meta: {
                  capacity: 'Up to 300',
                  availability: 'By booking',
                  support: 'A/V + concierge routing'
                }
              },
              meetings: {
                label: 'Meeting Rooms',
                hint: '8 modular rooms',
                title: 'Meeting Rooms',
                subtitle: 'Private, modular rooms for focused sessions.',
                description:
                  'Rooms are designed with controlled lighting and a clean visual profile. Furniture can be configured for boardroom, classroom, or lounge setups.',
                meta: {
                  availability: 'By booking',
                  capacity: '20–50 per room',
                  layouts: 'Boardroom + classroom'
                }
              },
              vipSuite: {
                label: 'VIP Meeting Suite',
                hint: 'High-privacy boardroom',
                title: 'VIP Meeting Suite',
                subtitle: 'Executive privacy with controlled access.',
                description:
                  'A dedicated suite for confidential sessions. Entry is managed via concierge and security protocols. Service delivery is discreet and precisely timed.',
                meta: {
                  access: 'Restricted',
                  availability: 'By approval',
                  service: 'Private catering'
                }
              }
            }
          },
          3: {
            name: 'Wellness & Recreation',
            zones: {
              gym: {
                label: 'Fitness Center',
                hint: 'State-of-the-art gym'
              },
              spa: {
                label: 'Royal Spa',
                hint: 'Treatments & wellness'
              },
              pool: {
                label: 'Indoor Pool',
                hint: 'Calm water sanctuary'
              },
              sauna: {
                label: 'Sauna & Steam',
                hint: 'Thermal suite',
                title: 'Sauna & Steam',
                subtitle: 'Thermal restoration with controlled humidity and heat.',
                description:
                  'A quiet thermal suite built for post-training recovery and deep relaxation. Guests can reserve guided sessions through concierge or wellness reception.',
                meta: {
                  availability: 'Daily',
                  access: 'Guests',
                  use: 'Recovery + relaxation'
                }
              },
              relax: {
                label: 'Relaxation Lounges',
                hint: 'Quiet recovery',
                title: 'Relaxation Lounges',
                subtitle: 'Soft lighting, calm seating, and privacy-first layout.',
                description:
                  'The lounge zone supports post-treatment recovery and quiet time. Seating geometry is tuned for personal space and minimal cross-traffic.',
                meta: {
                  access: 'Guests',
                  atmosphere: 'Calm + low noise',
                  bestFor: 'Post-treatment recovery'
                }
              }
            }
          },
          4: {
            name: 'Standard Rooms',
            zones: {
              wingA: {
                label: 'Wing A (401–420)',
                hint: 'Single rooms cluster'
              },
              wingB: {
                label: 'Wing B (421–445)',
                hint: 'Double rooms cluster'
              },
              wingC: {
                label: 'Wing C (446–465)',
                hint: 'Twin rooms cluster'
              },
              serviceCore: {
                label: 'Service Core',
                hint: 'Housekeeping access',
                title: 'Service Core',
                subtitle: 'Operational access designed to stay invisible to guests.',
                description:
                  'The service core enables linen delivery, maintenance response, and quiet room servicing. It is a restricted pathway supporting premium guest calm.',
                meta: {
                  access: 'Restricted',
                  purpose: 'Operations flow',
                  design: 'Silent logistics'
                }
              },
              elevators: {
                label: 'Guest Elevators',
                hint: 'Vertical access'
              }
            }
          },
          5: {
            name: 'Deluxe Rooms',
            zones: {
              city: {
                label: 'City View Deluxe',
                hint: 'Panoramic skyline'
              },
              garden: {
                label: 'Garden View Deluxe',
                hint: 'Terraces & calm'
              },
              lounge: {
                label: 'VIP Guest Lounge',
                hint: 'Quiet refreshments',
                title: 'VIP Guest Lounge',
                subtitle: 'A calm lounge for deluxe-category guests.',
                description:
                  'Refreshments, quiet seating, and concierge routing in a controlled environment. Designed for short meetings and evening wind-down.',
                meta: {
                  access: 'Eligible guests',
                  availability: 'Daily',
                  service: 'Concierge routing'
                }
              },
              core: {
                label: 'Elevator Core',
                hint: 'Lobby link'
              }
            }
          },
          6: {
            name: 'Premium Rooms',
            zones: {
              premium: {
                label: 'Premium Rooms',
                hint: 'Living area + balcony'
              },
              family: {
                label: 'Premium Family',
                hint: 'Two bedrooms'
              },
              concierge: {
                label: 'Family Concierge Point',
                hint: 'Priority assistance'
              },
              core: {
                label: 'Elevator Core',
                hint: 'Lobby link'
              }
            }
          },
          7: {
            name: 'Luxury Suites',
            zones: {
              exec: {
                label: 'Executive Suites',
                hint: 'Office + meeting room'
              },
              luxury: {
                label: 'Luxury Suites',
                hint: 'Living + dining'
              },
              royal: {
                label: 'Royal Suites',
                hint: 'Jacuzzi + private kitchen'
              },
              butler: {
                label: 'Butler Service Point',
                hint: 'Personalized service'
              }
            }
          },
          8: {
            name: 'Presidential Floor',
            zones: {
              suite: {
                label: 'Presidential Suite',
                hint: 'Exclusive residence'
              },
              pool: {
                label: 'Private Indoor Pool',
                hint: 'Climate-controlled privacy',
                title: 'Private Indoor Pool',
                subtitle: 'A secluded pool designed for absolute privacy.',
                description:
                  'This pool is accessible only through the presidential corridor. Service is routed via dedicated staff to protect privacy and maintain a calm atmosphere.',
                meta: {
                  access: 'Restricted',
                  availability: 'By suite access',
                  service: 'Dedicated staff'
                }
              },
              cinema: {
                label: 'Private Cinema',
                hint: 'State-of-the-art theater',
                title: 'Private Cinema',
                subtitle: 'A private theater with controlled sound and seating.',
                description:
                  'A compact theater designed for presidential privacy. Content selection and scheduling can be coordinated through concierge.',
                meta: {
                  access: 'Restricted',
                  availability: 'By suite access',
                  service: 'Concierge scheduling'
                }
              },
              office: {
                label: 'Executive Office',
                hint: 'Business facilities',
                title: 'Executive Office',
                subtitle: 'Private business environment with controlled access.',
                description:
                  'An executive-grade workspace designed for secure meetings and confidential workflows. Support is available through premium services.',
                meta: {
                  access: 'Restricted',
                  availability: 'By suite access',
                  support: 'Premium services'
                }
              }
            }
          },
          9: {
            name: 'Staff Residences',
            zones: {
              accommodation: {
                label: 'Staff Accommodation',
                hint: 'Living quarters',
                title: 'Staff Accommodation',
                subtitle: 'Quiet living quarters supporting operational excellence.',
                description:
                  'A dedicated residence floor for staff to ensure rapid response and stable operations. Zones are separated from guest pathways and managed under access control.',
                meta: {
                  access: 'Restricted',
                  purpose: 'Operational readiness',
                  separation: 'Guest pathways isolated'
                }
              },
              dining: {
                label: 'Staff Dining Hall',
                hint: 'Three meal service',
                title: 'Staff Dining Hall',
                subtitle: 'Healthy meals scheduled for operational shifts.',
                description:
                  'This facility supports staff well-being with structured meal service across shifts. The environment is efficient, clean, and optimized for fast throughput.',
                meta: {
                  access: 'Restricted',
                  meals: 'Daily schedule',
                  purpose: 'Staff well-being'
                }
              },
              training: {
                label: 'Training Center',
                hint: 'Professional development',
                title: 'Training Center',
                subtitle: 'Operational training and standards reinforcement.',
                description:
                  'Training reinforces hospitality standards, safety routines, and service consistency. This supports premium outcomes across the entire hotel.',
                meta: {
                  access: 'Restricted',
                  purpose: 'Standards + safety',
                  impact: 'Guest experience quality'
                }
              },
              recreation: {
                label: 'Recreation & Wellness',
                hint: 'Staff recovery',
                title: 'Recreation & Wellness',
                subtitle: 'Recovery spaces that sustain excellent service.',
                description:
                  'Staff recovery spaces support consistent performance and well-being. The layout is simple, controlled, and separated from operational corridors.',
                meta: {
                  access: 'Restricted',
                  purpose: 'Recovery',
                  design: 'Quiet & functional'
                }
              }
            }
          },
          10: {
            name: 'Helipad Level',
            zones: {
              helipad: {
                label: 'Main Helipad',
                hint: 'Executive arrivals',
                title: 'Main Helipad',
                subtitle: 'A controlled arrival facility for distinguished guests.',
                description:
                  'Operations are coordinated through security and aviation staff. Guest movement is routed to VIP reception and private elevator corridors for minimal exposure.',
                meta: {
                  access: 'Restricted',
                  availability: 'By approval',
                  flow: 'VIP reception + private elevators'
                }
              },
              vipReception: {
                label: 'VIP Reception',
                hint: 'Private arrival lounge',
                title: 'VIP Reception',
                subtitle: 'Discreet lounge for air arrivals.',
                description:
                  'A calm arrival zone with concierge support and security routing. Designed for immediate transition into the hotel without public exposure.',
                meta: {
                  access: 'Restricted',
                  service: 'Concierge + escort',
                  transfer: 'Private elevator corridor'
                }
              },
              control: {
                label: 'Landing Control',
                hint: 'Navigation & coordination',
                title: 'Landing Control',
                subtitle: 'Navigation systems and operational coordination.',
                description:
                  'The control center manages weather checks, approach protocols, and secure arrival timing. Guest access is restricted for safety and security.',
                meta: {
                  access: 'Restricted',
                  purpose: 'Safety + coordination',
                  availability: '24/7 readiness'
                }
              },
              security: {
                label: 'Security Center',
                hint: 'Monitoring & response',
                title: 'Security Center',
                subtitle: 'Advanced monitoring for executive arrivals.',
                description:
                  'Security staff coordinate escort routes, perimeter monitoring, and incident response. The layout prioritizes speed and discretion.',
                meta: {
                  access: 'Restricted',
                  coverage: 'Monitoring systems',
                  service: 'Escort coordination'
                }
              }
            }
          },
          11: {
            name: 'Sky Garden & Infinity Pool',
            zones: {
              pool: {
                label: 'Infinity Pool',
                hint: 'Sunset swim'
              },
              garden: {
                label: 'Sky Garden',
                hint: 'Botanical rooftop',
                title: 'Sky Garden',
                subtitle: 'A rooftop garden with controlled lighting and calm paths.',
                description:
                  'A curated botanical space with seating pockets and low-clutter pathways. Designed for sunrise calm and sunset gatherings without noise overload.',
                meta: {
                  access: 'Guests',
                  availability: 'Daily',
                  experience: 'Sunset + events'
                }
              },
              skybar: {
                label: 'Sky Lounge Bar',
                hint: 'Premium cocktails',
                title: 'Sky Lounge Bar',
                subtitle: 'A rooftop bar designed for elegant evenings.',
                description:
                  'Signature cocktails, calm seating clusters, and controlled lighting. Table service is available, with event scheduling through concierge.',
                meta: {
                  access: 'Guests',
                  availability: 'Evenings',
                  service: 'Table service'
                }
              },
              restaurant: {
                label: 'Panorama Restaurant',
                hint: 'Fine dining with views'
              }
            }
          }
        }
      }
      ,
      home: {
        hero: {
          title: 'Presidential Luxury',
          subtitle: 'Hotel Management System',
          description: 'Where Royalty Meets Modern Sophistication',
          actions: {
            reserve: 'Reserve Your Stay',
            exploreFloors: 'Explore Floors'
          },
          stats: {
            luxuryFloors: 'Luxury Floors',
            premiumRooms: 'Premium Rooms',
            conciergeService: 'Concierge Service'
          },
          scroll: 'Scroll to Explore'
        },
        features: {
          heading: 'Unparalleled Excellence',
          subheading: 'Experience the finest in luxury hospitality',
          items: {
            elegance: {
              title: 'Presidential Elegance',
              description: 'Experience luxury redefined across 12 meticulously designed floors'
            },
            concierge: {
              title: '24/7 Concierge',
              description: 'World-class service at your fingertips, any time of day or night'
            },
            helipad: {
              title: 'Helipad Services',
              description: 'Arrive in style with exclusive helicopter landing facilities'
            },
            rooftopPool: {
              title: 'Rooftop Infinity Pool',
              description: 'Panoramic views from our sky-high luxury pool and garden'
            }
          }
        },
        suites: {
          heading: 'Signature Suites',
          subheading: 'Indulge in our most exclusive accommodations',
          actions: {
            viewDetails: 'View Details'
          },
          items: {
            presidential: {
              title: 'Presidential Suite',
              floor: 'Floor 8',
              size: '500 sqm',
              features: 'Private Pool, Cinema, Dining Hall'
            },
            royal: {
              title: 'Royal Suite',
              floor: 'Floor 7',
              size: '350 sqm',
              features: 'Premium Amenities, City Views'
            },
            executive: {
              title: 'Executive Suite',
              floor: 'Floor 7',
              size: '200 sqm',
              features: 'Business Center, Lounge Access'
            }
          }
        },
        experience: {
          heading: 'The Presidential Experience',
          paragraphs: {
            0: 'Immerse yourself in a world where every detail reflects prestige and sophistication. From the grand lobby to the rooftop infinity pool, every floor tells a story of uncompromising luxury and timeless elegance.',
            1: 'Our 12-floor architectural masterpiece houses everything from Michelin-star dining to private helicopter services, spa facilities to presidential suites. This is not just a hotel—it\'s a destination.'
          },
          actions: {
            exploreAllFloors: 'Explore All Floors'
          }
        },
        cta: {
          heading: 'Begin Your Presidential Journey',
          subheading: 'Reserve your extraordinary experience today',
          actions: {
            bookNow: 'Book Now',
            viewServices: 'View Services'
          }
        },
        heroNew: {
          kicker: 'Presidential Luxury Hotel',
          title: 'Experience Presidential Luxury',
          subtitle: 'Where elegance begins the moment you arrive',
          stats: {
            rooms: 'Luxury Rooms',
            floors: 'Premium Floors',
            rating: 'Forbes Rating',
            concierge: 'Concierge Service'
          },
          actions: {
            exploreRooms: 'Explore Rooms',
            bookNow: 'Book Now'
          },
          scroll: 'Scroll'
        },
        about: {
          kicker: 'Our Story',
          title: 'A Century of Unrivalled Excellence',
          para1: 'For over a century, the Presidential Luxury Hotel has stood as a beacon of refinement and grace. Born from a vision to create the world\'s finest hospitality experience, every marble corridor, every suite, every service reflects a singular pursuit — perfection.',
          para2: 'From our celebrated penthouse suites to our award-winning restaurant and world-class spa, we have crafted an environment where luxury is not merely a word, but a living, breathing philosophy shared by every member of our team.',
          pillars: { heritage: 'Heritage', excellence: 'Excellence', discretion: 'Discretion', craft: 'Craft' },
          since: 'Since',
          action: 'Discover Our Story'
        },
        rooms: {
          kicker: 'Our Accommodations',
          title: 'Curated Spaces of Exceptional Comfort',
          viewAll: 'View All 60 Rooms & Suites',
          perNight: '/ night',
          viewDetails: 'View Details',
          bookNow: 'Book Now',
          badges: { mostExclusive: 'Most Exclusive', mostPopular: 'Most Popular' },
          featured: {
            r1: { name: 'Royal Suite', type: 'Royal Suite', floor: 'Floor 11', size: '420 m²', features: ['Private Pool', 'Butler 24/7', 'Panoramic Views', 'Helipad Access'] },
            r2: { name: 'Presidential Suite', type: 'Presidential Suite', floor: 'Floor 10', size: '320 m²', features: ['Private Jacuzzi', 'Full Living Room', 'Private Terrace', 'Concierge'] },
            r3: { name: 'Executive Deluxe', type: 'Deluxe', floor: 'Floor 5', size: '65 m²', features: ['City Skyline', 'King Bed', 'Marble Bathroom', 'Nespresso Bar'] }
          }
        },
        services: {
          kicker: 'Hotel Services',
          title: 'Every Detail, Perfected for You',
          explore: 'Explore →',
          items: {
            spa: { name: 'Luxury Spa', desc: 'World-class treatments, hammam, and wellness journeys' },
            dining: { name: 'Fine Dining', desc: 'Michelin-starred cuisine with globally inspired menus' },
            pool: { name: 'Infinity Pool', desc: 'Rooftop oasis with panoramic city vistas' },
            gym: { name: 'Fitness Center', desc: 'State-of-the-art equipment, personal trainers' },
            butler: { name: 'Butler Service', desc: 'A dedicated personal assistant, around the clock' },
            driver: { name: 'Airport Transfer', desc: 'Private limousine, any destination, any hour' }
          }
        },
        lifestyle: {
          kicker: 'The Experience',
          title: 'Crafted for Every Chapter of Life',
          explore: 'Explore →',
          items: {
            romantic: { title: 'Romantic Escapes', desc: 'Intimate settings, candlelit evenings, moments that last forever' },
            family: { title: 'Family Retreats', desc: 'Spacious suites and dedicated care for families who travel together' },
            business: { title: 'Business Elite', desc: 'Executive lounges, flawless connectivity, seamless productivity' },
            vip: { title: 'VIP Lifestyle', desc: 'Unlimited luxury, absolute privacy, experiences beyond compare' }
          }
        },
        testimonials: {
          kicker: 'Guest Stories',
          title: 'Words From Our Distinguished Guests',
          items: {
            t1: { quote: 'The Presidential Suite exceeded every expectation. The butler service was impeccable, the city views breathtaking. Truly a world-class experience that I will never forget.', name: 'Jonathan M.', role: 'Business Executive' },
            t2: { quote: 'Our honeymoon was absolutely perfect. Rose petal turndown, champagne on arrival, and the private jacuzzi suite made every single moment unforgettable and magical.', name: 'Sarah & James L.', role: 'Honeymooners' },
            t3: { quote: 'Travelling with three children has never been so effortless. The family suite, kids club, and family butler service exceeded everything we had hoped for.', name: 'The Al-Rashid Family', role: 'Family Stay' },
            t4: { quote: 'As a frequent business traveler, this hotel stands apart. The executive lounge, seamless concierge, and the quality of every interaction was simply extraordinary.', name: 'Chloé Dubois', role: 'Corporate Guest' }
          }
        },
        ctaNew: {
          kicker: 'Your Journey Awaits',
          title: 'Reserve Your Perfect Stay Today',
          sub: 'From $150 / night · 60 rooms & suites · Forbes Five-Star Certified',
          bookNow: 'Book Now',
          contactUs: 'Contact Us'
        },
        awards: ['Forbes Travel Guide ★★★★★', "Condé Nast Traveler's Choice", "World's Top 100 Hotels", 'Architectural Digest Award', 'AAA Five Diamond', 'Leading Hotels of the World']
      },
      footer: {
        brandName: 'Presidential Royal Palace Hotel',
        description: 'Experience unparalleled luxury and sophistication. Where presidential elegance meets modern hospitality excellence.',
        copyright: 'Presidential Royal Palace Hotel. All Rights Reserved.',
        sections: {
          ourHotel: 'Our Hotel',
          services: 'Services',
          support: 'Support'
        },
        links: {
          aboutUs: 'About Us',
          floorsOverview: 'Floors Overview',
          roomsSuites: 'Rooms & Suites',
          services: 'Services',
          restaurant: 'Restaurant',
          spaWellness: 'Spa & Wellness',
          eventHalls: 'Event Halls',
          helipadServices: 'Helipad Services',
          contactUs: 'Contact Us',
          faqs: 'FAQs',
          terms: 'Terms & Conditions',
          privacy: 'Privacy Policy'
        }
      },
      floorsOverview: {
        hero: {
          title: 'Explore Our Floors',
          description: 'Journey through 12 levels of presidential luxury, each floor meticulously designed to offer unique experiences and unparalleled service'
        },
        floorLabel: 'Floor',
        stats: {
          totalLevels: 'Total Levels',
          roomsSuites: 'Rooms & Suites',
          serviceLevels: 'Service Levels',
          operations: 'Operations'
        },
        floors: {
          b2: 'Main Parking',
          b1: 'Services & Support',
          f0: 'Grand Lobby',
          f1: 'Culinary Excellence',
          f2: 'Events & Conferences',
          f3: 'Wellness & Recreation',
          f4: 'Standard Rooms',
          f5: 'Deluxe Rooms',
          f6: 'Premium Rooms',
          f7: 'Luxury Suites',
          f8: 'Presidential Floor',
          f9: 'Staff Residences',
          f10: 'Helipad Level',
          f11: 'Sky Garden & Pool'
        },
        cta: {
          title: 'Ready to Experience Presidential Luxury?',
          subtitle: 'Book your stay and explore every level of elegance',
          bookNow: 'Book Now',
          viewRooms: 'View Rooms'
        },
        categories: {
          all: 'All Floors',
          rooms: 'Accommodations',
          amenities: 'Amenities',
          exclusive: 'Exclusive',
          services: 'Services'
        },
        badges: {
          vip: 'VIP Floor',
          ai: 'AI Recommended',
          floor: 'FLOOR'
        },
        actions: {
          explore: 'Explore Floor',
          viewRooms: 'View Rooms',
          bookStay: 'Book Your Stay',
          browseRooms: 'Browse All Rooms'
        },
        statsBar: {
          levels: 'Total Levels',
          rooms: 'Rooms & Suites',
          areas: 'Service Areas',
          operations: 'Operations'
        },
        ctaNew: {
          kicker: 'Your Stay Awaits',
          title: 'Reserve Your Perfect Level of Luxury',
          sub: 'From $150 / night · 300+ rooms & suites · Forbes Five-Star Certified'
        },
        heroNew: {
          kicker: 'Presidential Luxury Hotel',
          title: 'Discover Every Floor & Level',
          sub: 'From underground parking to the rooftop sky garden — explore 14 meticulously designed levels of uncompromising presidential luxury'
        },
        floors: {
          b2: { name: 'Underground Parking', description: 'Secure multi-level parking with 150 spaces, EV charging stations and full valet service', features: ['150 Parking Slots', 'EV Charging', 'Valet Service'] },
          b1: { name: 'Services & Support', description: 'Operational excellence hub — laundry, cold storage, housekeeping and engineering', features: ['Laundry Suite', 'Cold Storage', 'Engineering'] },
          f0: { name: 'Grand Lobby & Reception', description: 'An architectural masterpiece — triple-height ceilings, crystal chandeliers and an indoor botanical garden', features: ['Concierge 24/7', '8 Boutiques', 'Indoor Garden'] },
          f1: { name: 'Culinary Excellence', description: 'Four world-class restaurants helmed by Michelin-starred chefs with globally inspired menus', features: ['4 Restaurants', '480 Capacity', '25+ Chefs'] },
          f2: { name: 'Events & Conferences', description: 'Grand ballrooms and state-of-the-art conference facilities for up to 800 guests', features: ['10 Event Spaces', '800+ Capacity', '2500 SQM'] },
          f3: { name: 'Wellness & Recreation', description: 'An oasis of tranquility — world-class spa, state-of-the-art gym and infinity pool', features: ['600 SQM Spa', '400 SQM Gym', 'Infinity Pool'] },
          f4: { name: 'Standard Accommodations', description: 'Elegant rooms designed for every comfort with premium finishes and city views', features: ['80 Rooms', '35–50 SQM', 'City Views'] },
          f5: { name: 'Deluxe Rooms', description: 'Elevated comfort with spacious layouts, private balconies and premium amenities throughout', features: ['60 Rooms', '60–65 SQM', 'Private Balcony'] },
          f6: { name: 'Premium Rooms', description: 'Elevated living with expansive family suites, butler-access and panoramic views', features: ['50 Rooms', '75–90 SQM', 'Family Suites'] },
          f7: { name: 'Luxury Suites', description: 'Exclusive suites with dedicated butler service, private dining and panoramic city vistas', features: ['35 Suites', '120–200 SQM', 'Butler 24/7'] },
          f8: { name: 'Presidential Floor', description: 'The absolute apex of luxury — private pool, cinema room and a full private dining hall', features: ['500 SQM Suite', 'Private Pool', 'Private Cinema'] },
          f9: { name: 'Staff Residences', description: 'Premium accommodations for our world-class hospitality team with recreation center', features: ['80 Rooms', 'Recreation', 'Training Hub'] },
          f10: { name: 'Helipad Level', description: 'VIP rooftop arrival — twin helipads, exclusive lounge and dedicated aviation concierge', features: ['2 Helipads', 'VIP Lounge', 'Aviation Office'] },
          f11: { name: 'Rooftop Sky Garden', description: '360° panoramic skyline views with an infinity pool, sky bar and manicured gardens', features: ['450 SQM Pool', '800 SQM Garden', '360° Views'] }
        }
      },
      premiumServices: {
        hero: {
          title: 'Premium Services',
          subtitle: 'Exceptional amenities and personalized service for the most discerning guests'
        },
        card: {
          requestService: 'Request Service'
        },
        items: {
          medical: { name: '24/7 Medical Support', desc: 'On-call physicians and emergency medical services' },
          butler: { name: 'Personal Butler', desc: 'Dedicated butler service for your every need' },
          security: { name: 'VIP Security', desc: 'Discreet personal security and protection services' },
          maintenance: { name: 'Priority Maintenance', desc: 'Instant response for any technical requirements' },
          carFleet: { name: 'Luxury Car Fleet', desc: 'Premium vehicles with professional chauffeurs' },
          helicopter: { name: 'Helicopter Services', desc: 'Private helicopter transfers and tours' },
          wellness: { name: 'Wellness Programs', desc: 'Personalized health and wellness programs' },
          fitnessTrainers: { name: 'Personal Trainers', desc: 'Expert fitness trainers at your service' },
          eventPlanning: { name: 'Event Planning', desc: 'Full-service event coordination and management' },
          businessSupport: { name: 'Business Center', desc: 'Executive business support and facilities' }
        }
      },
      rooms: {
        hero: {
          title: 'Luxury Accommodations',
          description:
            'Discover our collection of elegantly appointed rooms, each designed to provide the ultimate comfort and luxury'
        },
        filters: {
          all: 'All Rooms',
          standard: 'Standard',
          deluxe: 'Deluxe',
          premium: 'Premium'
        },
        card: {
          floor: 'Floor {{floor}}',
          size: '{{size}} sqm',
          pricePerNight: '${{price}}/night',
          viewDetails: 'View Details'
        },
        items: {
          single: { type: 'Single Room' },
          double: { type: 'Double Room' },
          twin: { type: 'Twin Room' },
          deluxe: { type: 'Deluxe Room' },
          deluxeCity: { type: 'Deluxe City View' },
          premium: { type: 'Premium Room' },
          premiumFamily: { type: 'Premium Family' },
          superior: { type: 'Superior Room' }
        },
        amenities: {
          kingBed: 'King Bed',
          cityView: 'City View',
          workstation: 'Workstation',
          miniBar: 'Mini Bar',
          twoQueenBeds: 'Two Queen Beds',
          balcony: 'Balcony',
          smartTv: 'Smart TV',
          safe: 'Safe',
          twinBeds: 'Twin Beds',
          gardenView: 'Garden View',
          sittingArea: 'Sitting Area',
          wifi: 'Wi‑Fi',
          premiumView: 'Premium View',
          largeBalcony: 'Large Balcony',
          espressoMachine: 'Espresso Machine',
          panoramicView: 'Panoramic View',
          workDesk: 'Work Desk',
          sofa: 'Sofa',
          luxuryBath: 'Luxury Bath',
          livingArea: 'Living Area',
          wineFridge: 'Wine Fridge',
          premiumLinens: 'Premium Linens',
          twoBedrooms: 'Two Bedrooms',
          kitchenette: 'Kitchenette',
          familyLounge: 'Family Lounge',
          extraSpace: 'Extra Space',
          oceanView: 'Ocean View',
          premiumAmenities: 'Premium Amenities',
          largeBathroom: 'Large Bathroom'
        },
        types: {
          STANDARD: 'Standard',
          SINGLE: 'Single',
          COUPLE: 'Couple',
          FAMILY: 'Family',
          DELUXE: 'Deluxe',
          JUNIOR_SUITE: 'Junior Suite',
          EXECUTIVE_SUITE: 'Executive Suite',
          FAMILY_SUITE: 'Family Suite',
          PRESIDENTIAL_SUITE: 'Presidential Suite',
          ROYAL_SUITE: 'Royal Suite'
        },
        allFilters: {
          all: 'All Rooms',
          STANDARD: 'Standard',
          SINGLE: 'Single',
          COUPLE: 'Couple',
          FAMILY: 'Family',
          DELUXE: 'Deluxe',
          suites: 'Suites'
        },
        status: {
          available: 'Available',
          booked: 'Currently Booked',
          nearAvailable: 'Available Soon',
          maintenance: 'Maintenance'
        },
        roomCard: {
          bookNow: 'Book Now',
          viewDetails: 'View Details',
          perNight: '/ night',
          sqm: 'sqm',
          guests: 'guests',
          booked: 'Booked',
          availableSoon: 'Available Soon'
        },
        page: {
          label: 'Presidential Luxury Hotel',
          title: 'Our Rooms & Suites',
          found: '{{count}} {{type}} found',
          roomsType: 'rooms',
          suitesType: 'suites',
          loading: 'Loading rooms…',
          empty: 'No rooms in this category.',
          showAll: 'Show All',
          floorTag: 'Floor {{n}}',
          roomTitle: 'Room {{n}}',
          prev: '← Prev',
          next: 'Next →',
          bed: 'Bed',
          beds: 'Beds',
          bath: 'Bath',
          baths: 'Baths',
          details: 'Details',
          unavailable: 'Unavailable',
          pricePerNight: '/night',
          bookedMsg: 'This room is currently booked.',
          checkoutMsg: 'Checking out soon.',
          availableOn: 'Available again on:',
          freeOn: 'Free on:',
          overlayBooked: '🔴 Booked',
          overlaySoon: '🟣 Available Soon',
          overlayMaintenance: '🔧 Maintenance'
        },
        legend: {
          available: '● Available',
          soon: '● Available Soon',
          booked: '● Booked'
        },
        featureTags: {
          jacuzzi: 'Jacuzzi',
          balcony: 'Balcony',
          butler: 'Butler',
          livingRoom: 'Living Room',
          diningArea: 'Dining Area',
          privatePool: 'Private Pool',
          minibar: 'Minibar',
          nespresso: 'Nespresso',
        },
        viewMap: {
          cityView: 'City View',
          oceanView: 'Ocean View',
          poolView: 'Pool View',
          gardenView: 'Garden View',
          panoramicCity: 'Panoramic City',
          skylinePanorama: 'Skyline Panorama',
          panorama360: '360° Panorama',
          horizon360: '360° Horizon',
          panoramicSkyline: 'Panoramic Skyline',
        },
        bedTypeMap: {
          kingBed: 'King Bed',
          queenBed: 'Queen Bed',
          singleBed: 'Single Bed',
          queenBunk: 'Queen + Bunk',
          emperorBed: 'Emperor Bed',
          emperorKing: 'Emperor + King',
          twinBeds: 'Twin Beds',
        },
      },
      suiteDetail: {
        notFound: 'Suite Not Found',
        notFoundText: "The suite you're looking for doesn't exist.",
        backToSuites: 'Back to Suites',
        loginMessage: 'Please log in so we can assist you with booking.',
        labels: {
          size: 'Size',
          floor: 'Floor',
          guests: 'Guests',
          beds: 'Beds',
          upTo: 'Up to {{n}}',
          about: 'About This Suite',
          amenities: 'Suite Amenities',
          luxuryServices: 'Luxury Services',
          included: 'Included',
          from: 'From',
          perNight: 'per night',
          bestRate: 'Best Rate Guarantee',
          freeCancellation: 'Free Cancellation (48h)',
          memberBenefits: 'Exclusive Member Benefits',
          bookSuite: 'Book This Suite',
          callUs: 'Or call us:',
        },
        suites: {
          executive: {
            name: 'Executive Suite',
            tagline: 'Where Business Meets Luxury',
            description: [
              'The Executive Suite offers the perfect blend of sophisticated comfort and professional functionality. Spanning 120 square meters on our prestigious 7th floor, this suite features a dedicated workspace with ergonomic seating, high-speed fiber internet, and a private meeting area for up to 4 guests.',
              'The master bedroom showcases a premium king-size bed with Egyptian cotton linens, while the separate living area provides an elegant space for relaxation or entertaining. Floor-to-ceiling windows offer panoramic city views, flooding the space with natural light.'
            ],
            amenities: [
              'Private Executive Lounge Access',
              'Dedicated Concierge Service',
              'Premium Mini Bar (Complimentary)',
              'Nespresso Machine & Tea Selection',
              'Smart Home Controls',
              'Bang & Olufsen Sound System',
              '65" 4K Smart TV',
              'Marble Bathroom with Rain Shower',
              'Separate Soaking Tub',
              'Luxury Bulgari Toiletries',
              'Walk-in Closet',
              'In-room Safe (Laptop Size)',
              'Iron & Ironing Board',
              'Daily Newspaper Service'
            ],
            luxuryServicesIncluded: [
              'Private Check-in/Check-out',
              'Welcome Champagne & Chocolates',
              'Turndown Service with Candles',
              'Priority Restaurant Reservations',
              'Complimentary Pressing (2 items)'
            ],
            luxuryServicesExtra: [
              { name: 'Airport Limousine Transfer', price: '$150' },
              { name: '24-hour Butler Service', price: '$200/day' },
              { name: 'In-Suite Dining Experience', price: 'Menu prices' }
            ]
          },
          luxury: {
            name: 'Luxury Suite',
            tagline: 'Indulgence Redefined',
            description: [
              'The Luxury Suite represents the epitome of refined elegance. At 150 square meters, this expansive retreat features separate living and dining areas, a private study, and a master bedroom that rivals the finest boutique hotels in the world.',
              'Custom Italian furnishings, original artwork, and hand-woven carpets create an atmosphere of timeless sophistication. The suite includes a private terrace with outdoor seating, perfect for enjoying morning coffee or evening cocktails while taking in breathtaking views of the cityscape.'
            ],
            amenities: [
              'Private Terrace with City Views',
              'Separate Living & Dining Areas',
              'Private Study Room',
              'Full Kitchen Facilities',
              'Wine Refrigerator (Stocked)',
              'Bose Surround Sound System',
              '75" OLED Smart TV',
              'Master Bathroom with Steam Shower',
              'Jacuzzi Tub for Two',
              'La Prairie Toiletries',
              'Walk-in Closet with Valet',
              'In-suite Espresso Bar',
              'Personal Safe (Jewelry Size)',
              'Twice Daily Housekeeping'
            ],
            luxuryServicesIncluded: [
              'Private Check-in with Champagne',
              'Welcome Fruit Basket & Wine',
              'Evening Turndown with Chocolates',
              'Dedicated Suite Host',
              'Complimentary Spa Treatment (60 min)',
              '24-hour Butler Service'
            ],
            luxuryServicesExtra: [
              { name: 'Private Chef Experience', price: '$500' },
              { name: 'Chauffeur Service (4 hours)', price: '$300' }
            ]
          },
          royal: {
            name: 'Royal Suite',
            tagline: 'Live Like Royalty',
            description: [
              'The Royal Suite offers an unparalleled living experience across 200 square meters of meticulously designed space. Featuring two bedrooms, each with its own ensuite bathroom, this suite is perfect for families or traveling companions who desire both togetherness and privacy.',
              'The grand living room features 12-foot ceilings, crystal chandeliers, and a formal dining area that seats eight. A private library stocked with curated books, a home cinema system, and a fully equipped gourmet kitchen make this suite a destination in itself.'
            ],
            amenities: [
              'Two Bedroom Suites with Ensuite',
              'Grand Living Room (12ft Ceilings)',
              'Private Library',
              'Home Cinema System',
              'Gourmet Kitchen',
              'Formal Dining for 8',
              'Crystal Chandeliers',
              'Steinway Piano',
              'Private Gym Equipment',
              'Dual Master Bathrooms',
              'Hermes Toiletries',
              'Private Wine Cellar',
              'Art Collection',
              'Three Daily Housekeepings'
            ],
            luxuryServicesIncluded: [
              'Royal Welcome Ceremony',
              'Personal Suite Ambassador',
              'Unlimited Minibar',
              'Daily Breakfast in Suite',
              'Complimentary Spa (2 hours)'
            ],
            luxuryServicesExtra: [
              { name: 'Private Yacht Charter', price: '$2,000' },
              { name: 'Personal Chef (Full Day)', price: '$800' },
              { name: 'Helicopter Tour', price: '$1,500' }
            ]
          },
          presidential: {
            name: 'Presidential Suite',
            tagline: 'The Ultimate in World-Class Luxury',
            description: [
              'The Presidential Suite occupies the entire 8th floor, spanning an extraordinary 500 square meters of the most exclusive accommodation our hotel has to offer. This legendary residence has hosted heads of state, royalty, and the world\'s most discerning travelers.',
              'Four distinct bedroom suites, each with dedicated bathroom and dressing area, surround a magnificent great room with 20-foot ceilings and floor-to-ceiling windows offering 360-degree views. The suite includes a private boardroom, a professional kitchen, a private spa with treatment room, and a rooftop terrace with infinity pool.'
            ],
            amenities: [
              'Entire Floor (500 sqm)',
              'Four Luxury Bedroom Suites',
              'Private Boardroom (12 persons)',
              'Professional Catering Kitchen',
              'Private Spa & Treatment Room',
              'Rooftop Infinity Pool',
              '360-Degree Panoramic Views',
              'Grand Piano (Steinway Concert)',
              'Private Elevator Access',
              'Museum-Quality Art Collection',
              'Smart Home Automation',
              'Private Wine Vault (500 bottles)',
              'Diplomatic Security Features',
              '24/7 Dedicated Staff (6 persons)'
            ],
            luxuryServicesIncluded: [
              'Presidential Welcome Protocol',
              'Dedicated Butler Team (3 persons)',
              'Private Chef',
              'All Food & Beverage',
              'Unlimited Spa Access',
              'Rolls Royce with Chauffeur',
              'Personal Security Coordination'
            ],
            luxuryServicesExtra: [
              { name: 'Private Jet Arrangements', price: 'On request' }
            ]
          }
        }
      },
      services: {
        hero: {
          title: 'Premium Services',
          subtitle: 'Exceptional amenities and personalized service'
        },
        items: {
          dining: { name: 'Fine Dining', desc: 'World-class restaurants' },
          spa: { name: 'Spa & Wellness', desc: 'Luxury treatments' },
          gym: { name: 'Fitness Center', desc: '24/7 access' },
          pool: { name: 'Infinity Pool', desc: 'Rooftop paradise' },
          chauffeur: { name: 'Chauffeur Service', desc: 'Private transportation' },
          concierge: { name: 'Concierge', desc: '24/7 assistance' },
          store: { name: 'Hotel Store', desc: 'Premium products & gifts' }
        }
      },
      market: {
        hero: {
          title: 'Hotel Store',
          subtitle: 'Premium products and exclusive items for our guests'
        },
        categories: {
          all: 'All Items',
          snacks: 'Snacks & Beverages',
          biscuits: 'Biscuits',
          chips: 'Chips',
          drinks: 'Drinks',
          candy: 'Candy',
          toiletries: 'Toiletries',
          souvenirs: 'Souvenirs',
          luxury: 'Luxury Items'
        },
        loading: 'Loading products...',
        empty: 'No products available in this category.',
        product: {
          addToCart: 'Add to Cart',
          outOfStock: 'Out of Stock',
          inStock: 'In Stock'
        },
        cart: {
          title: 'Your Cart',
          empty: 'Your cart is empty',
          total: 'Total',
          checkout: 'Place Order',
          remove: 'Remove',
          clientName: 'Your Name',
          roomNumber: 'Room Number',
          notes: 'Special Notes',
          placeOrder: 'Place Order',
          orderSuccess: 'Order placed successfully!',
          orderNote: 'Your order will be delivered to your room shortly.'
        }
      },
      premiumServices: {
        hero: {
          title: 'Presidential Premium Services',
          subtitle: 'Exclusive amenities reserved for distinguished guests'
        },
        card: {
          requestService: 'Request Service'
        },
        items: {
          medical: { name: '24/7 Medical Assistance', desc: 'On-site nurses and medical professionals' },
          butler: { name: 'Personal Butler Service', desc: 'Dedicated butler for your every need' },
          security: { name: 'VIP Security Escort', desc: 'Professional security personnel' },
          maintenance: { name: 'Preventive Maintenance', desc: 'Daily hotel systems monitoring' },
          carFleet: { name: 'Luxury Car Fleet', desc: 'Mercedes, Rolls-Royce, Bentley available' },
          helicopter: { name: 'Helicopter Transfers', desc: 'Private helipad coordination' },
          wellness: { name: 'Wellness Programs', desc: 'Mental relaxation and yoga' },
          fitnessTrainers: { name: 'Private Fitness Trainers', desc: 'One-on-one training sessions' },
          eventPlanning: { name: 'Event Planning', desc: 'Luxury weddings and corporate events' },
          businessSupport: { name: 'Business Support', desc: 'Diplomatic and executive services' }
        }
      },
      roomDetails: {
        rooms: {
          deluxe: { name: 'Deluxe Room' },
          suite: { name: 'Royal Suite' },
          presidential: { name: 'Presidential Suite' }
        },
        size: 'Size: {{size}} sqm',
        pricePerNight: '${{price}}/night',
        actions: {
          reserve: 'Reserve Now'
        },
        confirmation: {
          title: 'Reservation Confirmed',
          message: 'Your luxury accommodation has been reserved.'
        }
      },
      serviceDetails: {
        items: {
          spa: { name: 'Royal Spa', desc: 'Ultimate relaxation and wellness', hours: '8 AM - 10 PM' },
          restaurant: { name: 'Fine Dining', desc: 'Michelin-star cuisine', hours: '6 AM - 11 PM' },
          gym: { name: 'Fitness Center', desc: 'State-of-the-art equipment', hours: '24/7' },
          pool: { name: 'Rooftop Pool', desc: 'Infinity pool with views', hours: '6 AM - 10 PM' }
        },
        hours: 'Hours: {{hours}}',
        actions: {
          bookNow: 'Book Now'
        },
        confirmation: {
          title: 'Booking Confirmed',
          message:
            'Your reservation has been successfully confirmed. Thank you for choosing Presidential Luxury Hotel.'
        }
      },
      auth: {
        accessEntry: {
          title: 'Who are you?',
          subtitle: 'Choose your access path to continue.',
          footer: 'No login is performed on this page.',
          roles: {
            firstTime: {
              title: 'First-Time Guest',
              subtitle: 'New visitors',
              highlight: '20% first stay discount',
              cta: 'Continue'
            },
            returning: {
              title: 'Returning Guest',
              subtitle: 'Loyal guests',
              highlight: 'Permanent 10% loyalty discount',
              cta: 'Continue'
            },
            staff: {
              title: 'Staff',
              subtitle: 'Operations access',
              highlight: 'Work sections & assignments',
              cta: 'Staff Login'
            },
            admin: {
              title: 'Admin',
              subtitle: 'System control',
              highlight: 'Full management access',
              cta: 'Admin Login'
            }
          }
        },
        guestNew: {
          title: 'First-Time Guest',
          subtitle: 'Create your account and unlock a 20% first stay discount',
          fields: {
            fullName: 'Full name',
            email: 'Email',
            password: 'Password',
            phone: 'Phone number (optional)',
            preferences: 'Special preferences (optional)'
          },
          cta: 'Continue',
          footer: 'Already registered?',
          footerLink: 'Sign in as returning guest',
          errors: {
            invalidEmail: 'Please enter a valid email',
            invalidPassword: 'Password must be at least 6 characters',
            invalidName: 'Please enter your full name',
            loginFailed: 'Registration failed. Please try again.'
          }
        },
        guestReturning: {
          title: 'Returning Guest',
          subtitle: 'Sign in and enjoy your permanent 10% loyalty discount',
          fields: {
            email: 'Email',
            password: 'Password',
            loyaltyId: 'Loyalty ID (optional)'
          },
          cta: 'Sign In',
          footer: 'New here?',
          footerLink: 'Create a first-time guest account',
          errors: {
            invalidCredentials: 'Invalid email or password',
            loginFailed: 'Login failed. Please try again.'
          }
        },
        staff: {
          title: 'Staff Access',
          subtitle: 'Operational sign-in for hotel personnel',
          fields: {
            staffId: 'Staff ID',
            pin: 'PIN'
          },
          cta: 'Sign In',
          errors: {
            invalidCredentials: 'Invalid Staff ID or PIN',
            loginFailed: 'Login failed. Please try again.'
          }
        },
        admin: {
          title: 'Admin',
          subtitle: 'Authorized control panel access',
          fields: {
            username: 'Username',
            password: 'Password'
          },
          cta: 'Enter',
          errors: {
            invalidCredentials: 'Invalid username or password',
            loginFailed: 'Login failed. Please try again.'
          }
        },
        backToSelection: 'Back to role selection'
      }
    },
    about: {
      hero: { title: 'About PLHMS', subtitle: 'Presidential Luxury Hotel Management System' },
      story: { title: 'Our Story', body: 'PLHMS represents the pinnacle of luxury hospitality management, combining cutting-edge technology with timeless elegance. Our 11-floor establishment offers an unparalleled experience for discerning guests from around the world.' },
      facilities: {
        title: 'Our Facilities',
        rooms: { title: '300+ Luxury Rooms', desc: 'From standard rooms to presidential suites' },
        dining: { title: 'Michelin Dining', desc: 'World-class restaurants and bars' },
        spa: { title: 'Spa & Wellness', desc: 'Complete wellness and relaxation facilities' },
        helipad: { title: 'Helipad Services', desc: 'Private helicopter transportation' }
      },
      commitment: { title: 'Our Commitment', body: 'We are committed to providing exceptional service and creating unforgettable experiences for every guest. Our team of dedicated professionals works around the clock to ensure your comfort and satisfaction.' }
    },
    contact: {
      hero: { title: 'Contact Us', subtitle: "We're here to help and answer any questions you might have" },
      info: { title: 'Get in Touch', phone: 'Phone', email: 'Email', address: 'Address', hours: 'Hours', phoneValue: '+1 (555) 123-4567', addressValue: 'Presidential Avenue, Luxury District', hoursValue: "24/7 - We're always here for you" },
      form: { title: 'Send us a Message', name: 'Name', email: 'Email', phone: 'Phone', subject: 'Subject', message: 'Message', submit: 'Send Message' },
      success: "Thank you! We'll get back to you soon."
    },
    faqs: {
      hero: { title: 'Frequently Asked Questions', subtitle: 'Find answers to common questions about our hotel' },
      q1: { question: 'What are the check-in and check-out times?', answer: 'Check-in is at 3:00 PM and check-out is at 12:00 PM. Early check-in and late check-out are available upon request and subject to availability.' },
      q2: { question: 'Do you offer airport transportation?', answer: 'Yes, we offer complimentary airport shuttle service for our guests. We also have helicopter services available for VIP guests.' },
      q3: { question: 'Is parking available?', answer: 'Yes, we have both valet parking and self-parking options available. Parking is complimentary for hotel guests.' },
      q4: { question: 'What dining options are available?', answer: 'We have multiple dining options including a Michelin-starred restaurant, casual dining, 24/7 room service, and a rooftop bar.' },
      q5: { question: 'Do you have spa and wellness facilities?', answer: 'Yes, our luxury spa and wellness center is located on Floor 9, offering a complete range of treatments and facilities.' },
      q6: { question: 'Can I cancel or modify my reservation?', answer: 'Cancellations and modifications are accepted up to 48 hours before check-in. Please contact our reservations team for assistance.' },
      q7: { question: 'Are pets allowed?', answer: 'Yes, we are pet-friendly. Please inform us in advance if you are bringing a pet. Additional fees may apply.' },
      q8: { question: 'What are the discount policies for guests?', answer: 'First-time guests receive 20% off, and returning guests receive 10% off on all bookings. Additional discounts may be available for extended stays.' },
      contact: { title: 'Still Have Questions?', subtitle: 'Our team is here to help you 24/7' }
    },
    servicesIndex: {
      hero: { title: '✨ Hotel Services', subtitle: 'Experience luxury with our premium services' },
      explore: 'Explore →',
      services: {
        restaurant: { name: 'Restaurant & Kitchen', description: 'Fine dining experience with Michelin-starred cuisine', features: ['Gourmet Cuisine', 'Private Dining', 'Wine Cellar', 'Room Service 24/7'], price: 'À la carte' },
        market: { name: 'Hotel Market', description: 'Premium snacks, beverages, and essentials delivered to your room', features: ['Fresh Products', 'Room Delivery', 'International Selection', 'Open 24/7'], price: 'Various' },
        spa: { name: 'Spa & Wellness', description: 'Indulge in ultimate relaxation with our luxury spa treatments', features: ['Swedish Massage', 'Deep Tissue', 'Hot Stone Therapy', 'Aromatherapy'], price: 'From $150' },
        gym: { name: 'Fitness Center', description: 'State-of-the-art equipment and personal training services', features: ['Modern Equipment', 'Personal Trainers', '24/7 Access', 'Fitness Classes'], price: 'From $50/day' },
        pool: { name: 'Pool & Aquatics', description: 'Crystal clear infinity pools with stunning panoramic views', features: ['Infinity Pool', 'Private Pool Suites', 'Swimming Lessons', 'Poolside Service'], price: 'From $40/hour' },
        driver: { name: 'Private Chauffeur', description: 'Professional chauffeur service with luxury vehicles', features: ['Airport Transfers', 'City Tours', 'Luxury Vehicles', 'Multilingual Drivers'], price: 'From $100' },
        butler: { name: 'Personal Butler', description: 'Dedicated personal assistance for your every need', features: ['24/7 Availability', 'Personal Shopping', 'Event Planning', 'VIP Concierge'], price: 'From $200' }
      }
    },
    spa: {
      hero: { title: '💆 Spa & Massage', subtitle: 'Indulge in ultimate relaxation and rejuvenation' },
      steps: { 1: 'Select Service', 2: 'Your Preferences', 3: 'Your Details' },
      step1: { title: 'Select Your Treatment', sessionType: 'Session Type', duration: 'Duration', location: 'Location', date: 'Preferred Date', time: 'Preferred Time', selectTime: 'Select time', estimatedTotal: 'Estimated Total:' },
      step2: { title: 'Your Preferences', desc: 'Help us personalize your experience', experienceQuestion: 'Do you have previous massage experience?', experience: 'Spa Experience', experienceYes: 'Yes', experienceNo: 'No, First Time', goal: 'Session Goal', goalPlaceholder: 'e.g. Relax & de-stress', goalOptions: ['Relaxation', 'Pain Relief', 'Rehabilitation', 'Better Sleep', 'Stress Relief'], focusAreas: 'Focus Areas (select all that apply)', medicalIssues: 'Medical Considerations', pressure: 'Pressure Preference', pressureLight: 'Light', pressureSoft: 'Soft', pressureMedium: 'Medium', pressureFirm: 'Firm', pressureDeep: 'Deep', therapist: 'Therapist Preference', therapistMale: 'Male', therapistFemale: 'Female', therapistNoPreference: 'No Preference', style: 'Session Atmosphere', styleSilent: 'Silent', styleMusic: 'Soft Music', styleNature: 'Nature Sounds' },
      step3: { title: 'Your Details', name: 'Full Name', email: 'Email', phone: 'Phone', notes: 'Additional Notes', yourRoom: 'Your Room', autoLinked: 'Auto-linked', bookingSummary: 'Booking Summary', service: 'Service:', duration: 'Duration:', location: 'Location:', dateTime: 'Date & Time:', total: 'Total:', at: 'at' },
      sessionTypes: {
        relaxation: { label: 'Relaxation Massage', desc: 'Gentle strokes to ease tension' },
        deep_tissue: { label: 'Deep Tissue', desc: 'Intense pressure for muscle relief' },
        hot_stone: { label: 'Hot Stone Therapy', desc: 'Heated stones for deep relaxation' },
        aromatherapy: { label: 'Aromatherapy', desc: 'Essential oils for mind & body' },
        couples: { label: 'Couples Massage', desc: 'Romantic experience for two' }
      },
      durations: { '30min': '30 Minutes', '60min': '60 Minutes', '90min': '90 Minutes', '120min': '120 Minutes' },
      locations: { spa_room: 'Spa Treatment Room', private_suite: 'Private Luxury Suite', in_room: 'In-Room Service' },
      focusAreas: ['Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Legs', 'Feet', 'Arms', 'Full Body'],
      medicalIssues: ['None', 'Previous Injury', 'Chronic Pain', 'Skin Sensitivity', 'Pregnancy', 'Heart Condition', 'Other'],
      success: { title: 'Booking Confirmed!', service: 'Service', serviceValue: 'Spa & Massage', type: 'Type', date: 'Date', time: 'Time', duration: 'Duration', total: 'Total', confirmation: 'A confirmation email has been sent to', backToServices: 'Back to Services' },
      from: 'From $',
      next: 'Next →',
      back: '← Back',
      confirm: 'Confirm Booking',
      processing: 'Processing…',
      price: 'Estimated Price',
      continue: 'Continue →'
    },
    gym: {
      hero: { title: '💪 Fitness Center', subtitle: 'State-of-the-art equipment and personal training' },
      steps: { 1: 'Select Package', 2: 'Your Profile', 3: 'Your Details' },
      step1: { title: 'Choose Your Package', duration: 'Duration', trainer: 'Personal Trainer', trainerYes: 'Yes (+$80/day)', trainerNo: 'No', date: 'Start Date', hours: 'Daily Hours', hoursPlaceholder: 'e.g. 2', estimatedTotal: 'Estimated Total:' },
      step2: { title: 'Your Fitness Profile', desc: 'Tell us about your fitness background', goal: 'Training Goal', goalOptions: ['Fat Loss', 'Weight Gain', 'Muscle Building', 'General Fitness', 'Strength', 'Endurance'], goalPlaceholder: 'e.g. Weight loss', age: 'Age', height: 'Height (cm)', weight: 'Weight (kg)', weeklyHours: 'Weekly Training Hours', weeklyOptions: ['0–2 hours', '2–5 hours', '5–10 hours', '10+ hours'], experience: 'Experience Level', experienceBeginner: 'Beginner', experienceIntermediate: 'Intermediate', experienceAdvanced: 'Advanced', experienceProfessional: 'Professional', injuries: 'Previous Injuries (select all that apply)', preferredTime: 'Preferred Training Time', timeMorning: 'Morning (6–10 AM)', timeMidday: 'Midday (10 AM–2 PM)', timeAfternoon: 'Afternoon (2–6 PM)', timeEvening: 'Evening (6–10 PM)' },
      step3: { title: 'Contact Details', name: 'Full Name', email: 'Email', phone: 'Phone', room: 'Room Number', notes: 'Special Requests', bookingSummary: 'Booking Summary', package: 'Package:', trainer: 'Trainer:', total: 'Total:', dateLabel: 'Start Date:' },
      dayOptions: { '1': '1 Day', '3': '3 Days', '7': '1 Week', '14': '2 Weeks', '30': '1 Month' },
      injuries: ['None', 'Back', 'Knee', 'Shoulder', 'Ankle', 'Wrist', 'Neck', 'Hip'],
      success: { title: 'Booking Confirmed!', backToServices: 'Back to Services' },
      next: 'Next →',
      back: '← Back',
      confirm: 'Confirm Booking',
      processing: 'Processing…',
      price: 'Estimated Price',
      continue: 'Continue →'
    },
    pool: {
      hero: { title: '🏊 Pool & Aquatics', subtitle: 'Dive into crystal clear luxury' },
      steps: { 1: 'Select Package', 2: 'Your Preferences', 3: 'Your Details' },
      step1: { title: 'Choose Your Pool Experience', poolType: 'Pool Type', duration: 'Duration', coach: 'Swimming Coach', coachYes: 'Yes (+$60)', coachNo: 'No', date: 'Date', time: 'Time', people: 'Number of People', estimatedTotal: 'Estimated Total:' },
      step2: { title: 'Your Preferences', desc: 'Help us tailor your pool experience', ability: 'Swimming Ability', abilityBeginner: 'Beginner', abilityIntermediate: 'Intermediate', abilityAdvanced: 'Advanced', goal: 'Session Goal', goalPlaceholder: 'e.g. Relaxation, fitness', goalOptions: ['Learning to Swim', 'Relaxation', 'Exercise', 'Therapy', 'Family Fun', 'Lap Swimming'], temperature: 'Water Temperature', tempCool: 'Cool', tempModerate: 'Moderate', tempWarm: 'Warm', preferredTime: 'Preferred Time' },
      step3: { title: 'Contact Details', name: 'Full Name', email: 'Email', phone: 'Phone', room: 'Room Number', notes: 'Special Requests', bookingSummary: 'Booking Summary', poolType: 'Pool Type:', duration: 'Duration:', coach: 'Coach:', date: 'Date & Time:', total: 'Total:' },
      poolTypes: { shared: { label: 'Shared Pool', desc: 'Access to main pool area' }, private: { label: 'Private Pool', desc: 'Exclusive private pool suite' } },
      durations: { '1hour': '1 Hour', '2hours': '2 Hours', half_day: 'Half Day', full_day: 'Full Day' },
      success: { title: 'Booking Confirmed!', backToServices: 'Back to Services' },
      next: 'Next →',
      back: '← Back',
      confirm: 'Confirm Booking',
      processing: 'Processing…',
      price: 'Estimated Price',
      continue: 'Continue →'
    },
    butler: {
      hero: { title: '🎩 Personal Butler', subtitle: 'Dedicated personal assistance for your every need' },
      steps: { 1: 'Select Service', 2: 'Your Preferences', 3: 'Your Details' },
      step1: { title: 'Choose Your Butler Service', serviceType: 'Service Type', duration: 'Duration', language: 'Preferred Language', date: 'Date', time: 'Time', estimatedTotal: 'Estimated Total:' },
      step2: { title: 'Service Preferences', desc: 'Customize your butler experience', interaction: 'Interaction Level', interactionMinimal: 'Minimal', interactionModerate: 'Moderate', interactionVerbose: 'Highly Interactive', style: 'Service Style', styleFormal: 'Formal & Traditional', styleCasual: 'Warm & Personable', styleDiscrete: 'Discrete & Efficient', leaving: 'Leaving the Hotel', leavingYes: 'Yes, accompanying needed', leavingNo: 'No, in-hotel only', leavingMaybe: 'Maybe / Flexible', tasks: 'Required Tasks (select all that apply)' },
      step3: { title: 'Contact Details', name: 'Full Name', email: 'Email', phone: 'Phone', room: 'Room Number', notes: 'Special Requests', bookingSummary: 'Booking Summary', service: 'Service:', duration: 'Duration:', date: 'Date & Time:', total: 'Total:' },
      serviceTypes: { basic: { label: 'Basic Assistance', desc: 'General assistance & errands' }, premium: { label: 'Premium Butler', desc: 'Dedicated personal service' }, exclusive: { label: 'Exclusive Concierge', desc: 'VIP full-service experience' } },
      durations: { '2hours': '2 Hours', '4hours': '4 Hours', half_day: 'Half Day', full_day: 'Full Day' },
      taskOptions: ['Unpacking/Packing Assistance', 'Wardrobe Organization', 'Restaurant Reservations', 'Event Tickets', 'Shopping Assistance', 'Personal Errands', 'Travel Arrangements', 'Meeting Coordination', 'Special Occasion Setup', 'Personal Shopping'],
      languageLabels: { english: 'English', arabic: 'Arabic', french: 'French', spanish: 'Spanish', german: 'German', italian: 'Italian', russian: 'Russian', chinese: 'Chinese' },
      success: { title: 'Booking Confirmed!', backToServices: 'Back to Services' },
      next: 'Next →',
      back: '← Back',
      confirm: 'Confirm Booking',
      processing: 'Processing…',
      price: 'Estimated Price',
      continue: 'Continue →'
    },
    driver: {
      hero: { title: '🚗 Private Chauffeur', subtitle: 'Professional chauffeur service with luxury vehicles' },
      steps: { 1: 'Select Trip', 2: 'Trip Details', 3: 'Your Details' },
      step1: { title: 'Choose Your Journey', tripType: 'Trip Type', carType: 'Vehicle', date: 'Date', time: 'Time', duration: 'Hours (for hourly)', serviceType: 'Service Level', language: 'Driver Language', estimatedTotal: 'Estimated Total:' },
      step2: { title: 'Trip Details', desc: 'Tell us more about your journey', serviceLevel: 'Service Level', serviceLevelOneWay: 'One-way Transfer', serviceLevelRound: 'Round Trip', serviceLevelDisposal: 'Full-time at Disposal', style: 'Driver Style', styleFormal: 'Formal & Professional', styleFriendly: 'Friendly & Conversational', styleSilent: 'Silent & Discrete', purpose: 'Trip Purpose', purposeOptions: ['Airport Transfer', 'Business Meetings', 'Tourism & Sightseeing', 'Shopping', 'Special Event', 'Other'], waiting: 'Waiting Time', waitingNone: 'No waiting needed', waiting30min: 'Up to 30 minutes', waiting1hour: 'Up to 1 hour', waitingFlexible: 'Flexible / On call', pickup: 'Pickup Location', dropoff: 'Drop-off Location', pickupPlaceholder: 'e.g., Hotel Lobby', dropoffPlaceholder: 'e.g., Airport Terminal', hourlyLabel: 'Number of Hours', hourlyPlaceholder: 'Select hours', language: 'Driver Language' },
      step3: { title: 'Contact Details', name: 'Full Name', email: 'Email', phone: 'Phone', room: 'Room Number', notes: 'Special Requests', bookingSummary: 'Booking Summary', vehicle: 'Vehicle:', trip: 'Trip Type:', date: 'Date & Time:', total: 'Total:', from: 'From:', to: 'To:' },
      tripTypes: { airport_transfer: { label: 'Airport Transfer', desc: 'To/from airport' }, city_tour: { label: 'City Tour', desc: 'Guided city exploration' }, full_day: { label: 'Full Day Hire', desc: '8+ hours service' }, hourly: { label: 'Hourly Service', desc: 'Per hour booking' } },
      carTypes: { sedan: { label: 'Executive Sedan', desc: 'Mercedes E-Class or similar' }, suv: { label: 'Luxury SUV', desc: 'Range Rover or similar' }, luxury: { label: 'Premium Luxury', desc: 'Mercedes S-Class or similar' }, limousine: { label: 'Limousine', desc: 'Stretch limousine' } },
      languageLabels: { english: 'English', arabic: 'Arabic', french: 'French', spanish: 'Spanish', german: 'German', italian: 'Italian', russian: 'Russian', chinese: 'Chinese' },
      success: { title: 'Booking Confirmed!', backToServices: 'Back to Services' },
      next: 'Next →',
      back: '← Back',
      confirm: 'Confirm Booking',
      processing: 'Processing…',
      price: 'Estimated Price',
      continue: 'Continue →'
    },
    admin: {
      tabs: { dashboard: 'Dashboard', bookings: 'Bookings', clients: 'Clients', rooms: 'Rooms', store: 'Store', orders: 'Orders', services: 'Services', activity: 'Activity', settings: 'Settings' },
      floors: { b2: 'Basement 2', b1: 'Basement 1', g: 'Ground Floor', f1: '1st Floor', f2: '2nd Floor', f3: '3rd Floor', f4: '4th Floor', f5: '5th Floor', f6: '6th Floor', f7: '7th Floor', f8: '8th Floor', f9: '9th Floor', f10: '10th Floor', f11: '11th Floor' },
      messages: { roomAdded: 'Room added successfully', roomUpdated: 'Room updated successfully', roomDeleted: 'Room deleted successfully', storeItemAdded: 'Product added successfully', storeItemUpdated: 'Product updated successfully', storeItemDeleted: 'Product deleted successfully', bookingCancelled: 'Booking cancelled successfully', settingsSaved: 'Settings saved successfully', passwordChanged: 'Password changed successfully' },
      confirm: { deleteRoom: 'Are you sure you want to delete this room?', deleteItem: 'Are you sure you want to delete this item?', cancelBooking: 'Are you sure you want to cancel this booking?' },
      labels: { addRoom: 'Add Room', editRoom: 'Edit Room', addProduct: 'Add Product', editProduct: 'Edit Product', roomNumber: 'Room Number', floor: 'Floor', type: 'Type', price: 'Price / Night', capacity: 'Capacity', status: 'Status', description: 'Description', images: 'Image URLs', features: 'Features', amenities: 'Amenities', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', search: 'Search', filterBy: 'Filter by', allBookings: 'All', active: 'Active', completed: 'Completed', cancelled: 'Cancelled' }
    },
    luxuryAuth: {
      brand: 'Presidential Royal Palace Hotel',
      leftHeadline: 'Where Excellence\nMeets Comfort',
      leftSub: 'Experience unparalleled luxury. Every detail crafted for your perfection — from the moment you arrive to the moment you leave.',
      badge1: '★ Forbes 5-Star', badge2: '60 Luxury Rooms', badge3: 'Presidential Suites',
      quote: '"The finest experiences in life are reserved for those who seek them."',
      back: 'Back',
      optional: '(optional)', orContinueWith: 'or continue with',
      tabs: { signIn: 'Sign In', createAccount: 'Create Account' },
      login: { title: 'Welcome Back', subtitle: 'Sign in to your luxury account', email: 'Email Address', emailPlaceholder: 'your@email.com', password: 'Password', passwordPlaceholder: 'Enter your password', rememberMe: 'Remember me', forgotPassword: 'Forgot password?', submit: '✦ Sign In', submitting: 'Signing in…', noAccount: "Don't have an account?", createOne: 'Create one', successMsg: 'Welcome back, {{name}}! Redirecting…' },
      register: { title: 'Create Your\nLuxury Experience', subtitle: 'Join our presidential membership today', firstName: 'First Name', lastName: 'Last Name', email: 'Email Address', emailPlaceholder: 'your@email.com', phone: 'Phone', password: 'Password', passwordPlaceholder: 'Min. 8 characters', confirmPassword: 'Confirm Password', confirmPlaceholder: 'Repeat your password', passwordsMatch: '✓ Passwords match', termsAgree: 'I agree to the', termsOf: 'Terms of Service', and: 'and', privacyPolicy: 'Privacy Policy', submit: '✦ Create Account', submitting: 'Creating account…', haveAccount: 'Already have an account?', signIn: 'Sign in', successMsg: 'Account created! Preparing your luxury experience…' },
      strength: { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' },
      errors: { validEmail: 'Please enter a valid email address.', passwordMin6: 'Password must be at least 6 characters.', passwordMin8: 'Password must be at least 8 characters.', fullName: 'Please enter your full name.', passwordsMatch: 'Passwords do not match.', termsRequired: 'Please accept the Terms of Service to continue.', connectionError: 'Connection error. Please check your network and try again.', invalidCredentials: 'Invalid email or password. Please try again.', registrationFailed: 'Registration failed. Please try again.', fieldTooShort: 'Too short', fieldInvalidEmail: 'Please enter a valid email', fieldPassword6: 'At least 6 characters required', fieldPassword8: 'At least 8 characters required', fieldPasswordsMatch: 'Passwords do not match' }
    },
    forgotPassword: {
      leftHeadline: 'Secure &\nTrusted', leftSub: "Your account security is our highest priority. We'll help you regain access safely and swiftly.", quote: '"Your privacy is our sacred commitment."',
      title: 'Reset Password', subtitle: 'Enter your email to receive a secure reset link', emailLabel: 'Email Address', emailPlaceholder: 'your@email.com', sendButton: '✦ Send Reset Link', sending: 'Sending…', rememberedPassword: 'Remembered your password?', signIn: 'Sign in', successTitle: 'Check Your Inbox', successSubtitle: "We've sent a password reset link to", didntReceive: "Didn't receive it? Check your spam folder or", tryAgain: 'try again', backToSignIn: '← Back to Sign In', invalidEmail: 'Please enter a valid email address.'
    },
    floorPages: {
      f0: {
        heroBadge: 'Floor 0', heroTitle: 'Grand Lobby & Reception', heroDesc: 'Your gateway to presidential luxury - an architectural masterpiece featuring marble columns, crystal chandeliers, and an indoor garden oasis',
        overviewTitle: 'The Heart of Elegance',
        stats: ['SQM Space', 'Concierge', 'Retail Outlets', 'Indoor Garden'],
        areasTitle: 'Lobby Areas',
        areas: [{ name: 'Grand Entrance', desc: 'Ceremonial arrival with marble columns' }, { name: 'Reception Desk', desc: '24/7 Concierge & Check-in Services' }, { name: 'Luxury Lounge', desc: 'Premium seating with city views' }, { name: 'Indoor Garden', desc: 'Botanical paradise with waterfall' }, { name: 'Boutique Shops', desc: 'Luxury retail outlets' }, { name: 'Café & Bar', desc: 'Artisan coffee and premium beverages' }],
        featuresTitle: 'Distinguished Features',
        features: ['Triple-Height Ceiling with Crystal Chandelier', 'Italian Marble Flooring throughout', 'Private VIP Check-in Area', 'Currency Exchange & Travel Desk', 'Luxury Car Rental Services', 'Bell Desk & Porter Services', 'Business Center Access', 'Indoor Waterfall Feature'],
        closingTitle: 'First Impressions Matter', closingText: "Our Grand Lobby sets the tone for your presidential experience. From the moment you step through our doors, you're enveloped in an atmosphere of refined elegance. The three-story atrium, adorned with a magnificent crystal chandelier and complemented by the soothing sounds of our indoor waterfall, creates an unforgettable welcome to luxury living."
      },
      f1: {
        heroBadge: 'Floor 1', heroTitle: 'Culinary Excellence', heroDesc: 'World-class dining destinations featuring international cuisine, artisan cafés, and exclusive VIP lounges',
        overviewTitle: 'Dining Experience',
        stats: ['Restaurants', 'Master Chefs', 'Total Capacity', 'Star Rating'],
        areasTitle: 'Dining Venues',
        areas: [{ name: 'Main Restaurant', cuisine: 'International Cuisine', capacity: '200 seats', hours: '6:00 AM - 11:00 PM' }, { name: 'Café Royale', cuisine: 'Café & Pastries', capacity: '80 seats', hours: '24/7' }, { name: 'VIP Lounge', cuisine: 'Premium Dining', capacity: '50 seats', hours: '12:00 PM - 2:00 AM' }, { name: 'Breakfast Hall', cuisine: 'Buffet & À la carte', capacity: '150 seats', hours: '6:00 AM - 12:00 PM' }],
        featuresTitle: 'Exclusive Features',
        features: ['Michelin-Star Chef Curated Menus', 'Private Dining Rooms Available', 'Indoor & Outdoor Seating Options', 'Wine Cellar with 500+ Premium Labels', 'Live Music & Entertainment', 'Special Dietary Accommodations']
      },
      f2: {
        heroBadge: 'Floor 2', heroTitle: 'Events & Conferences', heroDesc: 'Sophisticated event spaces perfect for weddings, conferences, and corporate gatherings with state-of-the-art facilities',
        overviewTitle: 'World-Class Event Facilities',
        stats: ['SQM Space', 'Max Capacity', 'Event Spaces', 'Tech Equipped'],
        areasTitle: 'Event Spaces',
        areas: [{ name: 'Grand Wedding Hall', capacity: '500 guests', size: '800 sqm' }, { name: 'Conference Center', capacity: '300 guests', size: '500 sqm' }, { name: 'Meeting Rooms', capacity: '20-50 per room', size: '8 rooms' }, { name: 'VIP Meeting Suite', capacity: '30 guests', size: '200 sqm' }],
        featuresTitle: 'Premium Amenities',
        features: ['Crystal Chandeliers & Luxury Décor', 'Advanced Audio-Visual Systems', 'High-Speed Wi-Fi Throughout', 'Professional Event Planning Services', 'Customizable Lighting & Stage Setup', 'In-House Catering & Bar Services']
      },
      f3: {
        heroBadge: 'Floor 3', heroTitle: 'Wellness & Recreation', heroDesc: 'Rejuvenate mind, body, and spirit with our comprehensive wellness facilities including gym, spa, pool, and relaxation areas',
        overviewTitle: 'Your Wellness Sanctuary',
        stats: ['SQM Gym', 'SQM Spa', 'Pool Length', 'Access'],
        areasTitle: 'Premium Facilities',
        areas: [{ name: 'State-of-the-Art Gym', size: '400 sqm', hours: '24/7' }, { name: 'Indoor Pool', size: '25m Olympic', hours: '6 AM - 10 PM' }, { name: 'Luxury Spa', size: '600 sqm', hours: '8 AM - 10 PM' }, { name: 'Sauna & Steam', size: '150 sqm', hours: '6 AM - 10 PM' }],
        featuresTitle: 'Wellness Services',
        features: ['Personal Training Sessions', 'Yoga & Meditation Classes', 'Therapeutic Massage Treatments', 'Facial & Body Treatments', 'Hydrotherapy Pool', 'Relaxation Lounges', 'Professional Nutritionist', 'Sports Medicine Consultation']
      },
      f4: {
        heroBadge: 'Floor 4', heroTitle: 'Standard Accommodations', heroDesc: 'Elegantly appointed standard rooms featuring modern amenities and luxury comfort for discerning guests',
        overviewTitle: 'Comfortable Luxury',
        stats: ['Total Rooms', 'SQM Range', 'Star Rating', 'Room Service'],
        areasTitle: 'Room Categories',
        areas: [{ type: 'Single Room', number: '401-420', size: '35 sqm', status: 'Available', features: ['King Bed', 'City View', 'Workstation'] }, { type: 'Double Room', number: '421-445', size: '45 sqm', status: 'Available', features: ['Two Beds', 'Balcony', 'Mini Bar'] }, { type: 'Twin Room', number: '446-465', size: '42 sqm', status: 'Reserved', features: ['Twin Beds', 'Garden View', 'Sitting Area'] }, { type: 'Superior Room', number: '466-480', size: '50 sqm', status: 'Available', features: ['Premium Amenities', 'Large Bathroom', 'Ocean View'] }],
        featuresTitle: 'Room Features',
        features: ['Premium Bedding & Linens', 'Smart TV with International Channels', 'High-Speed Wi-Fi', 'Marble Bathrooms with Rain Shower', 'Climate Control System', 'In-Room Safe & Mini Bar']
      },
      f5: {
        heroBadge: 'Floor 5', heroTitle: 'Deluxe Rooms', heroDesc: 'Enhanced comfort with spacious layouts, premium amenities, and stunning views of the city or gardens',
        overviewTitle: 'Elevated Luxury',
        stats: ['Deluxe Rooms', 'SQM Range', 'Premium Views', 'Guest Lounge'],
        areasTitle: 'Deluxe Categories',
        areas: [{ type: 'Deluxe Room', number: '501-525', size: '60 sqm', status: 'Available', features: ['Premium View', 'Sitting Area', 'Large Balcony'] }, { type: 'Deluxe City View', number: '526-545', size: '65 sqm', status: 'Available', features: ['Panoramic View', 'Work Desk', 'Sofa'] }, { type: 'Deluxe Garden View', number: '546-560', size: '62 sqm', status: 'Reserved', features: ['Garden Access', 'Private Terrace', 'Extra Amenities'] }],
        featuresTitle: 'Deluxe Amenities',
        features: ['Private Guest Lounge Access', 'Complimentary Breakfast & Evening Cocktails', 'Espresso Machine & Premium Coffee', 'Luxury Bathroom with Soaking Tub', 'Priority Check-in & Late Checkout', 'Daily Housekeeping & Turndown Service']
      },
      f6: {
        heroBadge: 'Floor 6', heroTitle: 'Premium Rooms', heroDesc: 'Spacious premium accommodations perfect for families and extended stays with enhanced amenities and concierge services',
        overviewTitle: 'Premium Experience',
        stats: ['Premium Rooms', 'SQM Range', 'Family Friendly', 'Concierge'],
        areasTitle: 'Premium Categories',
        areas: [{ type: 'Premium Room', number: '601-620', size: '75 sqm', status: 'Available', features: ['Panoramic View', 'Living Area', 'Large Balcony'] }, { type: 'Premium Family', number: '621-638', size: '90 sqm', status: 'Available', features: ['Two Bedrooms', 'Kitchenette', 'Family Lounge'] }, { type: 'Premium Plus', number: '639-650', size: '85 sqm', status: 'Reserved', features: ['Corner Suite', 'Wine Fridge', 'Home Theater'] }],
        featuresTitle: 'Premium Benefits',
        features: ['Dedicated Family Concierge Service', 'Complimentary Airport Transfers', 'Kitchenette with Dining Area', 'Large Private Balconies', 'Premium Entertainment Systems', 'Access to Executive Lounge']
      },
      f7: {
        heroBadge: 'Floor 7', heroTitle: 'Luxury Suites', heroDesc: 'Opulent suites with separate living areas, premium furnishings, and personalized butler service for the ultimate luxury experience',
        overviewTitle: 'Suite Excellence',
        stats: ['Luxury Suites', 'SQM Range', 'Butler Service', 'VIP Treatment'],
        areasTitle: 'Suite Categories',
        areas: [{ type: 'Executive Suite', number: '701-715', size: '120 sqm', status: 'Available', features: ['Office Space', 'Meeting Room', 'Butler Service'] }, { type: 'Luxury Suite', number: '716-728', size: '150 sqm', status: 'Reserved', features: ['Master Bedroom', 'Living Room', 'Dining Area'] }, { type: 'Royal Suite', number: '729-735', size: '200 sqm', status: 'Available', features: ['Two Bedrooms', 'Private Kitchen', 'Jacuzzi'] }],
        featuresTitle: 'Exclusive Suite Amenities',
        features: ['Personal Butler Service 24/7', 'Private Chef on Request', 'Executive Office & Meeting Facilities', 'Master Suite with Walk-in Closet', 'Luxury Bathroom with Spa Tub', 'Complimentary Chauffeur Service']
      },
      f8: {
        heroBadge: 'Floor 8', heroTitle: 'Presidential Floor', heroDesc: 'The epitome of luxury - an entire floor dedicated to presidential accommodations with private pool, cinema, dining hall, and office facilities',
        overviewTitle: 'Presidential Excellence',
        stats: ['SQM Suite', 'Private Pool', 'Private Theater', 'Dedicated Staff'],
        areasTitle: 'Presidential Facilities',
        areas: [{ name: 'Presidential Suite', size: '500 sqm', desc: 'Ultimate luxury accommodation' }, { name: 'Private Dining Hall', size: '100 sqm', desc: 'Seats 20 guests' }, { name: 'Private Cinema', size: '80 sqm', desc: 'State-of-the-art theater' }, { name: 'Indoor Private Pool', size: '150 sqm', desc: 'Climate-controlled' }, { name: 'Executive Office', size: '60 sqm', desc: 'Full business facilities' }, { name: 'Meeting Room', size: '75 sqm', desc: 'Boardroom for 12' }],
        featuresTitle: 'Presidential Privileges',
        features: ['Entire Floor Exclusive Access', 'Dedicated Service Team & Butler', 'Private Helicopter Transfer', 'Personal Chef & Sommelier', 'Security Detail Available', 'Bespoke Concierge Services'],
        closingTitle: 'Experience Presidential Living', closingText: 'Floor 8 represents the pinnacle of luxury hospitality. This exclusive level offers unparalleled privacy and sophistication with amenities typically found only in presidential palaces. From your private indoor pool to the personal cinema, every detail is crafted to exceed the expectations of world leaders and distinguished guests.'
      },
      f9: {
        heroBadge: 'Floor 9', heroTitle: 'Staff Residences', heroDesc: 'Dedicated floor for our valued team members featuring comfortable accommodations, dining facilities, and recreational areas',
        overviewTitle: 'Team Excellence',
        stats: ['Staff Rooms', 'Capacity', 'Facilities', 'Well-being Care'],
        areasTitle: 'Staff Facilities',
        areas: [{ name: 'Staff Accommodation', capacity: '80 rooms', desc: 'Comfortable living quarters' }, { name: 'Staff Dining Hall', capacity: '150 seats', desc: 'Three meal service daily' }, { name: 'Recreation Room', capacity: '50 people', desc: 'Entertainment & relaxation' }, { name: 'Training Center', capacity: '40 people', desc: 'Professional development' }, { name: 'Staff Gym', capacity: '30 people', desc: 'Fitness facilities' }, { name: 'Wellness Room', capacity: '20 people', desc: 'Meditation & yoga' }],
        featuresTitle: 'Staff Amenities',
        features: ['Modern Furnished Accommodations', '24/7 Cafeteria & Dining Services', 'Recreation & Entertainment Facilities', 'Training & Development Center', 'Laundry & Housekeeping Services', 'Wellness & Fitness Programs']
      },
      f10: {
        heroBadge: 'Floor 10', heroTitle: 'Helipad Level', heroDesc: 'Executive helicopter landing facility with VIP reception, aviation office, and comprehensive security systems for distinguished arrivals',
        overviewTitle: 'Sky-High Arrival',
        stats: ['Helipads', '24/7 Operations', 'Full Security', 'VIP Service'],
        areasTitle: 'Aviation Facilities',
        areas: [{ name: 'Main Helipad', capacity: '2 helicopters', desc: 'Simultaneous operations' }, { name: 'Landing Control', desc: 'Advanced navigation systems', size: '50 sqm' }, { name: 'VIP Reception', desc: 'Exclusive arrival lounge', size: '120 sqm' }, { name: 'Aviation Office', desc: 'Flight coordination center', size: '80 sqm' }, { name: 'Security Center', desc: 'Advanced monitoring systems', size: '100 sqm' }, { name: 'Refueling Station', desc: 'Full service capability', capacity: 'Aviation fuel' }],
        featuresTitle: 'Exclusive Features',
        features: ['Dual Helipad for Simultaneous Operations', 'Advanced Weather Monitoring Systems', 'VIP Fast-Track Immigration Services', 'Luxury Waiting Lounge with Refreshments', 'Direct Private Elevator to All Floors', '24/7 Security & Air Traffic Coordination'],
        closingTitle: 'Arrive in Unparalleled Style', closingText: 'Our helipad facility offers the ultimate in exclusive arrivals. Skip the traffic and arrive directly at your presidential suite. With capacity for two helicopters and full refueling services, we ensure your journey is as luxurious as your stay.'
      },
      f11: {
        heroBadge: 'Floor 11 - Rooftop', heroTitle: 'Sky Garden & Infinity Pool', heroDesc: 'Crown jewel of the hotel featuring rooftop infinity pool, luxury garden, sky lounge, and panoramic restaurant with 360-degree city views',
        overviewTitle: 'Rooftop Paradise',
        stats: ['SQM Pool', 'SQM Garden', 'Panoramic Views', 'Perfection'],
        areasTitle: 'Rooftop Attractions',
        areas: [{ name: 'Infinity Pool', size: '30m x 15m', desc: 'Heated, panoramic views' }, { name: 'Sky Garden', size: '800 sqm', desc: 'Tropical botanical paradise' }, { name: 'Sky Lounge Bar', capacity: '80 guests', desc: 'Premium cocktails & views' }, { name: 'Panorama Restaurant', capacity: '120 guests', desc: 'Fine dining experience' }, { name: 'Observation Deck', size: '360°', desc: 'Breathtaking city views' }, { name: 'Open Air Venue', capacity: '150 guests', desc: 'Events & entertainment' }],
        featuresTitle: 'Sky-High Amenities',
        features: ['Heated Infinity Pool with Underwater Music', 'Premium Cabanas & Poolside Service', 'Tropical Garden with Rare Plant Species', 'Sky Lounge with Signature Cocktails', 'Fine Dining with Michelin-Star Chef', 'Live DJ & Entertainment Every Evening', 'Sunset Yoga & Wellness Sessions', 'Private Event Spaces Available'],
        closingTitle: 'Touch the Sky', closingText: 'Our rooftop level is more than a destination—it\'s an experience. Watch the sunset from the infinity pool, dine under the stars at our panoramic restaurant, or simply relax in our tropical sky garden. This is where luxury meets the heavens, offering views and experiences that transform your stay into an unforgettable journey.'
      },
      b1: {
        heroBadge: 'Floor B1', heroTitle: 'Services & Support Level', heroDesc: 'Comprehensive operational facilities including laundry services, storage, housekeeping headquarters, and additional parking',
        overviewTitle: 'Operations Hub',
        stats: ['Items Daily', 'Storage Units', 'Parking Slots', 'Staff Members'],
        areasTitle: 'Service Operations',
        areas: [{ name: 'Laundry Service', status: 'Operational', capacity: '500 items/day' }, { name: 'Storage Units', status: 'Available', capacity: '80 units' }, { name: 'Housekeeping HQ', status: 'Active', capacity: '50 staff' }, { name: 'Additional Parking', status: 'Available', capacity: '80 slots' }],
        mapTitle: 'Floor Layout', mapSubtitle: 'Operational Areas',
        zones: [{ name: 'Industrial Laundry', size: '400 sqm' }, { name: 'Dry Cleaning', size: '150 sqm' }, { name: 'Linen Storage', size: '300 sqm' }, { name: 'Equipment Storage', size: '200 sqm' }, { name: 'Staff Changing Rooms', size: '180 sqm' }, { name: 'Service Elevators', size: '4 units' }],
        featuresTitle: 'Key Features',
        features: ['Industrial-Grade Laundry Equipment for 500+ Items/Day', 'Premium Dry Cleaning Services', 'Climate-Controlled Storage Facilities', 'Housekeeping Command Center', 'Staff Facilities with Changing Rooms & Lockers', 'Direct Service Elevator Access to All Floors']
      },
      b2: {
        heroBadge: 'Floor B2', heroTitle: 'Main Parking Level', heroDesc: 'Premium underground parking with 150 slots, EV charging stations, and 24/7 security monitoring',
        storyText: 'Where arrival begins with security, convenience, and a promise of exceptional care.',
        overviewTitle: 'Parking Overview',
        stats: ['Total Slots', 'EV Chargers', 'Surveillance', '100% Secure'],
        areasTitle: 'Parking Zones',
        zones: [{ id: 'A', slots: 30, type: 'Standard', status: 'Available' }, { id: 'B', slots: 30, type: 'Standard', status: 'Available' }, { id: 'C', slots: 25, type: 'VIP', status: 'Reserved' }, { id: 'D', slots: 20, type: 'EV Charging', status: 'Active' }, { id: 'E', slots: 15, type: 'Valet Service', status: 'Premium' }],
        facilitiesTitle: 'Facilities & Services',
        facilities: [{ name: 'EV Charging Stations', count: 20 }, { name: 'CCTV Coverage', count: 50 }, { name: 'Valet Service Points', count: 4 }, { name: 'Maintenance Bay', count: 2 }],
        featuresTitle: 'Features',
        features: ['Automated Entry/Exit Gates with License Plate Recognition', 'Premium Valet Service for VIP Guests', 'EV Fast Charging Stations (Type 2 & CCS)', 'Climate-Controlled Environment', '24/7 CCTV Monitoring & Security Patrol', 'Car Wash & Detailing Service Available']
      }
    },
    suites: {
      hero: {
        kicker: 'Presidential Luxury Hotel — Floors 7–11',
        titleLine1: 'Exclusive',
        titleLine2: 'Suites',
        sub: '{{count}} sovereign sky residences crafted for guests who demand nothing less than perfection. From Junior Suites to our legendary Royal penthouse — each is a world unto itself.',
        stats: { suites: 'Suites', floors: 'Floors', butler: 'Butler', rated: 'Rated' }
      },
      filterTabs: {
        all: 'All Suites', junior: '🌟 Junior', executive: '💼 Executive',
        family: '🏡 Family', presidential: '👑 Presidential', royal: '🏰 Royal'
      },
      meta: {
        JUNIOR_SUITE:       { label: 'Junior Suite',       tagline: 'Refined Comfort & Elegance' },
        EXECUTIVE_SUITE:    { label: 'Executive Suite',     tagline: 'Where Business Meets Luxury' },
        FAMILY_SUITE:       { label: 'Family Suite',        tagline: 'A Private Home Above the Clouds' },
        PRESIDENTIAL_SUITE: { label: 'Presidential Suite',  tagline: 'The Ultimate Sky Residence' },
        ROYAL_SUITE:        { label: 'Royal Suite',         tagline: 'Sovereignty Redefined' }
      },
      card: {
        floor: 'Floor', guests: 'Guests', bed: 'Bed', beds: 'Beds', bath: 'Bath', baths: 'Baths',
        exclusiveFeatures: 'Exclusive Features', more: '+{{count}} more', perNight: 'per night',
        viewDetails: 'View Details', reserveSuite: 'Reserve Suite', unavailable: 'Unavailable'
      },
      status: {
        booked: 'Booked', availableSoon: 'Available Soon', maintenance: 'Maintenance',
        currentlyReserved: '🔴 Currently Reserved', checkingOut: '🟣 Checking out soon',
        availableFrom: 'Available from', freeFrom: 'Free from',
        badgeBooked: '🔴 Booked', badgeNearAvail: '🟣 Available Soon', badgeMaintenance: '🔧 Maintenance'
      },
      luxuryFeatures: {
        butler: '24/7 Butler', privatePool: 'Private Pool', privateChef: 'Private Chef',
        jacuzzi: 'Jacuzzi', sauna: 'Sauna', cinema: 'Cinema Room', library: 'Library',
        grandPiano: 'Grand Piano', privateElevator: 'Private Elevator', helipadAccess: 'Helipad Access',
        wineCellar: 'Wine Cellar', rooftopGarden: 'Rooftop Garden', livingRoom: 'Living Room', privateOffice: 'Private Office'
      },
      loading: 'Preparing your suites…',
      empty: 'No suites in this category.',
      showAll: 'Show All',
      cta: {
        label: 'Bespoke Reservations', title: 'Curate Your Perfect Stay',
        sub: 'Our concierge team is available 24/7 to arrange tailored experiences, private transfers, and personalised suite preparation.',
        reserve: 'Reserve a Suite', browse: 'Browse All Rooms'
      }
    },
    booking: {
      pageTitle: 'Book Your Stay', pageSubtitle: 'Find your perfect room in just a few steps',
      loginRequired: 'Please log in to continue', loginToBook: 'Please login to book a room',
      sessionExpired: 'Session expired. Please log in again.',
      questions: {
        guestType: 'Are you traveling as a family or individual?',
        hasChildren: 'Will there be children in your group?',
        childrenInfo: 'Tell us about your children',
        guests: 'How many guests will be staying?',
        roomType: 'What type of accommodation do you prefer?',
        viewPreference: 'What view would you prefer?',
        dates: 'Select your desired dates',
        needsParking: 'Will you need parking services?',
        parkingType: 'What type of parking do you prefer?'
      },
      options: {
        individual: '👤 Individual', individualDesc: 'Solo traveler',
        couple: '💑 Couple', coupleDesc: 'Romantic getaway',
        family: '👨‍👩‍👧‍👦 Family', familyDesc: 'With family members',
        group: '👥 Group', groupDesc: 'Friends or colleagues',
        hasChildrenYes: '👧 Yes, with children', hasChildrenYesDesc: 'Kids will be joining us',
        hasChildrenNo: '🚫 No children', hasChildrenNoDesc: 'Adults only',
        standard: '🛏️ Standard', standardDesc: 'Comfortable & affordable',
        deluxe: '✨ Deluxe', deluxeDesc: 'Premium comfort',
        suite: '👑 VIP Suite', suiteDesc: 'Ultimate luxury',
        presidential: '🏰 Presidential', presidentialDesc: 'The finest experience',
        cityView: '🏙️ City View', cityViewDesc: 'Urban skyline',
        gardenView: '🌳 Garden View', gardenViewDesc: 'Peaceful greenery',
        poolView: '🏊 Pool View', poolViewDesc: 'Resort atmosphere',
        noPreference: '✨ No Preference', noPreferenceDesc: 'Surprise me',
        parkingYes: '✅ Yes, I need parking', parkingYesDesc: 'Reserve a spot',
        parkingNo: '❌ No parking needed', parkingNoDesc: 'Skip this step',
        valet: '🎩 Valet Parking', valetDesc: 'We park your car for you',
        self: '🚙 Self Parking', selfDesc: 'Standard covered parking',
        vip: '⭐ VIP Reserved', vipDesc: 'Exclusive reserved spot',
        ev: '⚡ EV Charging', evDesc: 'Electric vehicle charging'
      },
      children: {
        howMany: 'How many children?', agesTitle: "Children's ages",
        agesHelper: '(optional — helps us suggest the best room)',
        child: 'Child {{n}}', ageOptional: 'Age (optional)',
        underOne: 'Under 1', yearsOld: '{{age}} years old'
      },
      nav: { previous: '← Previous', next: 'Next →', findRooms: '✨ Find Rooms' },
      progress: { step: 'Step {{current}} of {{total}}' },
      direct: {
        kicker: 'Quick Reservation', title: 'Complete Your Booking',
        subtitle: 'Just two quick questions, then confirm your dates.',
        parkingQuestion: 'Will you need parking?',
        parkingSubtitle: 'Complimentary valet and self-parking available for all guests.',
        parkingYesLabel: 'Yes, I need parking', parkingYesDesc: 'Reserve a spot',
        parkingNoLabel: 'No parking needed', parkingNoDesc: 'Skip this step',
        parkingPreference: 'Parking preference',
        parkingFree: 'All parking options are complimentary for hotel guests.',
        selectDates: 'Select your dates',
        datesSubtitle: 'Choose your check-in and check-out dates below.',
        checkIn: 'Check-in', checkOut: 'Check-out',
        total: 'Total', totalSuffix: 'total',
        confirmBtn: '✦ Confirm Reservation', processing: 'Processing…',
        floor: 'Floor', upTo: 'Up to', guests: 'guests',
        night: 'night', nights: 'nights', perNight: '/night'
      },
      results: {
        recommended: 'Recommended Rooms', available: 'Available Rooms',
        newSearch: '← New Search', basedOn: 'Based on your preferences:',
        loading: 'Loading rooms...', noResults: 'No rooms available matching your criteria',
        tryDifferent: 'Try Different Options', topMatch: '⭐ Top Match',
        floorLabel: 'Floor', capacityLabel: 'Capacity', sizeLabel: 'Size', priceLabel: 'Price',
        perNight: '/night', viewDetails: 'View Details', bookNow: 'Book Now', dismiss: 'Dismiss',
        guest: 'guest', guests: 'guests', child: 'child', children: 'children'
      },
      success: {
        message: 'Room booked successfully. Welcome.',
        viewBookings: 'View My Bookings', continueBrowsing: 'Continue Browsing'
      },
      guestForm: {
        title: 'Complete Your Booking',
        subtitle: 'Please provide your details to confirm the reservation',
        firstName: 'First Name *', lastName: 'Last Name *',
        email: 'Email Address *', phone: 'Phone Number (Optional)',
        cancel: 'Cancel', confirm: 'Confirm Booking', processing: 'Processing...'
      },
      dates: { checkIn: '📅 Check-in', checkOut: '📅 Check-out' }
    },
    bookingConfirm: {
      pageTitle: 'Confirm Your Booking',
      noRoom: 'No room selected', noRoomBack: 'Go Back to Booking',
      roomDetails: 'Room Details', capacity: 'Capacity: {{count}} guests',
      discountMessage: "You're getting a special discount on this booking!",
      discountFirst: 'First Visit Discount (20%)', discountReturning: 'Returning Guest Discount (10%)',
      bookingInfo: 'Booking Information', checkIn: 'Check-in Date', checkOut: 'Check-out Date',
      numGuests: 'Number of Guests', specialRequests: 'Special Requests (Optional)',
      requestsPlaceholder: 'Any special requirements or preferences...',
      roomRate: 'Room Rate ({{nights}} nights)', total: 'Total',
      back: 'Go Back', confirm: 'Confirm Booking', processing: 'Processing...',
      errorDates: 'Please select check-in and check-out dates',
      errorDateOrder: 'Check-out date must be after check-in date'
    },
    bookingSuccess: {
      title: 'Booking Confirmed!',
      subtitle: 'Your reservation has been successfully confirmed',
      bookingNumber: 'Booking Number', guestName: 'Guest Name',
      room: 'Room', roomPrefix: 'Room', roomType: 'Room Type',
      checkIn: 'Check-in', checkOut: 'Check-out', guests: 'Guests',
      totalAmount: 'Total Amount', discountApplied: 'Discount Applied', finalPrice: 'Final Price',
      discountMsg: 'You saved ${{amount}} with your {{type}} discount!',
      discountFirst: 'first visit', discountReturning: 'returning guest',
      nextSteps: "What's Next?",
      confirmEmail: 'Confirmation Email',
      confirmEmailText: 'Check your email for booking confirmation and details',
      stayUpdated: 'Stay Updated',
      stayUpdatedText: 'Track your booking status in your dashboard',
      checkInStep: 'Check-in', checkInStepText: 'Arrive at the hotel on your check-in date',
      dashboard: 'View Dashboard', backHome: 'Back to Home'
    },
    roomDetail: {
      loading: 'Loading room details...',
      notFound: 'Room Not Found', notFoundText: 'The requested room could not be found.',
      backToRooms: 'Back to Rooms',
      viewPhotos: '🖼️ View All Photos ({{count}})',
      noImages: 'No images available',
      description: 'Description', view: '🌅 View', bed: '🛏️ Bed',
      bathroom: '🛁 Bathroom', services: '✨ Services Included', amenities: '🎯 Amenities',
      pricePerNight: 'Price per night',
      upToGuests: 'Up to {{count}} guests', roomSize: '{{size}} m² room size',
      available: '✓ Available', bookNow: 'Book Now',
      freeCancellation: 'Free cancellation up to 24 hours before check-in',
      floor: 'Floor', guests: 'Guests', roomTitle: 'Room',
      amenityNames: {
        wifi: 'Wi-Fi', tv: 'TV', smart_tv: 'Smart TV', air_conditioning: 'Air Conditioning',
        minibar: 'Minibar', safe: 'Safe', hairdryer: 'Hair Dryer', iron: 'Iron',
        desk: 'Work Desk', espresso_machine: 'Espresso Machine', nespresso: 'Nespresso',
        bathrobes: 'Bathrobes', slippers: 'Slippers', bluetooth_speaker: 'Bluetooth Speaker',
        sound_system: 'Sound System', wine_fridge: 'Wine Fridge',
        premium_toiletries: 'Premium Toiletries', yoga_mat: 'Yoga Mat',
        smart_home: 'Smart Home', home_theater: 'Home Theater', full_bar: 'Full Bar',
        jacuzzi: 'Jacuzzi', butler_pantry: 'Butler Pantry', luxury_linens: 'Luxury Linens',
        pillow_menu: 'Pillow Menu', video_conferencing: 'Video Conferencing',
        multi_room_audio: 'Multi-Room Audio', wine_cellar: 'Wine Cellar',
        massage_chair: 'Massage Chair', butler_service: 'Butler Service', printer: 'Printer',
        standing_desk: 'Standing Desk', smart_home_automation: 'Smart Home Automation',
        private_cinema: 'Private Cinema', chef_kitchen: 'Chef Kitchen', wine_room: 'Wine Room',
        helipad_access: 'Helipad Access', limousine_service: 'Limousine Service',
        everything_included: 'Everything Included', personal_staff: 'Personal Staff',
        private_chef: 'Private Chef', chauffeur: 'Chauffeur', yacht_access: 'Yacht Access',
        helicopter_transfers: 'Helicopter Transfers', concierge_24h: '24/7 Concierge',
        balcony: 'Balcony', private_pool: 'Private Pool', separate_living: 'Separate Living Room',
        dining_area: 'Dining Area', separate_living_area: 'Separate Living Area',
      },
      bathroomTypes: {
        standard_bath: 'Standard Bath', luxury_bath: 'Luxury Bath',
        marble_bathroom: 'Marble Bathroom', rain_shower: 'Rain Shower',
        steam_shower: 'Steam Shower', jacuzzi_bath: 'Jacuzzi Bath',
        double_vanity: 'Double Vanity', ensuite: 'En-suite Bathroom',
      },
      bathroomFeatures: {
        shower: 'Shower', bathtub: 'Bathtub', hair_dryer: 'Hair Dryer',
        magnifying_mirror: 'Magnifying Mirror', premium_toiletries: 'Premium Toiletries',
        heated_floor: 'Heated Floor', rain_shower: 'Rain Shower', dual_sink: 'Dual Sink',
        soaking_tub: 'Soaking Tub', bidet: 'Bidet', luxury_toiletries: 'Luxury Toiletries',
        towels: 'Towels', bathrobes: 'Bathrobes', slippers: 'Slippers',
        separate_shower: 'Separate Shower', steam_room: 'Steam Room',
      },
      serviceNames: {
        daily_housekeeping: 'Daily Housekeeping', room_service_24h: '24/7 Room Service',
        room_service: 'Room Service', turndown_service: 'Turndown Service',
        laundry_service: 'Laundry Service', concierge_service: 'Concierge Service',
        airport_transfer: 'Airport Transfer', valet_parking: 'Valet Parking',
        business_services: 'Business Services', wake_up_call: 'Wake-up Call',
        newspaper_delivery: 'Newspaper Delivery', welcome_drink: 'Welcome Drink',
        butler_service: 'Dedicated Butler Service', private_check_in: 'Private Check-in',
        in_suite_dining: 'In-Suite Dining', complimentary_breakfast: 'Complimentary Breakfast',
        spa_access: 'Spa Access', fitness_center: 'Fitness Center Access',
        pool_access: 'Pool Access', pressing_service: 'Pressing Service',
      },
      typeDescriptions: {
        STANDARD: 'Comfortable standard room with modern amenities and city view.',
        SINGLE: 'Compact, stylish single room for the solo traveler.',
        COUPLE: 'Romantic room with premium amenities and elegant design.',
        FAMILY: 'Spacious family room with multiple beds and pool view.',
        DELUXE: 'Sophisticated deluxe room with panoramic views and marble bath.',
        JUNIOR_SUITE: 'Elegant junior suite with separate seating area and premium amenities.',
        EXECUTIVE_SUITE: 'Executive suite combining luxury and professional functionality.',
        FAMILY_SUITE: 'Expansive family suite with every comfort for your family.',
        PRESIDENTIAL_SUITE: 'Presidential suite with exclusive services and unmatched comfort.',
        ROYAL_SUITE: 'The finest royal accommodation at the highest standards.',
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        floors: 'الطوابق',
        rooms: 'الغرف',
        suites: 'الأجنحة',
        services: 'الخدمات',
        premium: 'المميزة',
        bookNow: 'احجز الآن',
        signIn: 'تسجيل الدخول',
        dashboard: 'لوحة التحكم',
        myProfile: 'ملفي الشخصي',
        myBookings: 'حجوزاتي',
        myOrders: 'طلباتي',
        hotelStore: 'متجر الفندق',
        logout: 'تسجيل الخروج',
        guest: 'ضيف',
        guestRole: 'نزيل الفندق'
      },
      profile: {
        member: 'عضو',
        totalBookings: 'إجمالي الحجوزات',
        activeBookings: 'الحجوزات النشطة',
        totalSpent: 'إجمالي الإنفاق',
        loyaltyPoints: 'نقاط الولاء',
        overview: 'نظرة عامة',
        myBookings: 'حجوزاتي',
        settings: 'الإعدادات',
        welcomeBack: 'مرحباً بعودتك',
        overviewDescription: 'إدارة حجوزاتك واستكشاف الخدمات والاستمتاع بإقامتك.',
        bookRoom: 'احجز غرفة',
        viewBookings: 'عرض الحجوزات',
        exploreServices: 'استكشف الخدمات',
        hotelStore: 'متجر الفندق',
        recentBookings: 'الحجوزات الأخيرة',
        noBookings: 'ليس لديك حجوزات بعد.',
        makeFirstBooking: 'قم بحجزك الأول',
        room: 'غرفة',
        accountSettings: 'إعدادات الحساب',
        personalInfo: 'المعلومات الشخصية',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        addPhone: 'أضف رقم الهاتف',
        dangerZone: 'منطقة الخطر'
      },
      bookings: {
        myBookings: 'حجوزاتي',
        manageYourReservations: 'إدارة حجوزاتك وعرض التفاصيل',
        all: 'الكل',
        active: 'نشطة',
        completed: 'مكتملة',
        cancelled: 'ملغاة',
        noBookingsFound: 'لم يتم العثور على حجوزات',
        startBooking: 'ابدأ باستكشاف غرفنا وقم بحجزك الأول!',
        bookNow: 'احجز الآن',
        bookingNumber: 'رقم الحجز',
        room: 'غرفة',
        floor: 'طابق',
        checkIn: 'تسجيل الدخول',
        checkOut: 'تسجيل الخروج',
        nights: 'ليالي',
        guests: 'الضيوف',
        totalPrice: 'السعر الإجمالي',
        specialRequests: 'الطلبات الخاصة',
        bookedOn: 'تم الحجز في',
        cancel: 'إلغاء الحجز',
        newBooking: 'حجز جديد',
        backToProfile: 'العودة للملف الشخصي'
      },
      orders: {
        myOrders: 'طلباتي',
        trackYourOrders: 'تتبع طلبات خدمة الغرف والمتجر',
        noOrdersFound: 'لم يتم العثور على طلبات',
        startOrdering: 'قم بزيارة متجر الفندق لتقديم طلبك الأول!',
        visitStore: 'زيارة المتجر',
        orderNumber: 'رقم الطلب',
        total: 'المجموع',
        goToStore: 'الذهاب للمتجر',
        backToProfile: 'العودة للملف الشخصي'
      },
      common: {
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        view: 'عرض',
        close: 'إغلاق',
        confirm: 'تأكيد',
        back: 'رجوع',
        next: 'التالي',
        submit: 'إرسال'
      },
      dashboard: {
        guestPortal: 'بوابة النزلاء',
        adminPanel: 'لوحة الإدارة',
        guestDashboard: 'لوحة النزيل',
        adminDashboard: 'لوحة الإدارة',
        welcomeBack: 'مرحبًا بعودتك إلى الرفاهية الرئاسية',
        overview: 'نظرة عامة',
        floorManagement: 'إدارة الطوابق',
        roomManagement: 'إدارة الغرف',
        pricingAvailability: 'التسعير والتوفر',
        staffManagement: 'إدارة الموظفين',
        analyticsReports: 'التحليلات والتقارير',
        myReservations: 'حجوزاتي',
        billing: 'الفواتير',
        serviceRequests: 'طلبات الخدمة',
        profile: 'الملف الشخصي',
        bookingHistory: 'سجل الحجوزات',
        logout: 'تسجيل الخروج'
      },
      language: {
        label: 'اللغة',
        en: 'EN',
        ar: 'AR',
        tr: 'TR'
      },
      auth: {
        signIn: 'تسجيل الدخول',
        register: 'تسجيل جديد',
        backToSelection: 'العودة لاختيار الدور',
        backToDepartment: 'العودة لاختيار القسم',
        staffId: 'رقم الموظف',
        pin: 'الرقم السري',
        invalidCredentials: 'رقم الموظف أو الرقم السري غير صحيح',
        invalidPin: 'يجب أن يكون الرقم السري 4 أرقام على الأقل',
        success: {
          registrationTitle: 'تم التسجيل بنجاح!',
          registrationMessage: 'مرحباً بك! استمتع بخصم 20% للزوار الجدد',
          loginTitle: 'تم تسجيل الدخول بنجاح!',
          welcomeBack: 'مرحباً بعودتك!',
          welcomeBackMessage: 'خصم الولاء 10% نشط الآن',
          adminTitle: 'تم منح الوصول للمسؤول',
          adminMessage: 'مرحباً بك في لوحة التحكم',
          staffWelcome: 'مرحباً بك في {{department}}'
        },
        accessEntry: {
          title: 'اختر مستوى الوصول',
          subtitle: 'اختر دورك للمتابعة',
          footer: 'دخول آمن إلى فندق الفخامة الرئاسية',
          roles: {
            firstTime: {
              title: 'نزيل جديد',
              subtitle: 'جديد في تجربة الفخامة',
              highlight: 'خصم 20%',
              cta: 'سجل الآن'
            },
            returning: {
              title: 'نزيل عائد',
              subtitle: 'مرحباً بعودتك للتميز',
              highlight: 'ولاء 10%',
              cta: 'تسجيل الدخول'
            },
            staff: {
              title: 'موظف',
              subtitle: 'بوابة الموظفين',
              highlight: 'وصول الفريق',
              cta: 'دخول الموظفين'
            },
            admin: {
              title: 'مسؤول النظام',
              subtitle: 'لوحة التحكم الإدارية',
              highlight: 'وصول كامل',
              cta: 'دخول المسؤول'
            }
          }
        },
        guestNew: {
          title: 'تسجيل نزيل جديد',
          subtitle: 'انضم إلى مجتمعنا الحصري',
          fields: {
            fullName: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            phone: 'رقم الهاتف',
            preferences: 'التفضيلات الخاصة (اختياري)'
          },
          cta: 'تسجيل الدخول',
          footer: 'لديك حساب بالفعل؟',
          footerLink: 'سجل دخولك هنا',
          errors: {
            invalidName: 'الرجاء إدخال اسم صحيح',
            invalidEmail: 'الرجاء إدخال بريد إلكتروني صحيح',
            invalidPassword: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
            loginFailed: 'فشل التسجيل. حاول مرة أخرى.'
          }
        },
        guestReturning: {
          title: 'مرحباً بعودتك',
          subtitle: 'سجل دخولك إلى حسابك',
          fields: {
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            loyaltyId: 'رقم الولاء (اختياري)'
          },
          cta: 'تسجيل الدخول',
          footer: 'جديد في فندقنا؟',
          footerLink: 'سجل هنا',
          errors: {
            invalidEmail: 'الرجاء إدخال بريد إلكتروني صحيح',
            invalidPassword: 'كلمة المرور مطلوبة',
            loginFailed: 'فشل تسجيل الدخول. تحقق من بياناتك.'
          }
        },
        admin: {
          title: 'دخول المسؤول',
          subtitle: 'الوصول إلى لوحة التحكم الإدارية',
          fields: {
            username: 'اسم المستخدم للمسؤول',
            password: 'كلمة مرور المسؤول'
          },
          cta: 'تسجيل الدخول',
          errors: {
            invalidUsername: 'اسم المستخدم مطلوب',
            invalidPassword: 'كلمة المرور مطلوبة',
            loginFailed: 'بيانات المسؤول غير صحيحة'
          }
        },
        staff: {
          title: 'دخول الموظفين',
          subtitle: 'بوابة الموظفين',
          fields: {
            staffId: 'رقم الموظف',
            pin: 'الرقم السري'
          },
          cta: 'تسجيل الدخول'
        },
        staffRoles: {
          title: 'اختر قسمك',
          subtitle: 'اختر دور موظفك للمتابعة',
          roles: {
            cleaning: {
              title: 'طاقم التنظيف',
              department: 'التدبير المنزلي'
            },
            maintenance: {
              title: 'طاقم الصيانة',
              department: 'الخدمات الفنية'
            },
            kitchen: {
              title: 'طاقم المطبخ',
              department: 'الطهي'
            },
            club: {
              title: 'طاقم النادي',
              department: 'الترفيه'
            },
            security: {
              title: 'طاقم الأمن',
              department: 'الأمن'
            },
            nurse: {
              title: 'ممرضة طبية',
              department: 'الطبي'
            }
          }
        }
      },
      profile: {
        title: 'ملفي الشخصي',
        editProfile: 'تعديل الملف',
        saveChanges: 'حفظ التغييرات',
        cancelEdit: 'إلغاء',
        defaultName: 'مستخدم',
        sections: {
          personalInfo: 'المعلومات الشخصية',
          accountDetails: 'تفاصيل الحساب',
          privileges: 'صلاحيات الوصول',
          invoices: 'فواتيري',
          offers: 'عروضي النشطة'
        },
        fields: {
          name: 'الاسم الكامل',
          fullName: 'الاسم الكامل',
          userId: 'رقم المستخدم',
          username: 'اسم المستخدم',
          email: 'البريد الإلكتروني',
          phone: 'رقم الهاتف',
          phoneNumber: 'رقم الهاتف',
          preferences: 'التفضيلات',
          specialPreferences: 'التفضيلات الخاصة',
          role: 'الدور',
          accountType: 'نوع الحساب',
          accountStatus: 'حالة الحساب',
          memberId: 'رقم العضوية',
          loyaltyId: 'رقم الولاء',
          memberSince: 'عضو منذ',
          activeDiscount: 'الخصم النشط',
          staffId: 'رقم الموظف',
          department: 'القسم'
        },
        status: {
          active: 'نشط',
          inactive: 'غير نشط'
        },
        roles: {
          guest: 'نزيل',
          staff: 'موظف',
          admin: 'مسؤول'
        },
        accountTypes: {
          firstTime: 'نزيل جديد',
          returning: 'نزيل عائد',
          vip: 'عضو VIP'
        },
        invoices: {
          number: 'فاتورة',
          date: 'التاريخ',
          status: 'الحالة',
          paid: 'مدفوعة',
          pending: 'معلقة',
          total: 'المبلغ الإجمالي',
          discount: 'الخصم',
          downloadPdf: 'تحميل PDF',
          items: {
            suiteBooking: 'حجز جناح',
            nights: 'ليالٍ',
            spaServices: 'خدمات السبا',
            restaurantCharges: 'رسوم المطعم',
            premiumSuite: 'جناح مميز'
          }
        },
        offers: {
          validUntil: 'صالح حتى:',
          status: 'الحالة:',
          activeNow: 'نشط الآن',
          claimOffer: 'احصل على العرض',
          luxurySpa: {
            title: 'باقة سبا فاخرة',
            description: 'تجربة سبا ليوم كامل مع تدليك وعناية بالوجه والجسم'
          },
          michelinDining: {
            title: 'عشاء نجمة ميشلان',
            description: 'وجبة من ثلاثة أطباق في مطعمنا الحائز على جوائز'
          },
          welcomeDiscount: {
            title: 'خصم الترحيب الخاص بك',
            description: 'خصم تلقائي يطبق على جميع الحجوزات والخدمات'
          },
          loyaltyDiscount: {
            title: 'خصم الولاء الخاص بك',
            description: 'خصم تلقائي يطبق على جميع الحجوزات والخدمات'
          }
        }
      },
      floors: {
        interactiveMap: 'خريطة الطابق التفاعلية',
        parkingZones: 'مناطق الوقوف',
        amenities: 'المرافق',
        facilities: 'التسهيلات'
      },
      receptionist: {
        title: 'مساعد الاستقبال الشخصي',
        subtitle: 'دعنا نرشدك للإقامة المثالية',
        chat: {
          welcome: 'مرحباً! أنا هنا لمساعدتك في العثور على الإقامة المثالية. هل يمكنني طرح بعض الأسئلة؟',
          numberOfGuests: 'كم عدد النزلاء؟',
          stayType: 'ما نوع الإقامة التي تبحث عنها؟',
          preferences: 'ما هي الميزات الأكثر أهمية بالنسبة لك؟',
          duration: 'كم ستكون مدة إقامتك؟',
          specialNeeds: 'هل لديك أي متطلبات خاصة؟',
          summary: 'بناءً على تفضيلاتك، إليك توصياتنا:',
          letsBegin: 'لنبدأ',
          next: 'التالي',
          previous: 'السابق',
          finish: 'عرض التوصيات',
          reset: 'البدء من جديد'
        },
        stayTypes: {
          luxury: 'تجربة فاخرة',
          family: 'راحة عائلية',
          business: 'إقامة عمل',
          quiet: 'ملاذ هادئ'
        },
        features: {
          view: 'إطلالة مميزة',
          spa: 'الوصول للسبا',
          restaurant: 'مطاعم راقية',
          budget: 'اقتصادي',
          suite: 'جناح فاخر',
          pool: 'الوصول للمسبح',
          gym: 'مركز اللياقة',
          parking: 'موقف سيارات'
        },
        duration: {
          short: '١-٢ ليلة',
          medium: '٣-٧ ليالي',
          long: '٧+ ليالي',
          extended: 'إقامة طويلة (شهرية)'
        },
        specialNeeds: {
          children: 'السفر مع الأطفال',
          elderly: 'نزيل كبير السن',
          medical: 'متطلبات طبية',
          vip: 'خدمات VIP',
          accessibility: 'احتياجات خاصة',
          pets: 'صديق للحيوانات الأليفة'
        },
        recommendations: {
          title: 'موصى به لك',
          floors: 'الطوابق المقترحة',
          rooms: 'الغرف المتاحة',
          services: 'الخدمات الموصى بها',
          viewMap: 'عرض على الخريطة',
          bookNow: 'احجز الآن',
          learnMore: 'اعرف المزيد',
          noResults: 'لم يتم العثور على نتائج. دعنا نعدل تفضيلاتك.',
          perfect: 'مطابقة تامة',
          good: 'مطابقة جيدة',
          available: 'متاح'
        },
        filters: {
          applying: 'تطبيق تفضيلاتك...',
          found: 'تم العثور على {{count}} خيار',
          refining: 'تحسين النتائج...'
        }
      },
      guestDashboard: {
        welcome: 'مرحباً، {{name}}!',
        welcomeGuest: 'مرحباً بك أيها النزيل!',
        firstTimeDiscount: 'خصم 20% للزوار الجدد نشط الآن 🎉',
        loyaltyDiscount: 'خصم الولاء 10% نشط الآن ⭐',
        quickAccess: 'وصول سريع',
        latestAnnouncements: 'آخر الإعلانات',
        exclusiveOffers: 'عروض حصرية',
        actions: {
          bookRoom: 'احجز غرفة',
          diningReservation: 'حجز مطعم',
          spaBooking: 'حجز سبا',
          premiumServices: 'خدمات مميزة'
        },
        announcements: {
          specialOffer: {
            title: 'عرض نهاية الأسبوع الخاص',
            description: 'احصل على خصم إضافي 15% على حجوزات نهاية الأسبوع هذا الشهر!'
          },
          newRestaurant: {
            title: 'افتتاح مطعم جديد',
            description: 'جرب مطعمنا الجديد الحائز على نجمة ميشلان في الطابق 1'
          },
          maintenance: {
            title: 'إشعار صيانة المسبح',
            description: 'سيكون مسبح السطح تحت الصيانة في 20-21 ديسمبر'
          }
        },
        offers: {
          spaPackage: {
            title: 'خصم 30% على باقة السبا',
            description: 'تجربة عافية فاخرة',
            validUntil: '31 ديسمبر 2024'
          },
          dining: {
            title: 'خصم 25% على المطعم الفاخر',
            description: 'مطعم نجمة ميشلان',
            validUntil: '25 ديسمبر 2024'
          },
          suite: {
            title: 'خصم 20% على ترقية الجناح',
            description: 'إقامة مميزة',
            validUntil: '30 ديسمبر 2024'
          }
        },
        claimOffer: 'احصل على العرض',
        viewProfile: 'عرض الملف الشخصي'
      },
      concierge: {
        launcherTitle: 'الكونسيرج',
        title: 'كونسيرج رئاسي',
        subtitle: 'إرشاد هادئ لإقامة مصممة خصيصًا لك',
        restart: 'إعادة البدء',
        close: 'إغلاق',
        inputPlaceholder: 'اكتب إجابتك…',
        send: 'إرسال',
        services: {
          spa: 'السبا',
          dining: 'الطعام',
          private_driver: 'سائق خاص',
          medical_support: 'دعم طبي'
        },
        messages: {
          greeting: 'مرحبًا. أنا الكونسيرج الرئاسي الخاص بك.',
          intro: 'هل تسمح لي ببعض الأسئلة السريعة لأوصي بإقامة مثالية؟',
          validation: 'من فضلك اختر أحد الخيارات أو أدخل إجابة صحيحة.',
          useButtons: 'لهذه الخطوة، يرجى استخدام الأزرار بالأسفل.',
          noPreference: 'لا تفضيل',
          recommendationIntro: 'بناءً على تفضيلاتك، أوصي بـ:',
          room: 'الغرفة',
          services: 'الخدمات المقترحة',
          experiences: 'تجارب مميزة',
          followUp: 'هل ترغب أن أخصصها لاحقًا للتواريخ أو الطلبات الخاصة؟'
        },
        flow: {
          guests: {
            question: 'كم عدد الضيوف؟',
            one: '1',
            two: '2',
            three: '3',
            fourPlus: '4+'
          },
          purpose: {
            question: 'ما هدف الإقامة؟',
            business: 'عمل',
            leisure: 'ترفيه',
            honeymoon: 'شهر عسل',
            family: 'عائلة'
          },
          services: {
            question: 'ما الخدمات التي تفضل إعطاءها أولوية؟',
            spa: 'السبا',
            dining: 'الطعام',
            privateDriver: 'سائق خاص',
            medicalSupport: 'دعم طبي',
            done: 'تم'
          },
          budget: {
            question: 'ما مستوى الميزانية الذي تفضله؟',
            luxury: 'فاخر',
            premium: 'مميز',
            exclusive: 'حصري'
          }
        }
      }
      ,
      floorMaps: {
        common: {
          floorLabel: 'الطابق {{floor}}',
          instructions: 'خريطة تفاعلية — اختر منطقة لعرض التفاصيل أو المتابعة.',
          ariaLabel: 'خريطة تفاعلية للطابق {{floor}}',
          restricted: 'مقيّد',
          proceed: 'متابعة',
          details: 'تفاصيل',
          legend: {
            interactive: 'منطقة تفاعلية',
            restricted: 'منطقة مقيّدة'
          },
          routeModal: {
            description:
              'اختر إجراءً بالأسفل للمتابعة. تبقى الخريطة ثابتة بينما تظهر نافذة التفاصيل فوقها.',
            destination: 'الوجهة'
          }
        },
        meta: {
          availability: 'التوفر',
          access: 'الدخول',
          process: 'الإجراء',
          security: 'الأمان',
          transfer: 'الانتقال',
          coverage: 'التغطية',
          control: 'التحكم',
          function: 'الوظيفة',
          capacity: 'السعة',
          purpose: 'الغرض',
          operations: 'العمليات',
          standard: 'المعيار',
          design: 'التصميم',
          flow: 'التدفق',
          services: 'الخدمات',
          service: 'الخدمة',
          atmosphere: 'الأجواء',
          highlights: 'الأبرز',
          support: 'الدعم',
          layouts: 'التخطيطات',
          use: 'الاستخدام',
          bestFor: 'الأفضل لـ',
          meals: 'الوجبات',
          separation: 'الفصل',
          impact: 'الأثر',
          experience: 'التجربة'
        },
        actions: {
          proceedToBooking: 'المتابعة إلى الحجز',
          exploreChauffeur: 'استكشاف خدمة السائق',
          viewPremiumServices: 'عرض الخدمات المميزة',
          exploreConcierge: 'استكشاف الكونسيرج',
          exploreSpaWellness: 'استكشاف السبا والعافية',
          exploreServiceRequests: 'استكشاف طلبات الخدمة',
          requestService: 'طلب خدمة',
          viewStaffResidences: 'عرض مساكن الموظفين',
          viewServiceRequests: 'عرض طلبات الخدمة',
          exploreWellnessFacilities: 'استكشاف مرافق العافية'
        },
        floors: {
          b2: {
            name: 'مستوى المواقف الرئيسي',
            zones: {
              valet: {
                label: 'تسليم السيارة للـ Valet',
                hint: 'تسليم مركبة مميز',
                title: 'تسليم السيارة للـ Valet',
                subtitle: 'وصول سلس، تعامل متكتم، وأولوية في الدخول.',
                description:
                  'يعمل فريق الـ Valet بتصاريح أمنية وبروتوكولات تسليم موثقة بالوقت. تُنقل المركبات عبر ممرات مضبوطة إلى مواقف مخصصة مع دخول مراقب.',
                meta: {
                  availability: '24/7',
                  access: 'النزلاء وVIP',
                  process: 'تسليم موثق + تذكرة رقمية'
                }
              },
              ev: {
                label: 'منطقة شحن السيارات الكهربائية',
                hint: 'ممر شحن سريع',
                title: 'منطقة شحن السيارات الكهربائية',
                subtitle: 'شحن هادئ ومتحكم بالحرارة مع مراقبة للمواقف.',
                description:
                  'مواقف الشحن الكهربائية موضوعة قرب ممر الأمان. تدعم كل محطة جدولة الدخول ومراقبة ذكية لحماية المركبة وخصوصية الضيف.',
                meta: {
                  availability: 'أماكن محدودة',
                  access: 'مركبات النزلاء',
                  security: 'كاميرات + سجل دخول'
                }
              },
              vip: {
                label: 'مواقف VIP مخصصة',
                hint: 'منطقة دخول مضبوطة',
                title: 'مواقف VIP مخصصة',
                subtitle: 'مواقف تحت إشراف أمني لوصول الشخصيات المهمة.',
                description:
                  'مواقف VIP مفصولة بحواجز ونقاط تفتيش. تم تصميم بروتوكول الدخول للسرية والنقل السريع بالمصعد وتقليل الظهور.',
                meta: {
                  availability: 'بالموافقة',
                  access: 'VIP + مرافقة أمنية',
                  transfer: 'ممر مصعد خاص'
                }
              },
              security: {
                label: 'نقطة تفتيش الأمن',
                hint: 'دخول مراقب ومتابعة',
                title: 'نقطة تفتيش الأمن',
                subtitle: 'مراقبة وتحكم بالدخول لممرات المركبات.',
                description:
                  'تنسيق تغطية CCTV، التحكم بالحواجز، والاستجابة للحوادث. يتم توجيه دخول النزلاء والتحقق منه عند كل نقطة حرجة.',
                meta: {
                  access: 'مقيّد',
                  coverage: 'CCTV + دوريات',
                  control: 'بوابات + ممر المصعد'
                }
              },
              maintenance: {
                label: 'منطقة الصيانة',
                hint: 'مركبات ومعدات الخدمة',
                title: 'منطقة الصيانة',
                subtitle: 'منطقة تشغيل للسلامة واعتمادية المرفق.',
                description:
                  'تقوم فرق الهندسة بالفحوصات الدورية وتجهيزات الطوارئ ودعم البنية التحتية لعمليات المواقف. دخول النزلاء مقيّد للسلامة.',
                meta: {
                  access: 'مقيّد',
                  function: 'هندسة وسلامة',
                  availability: 'عمليات 24/7'
                }
              },
              guestElevators: {
                label: 'نواة مصاعد النزلاء',
                hint: 'دخول مباشر إلى الردهة'
              }
            }
          },
          b1: {
            name: 'مستوى الخدمات والدعم',
            zones: {
              laundry: {
                label: 'مغسلة صناعية',
                hint: 'معالجة وتعقيم المفروشات',
                title: 'مغسلة صناعية',
                subtitle: 'نظافة دقيقة وإنتاج يومي وعناية بالمنسوجات.',
                description:
                  'تتم إدارة حركة المفروشات بفصل صارم بين المسارات النظيفة والمستخدمة لضمان راحة النزيل وموثوقية التشغيل.',
                meta: {
                  access: 'مقيّد',
                  capacity: 'قدرة عالية',
                  purpose: 'مفروشات النزلاء والزي الرسمي'
                }
              },
              storage: {
                label: 'مستودعات التخزين',
                hint: 'مخزون وإمدادات آمنة',
                title: 'مستودعات التخزين',
                subtitle: 'مناطق مخزون مضبوطة مع تتبع تدقيقي.',
                description:
                  'تُخزن المشتريات ووسائل الراحة ومستلزمات الفعاليات ضمن ممرات منظمة مع دخول مقيّد، لدعم إعادة تزويد سريعة دون تأثير على النزلاء.',
                meta: {
                  access: 'مقيّد',
                  purpose: 'مستلزمات واحتياجات',
                  security: 'دخول مسجّل'
                }
              },
              housekeeping: {
                label: 'مركز التدبير المنزلي',
                hint: 'قيادة العمليات والتوزيع',
                title: 'مركز التدبير المنزلي',
                subtitle: 'توزيع المهام وفحوص الجودة ومعايير جاهزية النزلاء.',
                description:
                  'يُنسّق هذا المركز جاهزية الغرف وجداول الترتيب المسائي وبروتوكولات تجهيز VIP. صُمم للسرعة والهدوء والدقة.',
                meta: {
                  access: 'مقيّد',
                  operations: '24/7',
                  standard: 'بروتوكولات تجهيز VIP'
                }
              },
              serviceElevators: {
                label: 'نواة مصاعد الخدمة',
                hint: 'دخول رأسي تشغيلي',
                title: 'نواة مصاعد الخدمة',
                subtitle: 'حركة منفصلة للموظفين والعمليات.',
                description:
                  'تم تصميم حركة الخدمة للحفاظ على هدوء مسارات النزلاء دون انقطاع مع تمكين لوجستيات عالية الكفاءة.',
                meta: {
                  access: 'مقيّد',
                  purpose: 'تدفق العمليات',
                  design: 'فصل مسار النزيل'
                }
              },
              additionalParking: {
                label: 'مواقف إضافية',
                hint: 'سعة إضافية ومركبات الموظفين'
              },
              guestCore: {
                label: 'ربط مصاعد النزلاء',
                hint: 'دخول مباشر إلى الردهة'
              }
            }
          },
          0: {
            name: 'الردهة الكبرى والاستقبال',
            zones: {
              entrance: {
                label: 'المدخل الكبير',
                hint: 'محور الوصول',
                title: 'المدخل الكبير',
                subtitle: 'وصول احتفالي صُمم للانطباع الأول.',
                description:
                  'ممر الدخول هادئ عمدًا: إضاءة مضبوطة، معالجة صوتية، ومسار واضح نحو الاستقبال. يضمن تموضع الفريق المساعدة الفورية دون ازدحام بصري.',
                meta: {
                  access: 'عام',
                  purpose: 'الوصول والترحيب',
                  flow: 'مباشر إلى الاستقبال'
                }
              },
              reception: {
                label: 'مكتب الاستقبال',
                hint: 'تسجيل الدخول والكونسيرج',
                title: 'مكتب الاستقبال',
                subtitle: 'تسجيل دخول متكتم بدعم من حرفية الكونسيرج.',
                description:
                  'يعمل الاستقبال بطبقات خدمة: مكتب رئيسي، خدمة VIP، ودعم أولوية. تُوجَّه طلباتك إلى الفريق المناسب فورًا.',
                meta: {
                  availability: '24/7',
                  access: 'عام',
                  services: 'كونسيرج + خدمة VIP'
                }
              },
              lounge: {
                label: 'ردهة فاخرة',
                hint: 'انتظار وضيافة',
                title: 'ردهة فاخرة',
                subtitle: 'راحة هادئة، ضيافة مختارة، وإطلالات على المدينة.',
                description:
                  'صُممت الردهة لانتقالات هادئة: انتظار تسجيل الدخول، اجتماعات غير رسمية، ولحظات خاصة. توزيع المقاعد يحافظ على المساحة الشخصية.',
                meta: {
                  access: 'النزلاء',
                  availability: 'طوال اليوم',
                  atmosphere: 'فاخر منخفض الضوضاء'
                }
              },
              garden: {
                label: 'حديقة داخلية',
                hint: 'شلال ومنطقة نباتية',
                title: 'حديقة داخلية',
                subtitle: 'هدوء نباتي يبطئ الإحساس بالوقت.',
                description:
                  'حديقة مصغرة مُدارة مناخيًا مع أصوات مياه محيطية. توفر مساحة هادئة للوصول والاجتماعات والعودة المتأخرة.',
                meta: {
                  access: 'عام',
                  purpose: 'راحة وأجواء',
                  design: 'تحكم صوتي وإضاءة'
                }
              },
              retail: {
                label: 'محلات بوتيك',
                hint: 'ممر تسوق فاخر',
                title: 'محلات بوتيك',
                subtitle: 'فخامة مختارة مع خدمة متكتمة.',
                description:
                  'ممر تسوق هادئ يضم علامات مميزة وهدايا مختارة. تتوفر مساعدة الموظفين دون تعطيل تدفق النزلاء.',
                meta: {
                  access: 'عام',
                  availability: 'يوميًا',
                  service: 'تغليف هدايا + توفير عبر الكونسيرج'
                }
              },
              cafe: {
                label: 'مقهى وبار',
                hint: 'قهوة حرفية ومشروبات مميزة'
              }
            }
          },
          1: {
            name: 'تميّز الطهي',
            zones: {
              main: {
                label: 'المطعم الرئيسي',
                hint: 'تجربة مميزة'
              },
              vip: {
                label: 'ردهة VIP',
                hint: 'طعام خاص وساعات متأخرة',
                title: 'ردهة VIP',
                subtitle: 'طعام خاص، أجواء مضبوطة، ودخول متكتم.',
                description:
                  'تم تصميم ردهة VIP للخصوصية: مجموعات جلوس منفصلة، تحكم صوتي ممتاز، وتنسيق مباشر مع الكونسيرج والأمن عند الطلب.',
                meta: {
                  access: 'النزلاء + بالموافقة',
                  availability: 'ساعات متأخرة',
                  service: 'سوميلير + قوائم خاصة'
                }
              },
              cafe: {
                label: 'كافيه رويال',
                hint: 'مقهى طوال اليوم',
                title: 'كافيه رويال',
                subtitle: 'قهوة حرفية ومعجنات وحديث هادئ.',
                description:
                  'بيئة مقهى راقية بحبوب ممتازة وملف صوتي متحكم به — مثالية للاجتماعات والقراءة والترف اليومي.',
                meta: {
                  availability: 'مفهوم 24/7',
                  access: 'النزلاء والعامة',
                  highlights: 'معجنات + مشروبات مميزة'
                }
              },
              breakfast: {
                label: 'قاعة الإفطار',
                hint: 'بوفيه صباحي وألا كارت',
                title: 'قاعة الإفطار',
                subtitle: 'طقس صباحي هادئ مع خيارات ممتازة.',
                description:
                  'قاعة الإفطار محسّنة للتدفق: محطات واضحة، انتظار منخفض، وتوزيع جلوس هادئ. يتم دعم التفضيلات الغذائية ببروتوكولات تحضير مخصصة.',
                meta: {
                  availability: 'ساعات الصباح',
                  access: 'النزلاء',
                  service: 'دعم المتطلبات الغذائية'
                }
              }
            }
          },
          2: {
            name: 'الفعاليات والمؤتمرات',
            zones: {
              grandHall: {
                label: 'قاعة الزفاف الكبرى',
                hint: 'قاعة احتفالات',
                title: 'قاعة الزفاف الكبرى',
                subtitle: 'قاعة رائدة لاحتفالات لا تُنسى.',
                description:
                  'تدعم القاعة ترتيبات جلوس مرنة، إعداد منصة ديناميكي، وتحكمًا ممتازًا بالإضاءة. ينسق المخططون توقيت الفعالية والضيافة وتدفق الضيوف.',
                meta: {
                  capacity: 'حتى 500',
                  availability: 'بالحجز',
                  service: 'تخطيط + ضيافة'
                }
              },
              conference: {
                label: 'مركز المؤتمرات',
                hint: 'فعاليات الشركات',
                title: 'مركز المؤتمرات',
                subtitle: 'تقنيات بمستوى تنفيذي وعزل صوتي مضبوط.',
                description:
                  'بيئة مؤتمرات قابلة للتوسع مع دعم A/V مخصص وبنية ضيافة احترافية. مناسبة للقمم والإطلاقات والجلسات المغلقة.',
                meta: {
                  capacity: 'حتى 300',
                  availability: 'بالحجز',
                  support: 'A/V + تنسيق الكونسيرج'
                }
              },
              meetings: {
                label: 'غرف الاجتماعات',
                hint: '8 غرف مرنة',
                title: 'غرف الاجتماعات',
                subtitle: 'غرف خاصة ومرنة لجلسات مركزة.',
                description:
                  'تم تصميم الغرف بإضاءة مضبوطة ومظهر بصري نظيف. يمكن تهيئة الأثاث لاجتماعات مجلس إدارة أو صفية أو جلوس مريح.',
                meta: {
                  availability: 'بالحجز',
                  capacity: '20–50 لكل غرفة',
                  layouts: 'مجلس إدارة + صفية'
                }
              },
              vipSuite: {
                label: 'جناح اجتماعات VIP',
                hint: 'خصوصية عالية',
                title: 'جناح اجتماعات VIP',
                subtitle: 'خصوصية تنفيذية مع دخول مضبوط.',
                description:
                  'جناح مخصص للجلسات السرية. يتم إدارة الدخول عبر بروتوكولات الكونسيرج والأمن. تُقدّم الخدمة بتكتم وتوقيت دقيق.',
                meta: {
                  access: 'مقيّد',
                  availability: 'بالموافقة',
                  service: 'ضيافة خاصة'
                }
              }
            }
          },
          3: {
            name: 'العافية والاستجمام',
            zones: {
              gym: {
                label: 'مركز اللياقة',
                hint: 'صالة حديثة'
              },
              spa: {
                label: 'السبا الملكي',
                hint: 'علاجات وعافية'
              },
              pool: {
                label: 'مسبح داخلي',
                hint: 'ملاذ مياه هادئ'
              },
              sauna: {
                label: 'ساونا وبخار',
                hint: 'جناح حراري',
                title: 'ساونا وبخار',
                subtitle: 'استعادة حرارية مع رطوبة وحرارة مضبوطة.',
                description:
                  'جناح حراري هادئ للتعافي بعد التمرين والاسترخاء العميق. يمكن للنزلاء حجز جلسات موجهة عبر الكونسيرج أو استقبال العافية.',
                meta: {
                  availability: 'يوميًا',
                  access: 'النزلاء',
                  use: 'تعافٍ + استرخاء'
                }
              },
              relax: {
                label: 'ردهات الاسترخاء',
                hint: 'تعافٍ هادئ',
                title: 'ردهات الاسترخاء',
                subtitle: 'إضاءة ناعمة وجلوس هادئ وتخطيط يركز على الخصوصية.',
                description:
                  'تدعم منطقة الردهة التعافي بعد العلاج والوقت الهادئ. هندسة المقاعد مضبوطة للمساحة الشخصية وتقليل الحركة المتقاطعة.',
                meta: {
                  access: 'النزلاء',
                  atmosphere: 'هدوء + ضوضاء منخفضة',
                  bestFor: 'التعافي بعد العلاج'
                }
              }
            }
          },
          4: {
            name: 'الغرف القياسية',
            zones: {
              wingA: {
                label: 'الجناح A (401–420)',
                hint: 'مجموعة غرف مفردة'
              },
              wingB: {
                label: 'الجناح B (421–445)',
                hint: 'مجموعة غرف مزدوجة'
              },
              wingC: {
                label: 'الجناح C (446–465)',
                hint: 'مجموعة غرف توأم'
              },
              serviceCore: {
                label: 'نواة الخدمة',
                hint: 'دخول التدبير المنزلي',
                title: 'نواة الخدمة',
                subtitle: 'دخول تشغيلي مصمم ليبقى غير مرئي للنزلاء.',
                description:
                  'تمكّن نواة الخدمة تسليم المفروشات واستجابة الصيانة وخدمة الغرف بهدوء. إنها مسار مقيّد يدعم هدوء النزيل المتميز.',
                meta: {
                  access: 'مقيّد',
                  purpose: 'تدفق العمليات',
                  design: 'لوجستيات صامتة'
                }
              },
              elevators: {
                label: 'مصاعد النزلاء',
                hint: 'دخول رأسي'
              }
            }
          },
          5: {
            name: 'غرف ديلوكس',
            zones: {
              city: {
                label: 'ديلوكس بإطلالة المدينة',
                hint: 'أفق بانورامي'
              },
              garden: {
                label: 'ديلوكس بإطلالة الحديقة',
                hint: 'شرفات وهدوء'
              },
              lounge: {
                label: 'ردهة ضيوف VIP',
                hint: 'ضيافة هادئة',
                title: 'ردهة ضيوف VIP',
                subtitle: 'ردهة هادئة لنزلاء فئة الديلوكس.',
                description:
                  'ضيافة ومقاعد هادئة وتوجيه عبر الكونسيرج ضمن بيئة مضبوطة. مناسبة لاجتماعات قصيرة وتهدئة المساء.',
                meta: {
                  access: 'نزلاء مؤهلون',
                  availability: 'يوميًا',
                  service: 'توجيه الكونسيرج'
                }
              },
              core: {
                label: 'نواة المصاعد',
                hint: 'ربط الردهة'
              }
            }
          },
          6: {
            name: 'غرف بريميوم',
            zones: {
              premium: {
                label: 'غرف بريميوم',
                hint: 'منطقة معيشة + شرفة'
              },
              family: {
                label: 'بريميوم عائلية',
                hint: 'غرفتا نوم'
              },
              concierge: {
                label: 'نقطة كونسيرج العائلة',
                hint: 'مساعدة بأولوية'
              },
              core: {
                label: 'نواة المصاعد',
                hint: 'ربط الردهة'
              }
            }
          },
          7: {
            name: 'أجنحة فاخرة',
            zones: {
              exec: {
                label: 'أجنحة تنفيذية',
                hint: 'مكتب + غرفة اجتماعات'
              },
              luxury: {
                label: 'أجنحة فاخرة',
                hint: 'معيشة + طعام'
              },
              royal: {
                label: 'أجنحة ملكية',
                hint: 'جاكوزي + مطبخ خاص'
              },
              butler: {
                label: 'نقطة خدمة البتلر',
                hint: 'خدمة شخصية'
              }
            }
          },
          8: {
            name: 'الطابق الرئاسي',
            zones: {
              suite: {
                label: 'الجناح الرئاسي',
                hint: 'إقامة حصرية'
              },
              pool: {
                label: 'مسبح داخلي خاص',
                hint: 'خصوصية بتحكم مناخي',
                title: 'مسبح داخلي خاص',
                subtitle: 'مسبح معزول مصمم لخصوصية مطلقة.',
                description:
                  'لا يمكن الوصول إلى هذا المسبح إلا عبر الممر الرئاسي. تُدار الخدمة عبر فريق مخصص لحماية الخصوصية والحفاظ على أجواء هادئة.',
                meta: {
                  access: 'مقيّد',
                  availability: 'بحسب دخول الجناح',
                  service: 'فريق مخصص'
                }
              },
              cinema: {
                label: 'سينما خاصة',
                hint: 'مسرح حديث',
                title: 'سينما خاصة',
                subtitle: 'مسرح خاص بصوت ومقاعد مضبوطة.',
                description:
                  'مسرح صغير مصمم لخصوصية رئاسية. يمكن تنسيق المحتوى والجدولة عبر الكونسيرج.',
                meta: {
                  access: 'مقيّد',
                  availability: 'بحسب دخول الجناح',
                  service: 'جدولة عبر الكونسيرج'
                }
              },
              office: {
                label: 'مكتب تنفيذي',
                hint: 'مرافق أعمال',
                title: 'مكتب تنفيذي',
                subtitle: 'بيئة أعمال خاصة مع دخول مضبوط.',
                description:
                  'مساحة عمل بمستوى تنفيذي لاجتماعات آمنة وسير عمل سري. يتوفر الدعم عبر الخدمات المميزة.',
                meta: {
                  access: 'مقيّد',
                  availability: 'بحسب دخول الجناح',
                  support: 'الخدمات المميزة'
                }
              }
            }
          },
          9: {
            name: 'سكن الموظفين',
            zones: {
              accommodation: {
                label: 'سكن الموظفين',
                hint: 'أماكن إقامة',
                title: 'سكن الموظفين',
                subtitle: 'إقامة هادئة تدعم التميز التشغيلي.',
                description:
                  'طابق إقامة مخصص للموظفين لضمان استجابة سريعة وعمليات مستقرة. المناطق منفصلة عن مسارات النزلاء وتدار بتحكم دخول.',
                meta: {
                  access: 'مقيّد',
                  purpose: 'جاهزية تشغيلية',
                  separation: 'مسارات النزلاء معزولة'
                }
              },
              dining: {
                label: 'قاعة طعام الموظفين',
                hint: 'ثلاث وجبات',
                title: 'قاعة طعام الموظفين',
                subtitle: 'وجبات صحية مجدولة لورديات التشغيل.',
                description:
                  'تدعم هذه المنشأة رفاه الموظفين بخدمة وجبات منظمة عبر الورديات. البيئة فعّالة ونظيفة ومحسنة لسرعة الاستيعاب.',
                meta: {
                  access: 'مقيّد',
                  meals: 'جدول يومي',
                  purpose: 'رفاه الموظفين'
                }
              },
              training: {
                label: 'مركز التدريب',
                hint: 'تطوير مهني',
                title: 'مركز التدريب',
                subtitle: 'تدريب تشغيلي وتعزيز المعايير.',
                description:
                  'يعزز التدريب معايير الضيافة وروتين السلامة واتساق الخدمة، مما يدعم نتائج مميزة عبر الفندق بالكامل.',
                meta: {
                  access: 'مقيّد',
                  purpose: 'معايير + سلامة',
                  impact: 'جودة تجربة النزيل'
                }
              },
              recreation: {
                label: 'الاستجمام والعافية',
                hint: 'تعافي الموظفين',
                title: 'الاستجمام والعافية',
                subtitle: 'مساحات تعافٍ تدعم خدمة ممتازة.',
                description:
                  'تدعم مساحات التعافي أداءً متسقًا ورفاهًا. التخطيط بسيط ومضبوط ومنفصل عن الممرات التشغيلية.',
                meta: {
                  access: 'مقيّد',
                  purpose: 'تعافي',
                  design: 'هادئ وعملي'
                }
              }
            }
          },
          10: {
            name: 'مستوى المهبط',
            zones: {
              helipad: {
                label: 'المهبط الرئيسي',
                hint: 'وصول تنفيذي',
                title: 'المهبط الرئيسي',
                subtitle: 'منشأة وصول مضبوطة للضيوف المميزين.',
                description:
                  'تُنسق العمليات عبر الأمن وطاقم الطيران. تُدار حركة الضيوف إلى استقبال VIP وممرات مصاعد خاصة لتقليل الظهور.',
                meta: {
                  access: 'مقيّد',
                  availability: 'بالموافقة',
                  flow: 'استقبال VIP + مصاعد خاصة'
                }
              },
              vipReception: {
                label: 'استقبال VIP',
                hint: 'ردهة وصول خاصة',
                title: 'استقبال VIP',
                subtitle: 'ردهة متكتمة لوصول الطيران.',
                description:
                  'منطقة وصول هادئة بدعم الكونسيرج وتوجيه الأمن. مصممة لانتقال فوري إلى الفندق دون تعرض عام.',
                meta: {
                  access: 'مقيّد',
                  service: 'كونسيرج + مرافقة',
                  transfer: 'ممر مصعد خاص'
                }
              },
              control: {
                label: 'مراقبة الهبوط',
                hint: 'ملاحة وتنسيق',
                title: 'مراقبة الهبوط',
                subtitle: 'أنظمة الملاحة وتنسيق العمليات.',
                description:
                  'يدير مركز التحكم فحوصات الطقس وبروتوكولات الاقتراب وتوقيت الوصول الآمن. دخول النزلاء مقيّد للسلامة والأمن.',
                meta: {
                  access: 'مقيّد',
                  purpose: 'سلامة + تنسيق',
                  availability: 'جاهزية 24/7'
                }
              },
              security: {
                label: 'مركز الأمن',
                hint: 'مراقبة واستجابة',
                title: 'مركز الأمن',
                subtitle: 'مراقبة متقدمة لوصول التنفيذيين.',
                description:
                  'ينسق أفراد الأمن مسارات المرافقة ومراقبة المحيط والاستجابة للحوادث. التخطيط يعطي الأولوية للسرعة والسرية.',
                meta: {
                  access: 'مقيّد',
                  coverage: 'أنظمة مراقبة',
                  service: 'تنسيق المرافقة'
                }
              }
            }
          },
          11: {
            name: 'حديقة السماء والمسبح اللامتناهي',
            zones: {
              pool: {
                label: 'مسبح لا متناهي',
                hint: 'سباحة الغروب'
              },
              garden: {
                label: 'حديقة السماء',
                hint: 'سطح نباتي',
                title: 'حديقة السماء',
                subtitle: 'حديقة على السطح بإضاءة مضبوطة ومسارات هادئة.',
                description:
                  'مساحة نباتية مختارة مع جيوب جلوس ومسارات قليلة الفوضى. مصممة لهدوء الشروق وتجمعات الغروب دون ضوضاء.',
                meta: {
                  access: 'النزلاء',
                  availability: 'يوميًا',
                  experience: 'غروب + فعاليات'
                }
              },
              skybar: {
                label: 'بار ردهة السماء',
                hint: 'كوكتيلات مميزة',
                title: 'بار ردهة السماء',
                subtitle: 'بار على السطح مصمم لأمسيات أنيقة.',
                description:
                  'كوكتيلات مميزة ومجموعات جلوس هادئة وإضاءة مضبوطة. تتوفر خدمة الطاولة مع جدولة الفعاليات عبر الكونسيرج.',
                meta: {
                  access: 'النزلاء',
                  availability: 'المساء',
                  service: 'خدمة طاولة'
                }
              },
              restaurant: {
                label: 'مطعم بانوراما',
                hint: 'طعام فاخر مع إطلالات'
              }
            }
          }
        }
      },
      footer: {
        brandName: 'فندق القصر الملكي الرئاسي',
        description: 'استمتع بتجربة فاخرة لا مثيل لها. حيث تلتقي الأناقة الرئاسية مع الضيافة العصرية المتميزة.',
        copyright: 'فندق القصر الملكي الرئاسي. جميع الحقوق محفوظة.',
        sections: {
          ourHotel: 'فندقنا',
          services: 'الخدمات',
          support: 'الدعم'
        },
        links: {
          aboutUs: 'من نحن',
          floorsOverview: 'دليل الطوابق',
          roomsSuites: 'الغرف والأجنحة',
          services: 'الخدمات',
          restaurant: 'المطعم',
          spaWellness: 'السبا والصحة',
          eventHalls: 'قاعات المناسبات',
          helipadServices: 'خدمات المروحية',
          contactUs: 'اتصل بنا',
          faqs: 'الأسئلة الشائعة',
          terms: 'الشروط والأحكام',
          privacy: 'سياسة الخصوصية'
        }
      },
      floorsOverview: {
        hero: {
          title: 'استكشف طوابقنا',
          description: 'اكتشف 12 طابقاً من الفخامة الرئاسية، كل طابق مصمم بعناية لتقديم تجارب فريدة وخدمة لا مثيل لها'
        },
        floorLabel: 'الطابق',
        stats: {
          totalLevels: 'إجمالي الطوابق',
          roomsSuites: 'الغرف والأجنحة',
          serviceLevels: 'مستويات الخدمة',
          operations: 'العمليات'
        },
        floors: {
          b2: 'موقف السيارات الرئيسي',
          b1: 'الخدمات والدعم',
          f0: 'الردهة الكبرى',
          f1: 'التميز في الطهي',
          f2: 'المناسبات والمؤتمرات',
          f3: 'الصحة والترفيه',
          f4: 'الغرف العادية',
          f5: 'الغرف الفاخرة',
          f6: 'الغرف المميزة',
          f7: 'الأجنحة الفاخرة',
          f8: 'الطابق الرئاسي',
          f9: 'سكن الموظفين',
          f10: 'مهبط المروحيات',
          f11: 'حديقة السماء والمسبح'
        },
        cta: {
          title: 'هل أنت مستعد لتجربة الفخامة الرئاسية؟',
          subtitle: 'احجز إقامتك واستكشف كل طابق من الأناقة',
          bookNow: 'احجز الآن',
          viewRooms: 'عرض الغرف'
        },
        categories: { all: 'جميع الطوابق', rooms: 'الإقامات', amenities: 'المرافق', exclusive: 'حصري', services: 'الخدمات' },
        badges: { vip: 'طابق VIP', ai: 'موصى به بالذكاء الاصطناعي', floor: 'الطابق' },
        actions: { explore: 'استكشاف الطابق', viewRooms: 'عرض الغرف', bookStay: 'احجز إقامتك', browseRooms: 'تصفح جميع الغرف' },
        statsBar: { levels: 'إجمالي الطوابق', rooms: 'الغرف والأجنحة', areas: 'مناطق الخدمة', operations: 'العمليات' },
        ctaNew: { kicker: 'إقامتك تنتظرك', title: 'احجز مستوى الفخامة المثالي لك', sub: 'من 150 دولار / ليلة · أكثر من 300 غرفة وجناح · شهادة فوربس خمس نجوم' },
        heroNew: { kicker: 'فندق الفخامة الرئاسية', title: 'اكتشف كل طابق ومستوى', sub: 'من موقف السيارات تحت الأرض إلى حديقة السماء على السطح — استكشف 14 طابقاً مصمماً بعناية' },
        floors: {
          b2: { name: 'موقف السيارات تحت الأرض', description: 'موقف آمن متعدد الطوابق بـ150 مكاناً ومحطات شحن للسيارات الكهربائية وخدمة صف السيارات الكاملة', features: ['150 موقفاً', 'شحن للسيارات الكهربائية', 'خدمة صف السيارات'] },
          b1: { name: 'الخدمات والدعم', description: 'مركز التميز التشغيلي — غسيل الملابس والتخزين البارد والتدبير المنزلي والهندسة', features: ['خدمة الغسيل', 'التخزين البارد', 'الهندسة'] },
          f0: { name: 'الردهة الكبرى والاستقبال', description: 'تحفة معمارية — أسقف عالية ثلاثية وثريات كريستال وحديقة نباتية داخلية', features: ['كونسيرج 24/7', '8 محلات', 'حديقة داخلية'] },
          f1: { name: 'التميز في الطهي', description: 'أربعة مطاعم عالمية يقودها طهاة نجمة ميشلان بقوائم طعام ملهمة عالمياً', features: ['4 مطاعم', 'طاقة 480', 'أكثر من 25 طاهياً'] },
          f2: { name: 'الفعاليات والمؤتمرات', description: 'قاعات احتفالات كبرى ومرافق مؤتمرات حديثة تستوعب حتى 800 ضيف', features: ['10 مساحات للفعاليات', '800+ شخص', '2500 م²'] },
          f3: { name: 'الصحة والترفيه', description: 'واحة من الهدوء — سبا عالمي وصالة رياضية حديثة ومسبح لا متناهي', features: ['سبا 600 م²', 'صالة 400 م²', 'مسبح لا متناهي'] },
          f4: { name: 'الإقامات القياسية', description: 'غرف أنيقة مصممة لأقصى درجات الراحة مع لمسات فاخرة وإطلالات على المدينة', features: ['80 غرفة', '35-50 م²', 'إطلالات على المدينة'] },
          f5: { name: 'الغرف الفاخرة', description: 'راحة متميزة بتصميمات فسيحة وشرفات خاصة ومرافق فاخرة', features: ['60 غرفة', '60-65 م²', 'شرفة خاصة'] },
          f6: { name: 'الغرف المميزة', description: 'معيشة راقية مع أجنحة عائلية واسعة ووصول الخادم الشخصي وإطلالات بانورامية', features: ['50 غرفة', '75-90 م²', 'أجنحة عائلية'] },
          f7: { name: 'الأجنحة الفاخرة', description: 'أجنحة حصرية مع خدمة خادم شخصي مخصصة وطعام خاص وإطلالات بانورامية على المدينة', features: ['35 جناحاً', '120-200 م²', 'خادم 24/7'] },
          f8: { name: 'الطابق الرئاسي', description: 'قمة الفخامة المطلقة — مسبح خاص وغرفة سينما وقاعة طعام خاصة كاملة', features: ['جناح 500 م²', 'مسبح خاص', 'سينما خاصة'] },
          f9: { name: 'مساكن الموظفين', description: 'أماكن إقامة مميزة لفريق الضيافة العالمي مع مركز ترفيهي', features: ['80 غرفة', 'ترفيه', 'مركز تدريب'] },
          f10: { name: 'طابق مهبط المروحيات', description: 'وصول VIP على السطح — مهبطان ومقصورة حصرية وكونسيرج طيران مخصص', features: ['2 مهبط', 'مقصورة VIP', 'مكتب الطيران'] },
          f11: { name: 'حديقة السماء على السطح', description: 'إطلالات بانورامية 360 درجة مع مسبح لا متناهي وبار السماء وحدائق منسقة', features: ['مسبح 450 م²', 'حديقة 800 م²', 'إطلالات 360°'] }
        }
      },
      market: {
        hero: {
          title: 'متجر الفندق',
          subtitle: 'منتجات مميزة وعناصر حصرية لضيوفنا'
        },
        categories: {
          all: 'جميع المنتجات',
          snacks: 'وجبات خفيفة ومشروبات',
          biscuits: 'بسكويت',
          chips: 'رقائق',
          drinks: 'مشروبات',
          candy: 'حلويات',
          toiletries: 'مستلزمات العناية',
          souvenirs: 'هدايا تذكارية',
          luxury: 'منتجات فاخرة'
        },
        loading: 'جاري تحميل المنتجات...',
        empty: 'لا توجد منتجات متاحة في هذه الفئة.',
        product: {
          addToCart: 'أضف للسلة',
          outOfStock: 'نفذ من المخزون',
          inStock: 'متوفر'
        },
        cart: {
          title: 'سلة التسوق',
          empty: 'سلتك فارغة',
          total: 'المجموع',
          checkout: 'إتمام الطلب',
          remove: 'إزالة',
          clientName: 'اسمك',
          roomNumber: 'رقم الغرفة',
          notes: 'ملاحظات خاصة',
          placeOrder: 'تأكيد الطلب',
          orderSuccess: 'تم تقديم الطلب بنجاح!',
          orderNote: 'سيتم توصيل طلبك إلى غرفتك قريباً.'
        }
      },
      premiumServices: {
        hero: {
          title: 'الخدمات المميزة',
          subtitle: 'خدمات استثنائية ورعاية شخصية لأكثر الضيوف تميزاً'
        },
        card: {
          requestService: 'طلب الخدمة'
        },
        items: {
          medical: { name: 'دعم طبي على مدار الساعة', desc: 'أطباء تحت الطلب وخدمات طوارئ طبية' },
          butler: { name: 'خادم شخصي', desc: 'خدمة خادم مخصصة لكل احتياجاتك' },
          security: { name: 'أمن VIP', desc: 'خدمات أمن شخصي وحماية سرية' },
          maintenance: { name: 'صيانة فورية', desc: 'استجابة فورية لأي متطلبات تقنية' },
          carFleet: { name: 'أسطول سيارات فاخرة', desc: 'سيارات فاخرة مع سائقين محترفين' },
          helicopter: { name: 'خدمات الهليكوبتر', desc: 'تنقلات خاصة بالمروحية وجولات' },
          wellness: { name: 'برامج الصحة', desc: 'برامج صحية مخصصة' },
          fitnessTrainers: { name: 'مدربون شخصيون', desc: 'مدربون لياقة خبراء في خدمتك' },
          eventPlanning: { name: 'تخطيط المناسبات', desc: 'تنسيق وإدارة مناسبات شاملة' },
          businessSupport: { name: 'مركز الأعمال', desc: 'دعم أعمال تنفيذي ومرافق' }
        }
      },
      auth: {
        accessEntry: {
          title: 'من أنت؟',
          subtitle: 'اختر مسار الدخول للمتابعة.',
          footer: 'لا يتم تسجيل الدخول في هذه الصفحة.',
          roles: {
            firstTime: {
              title: 'ضيف لأول مرة',
              subtitle: 'زوار جدد',
              highlight: 'خصم 20% على الإقامة الأولى',
              cta: 'متابعة'
            },
            returning: {
              title: 'ضيف عائد',
              subtitle: 'ضيوف مخلصون',
              highlight: 'خصم ولاء دائم 10%',
              cta: 'متابعة'
            },
            staff: {
              title: 'الموظفين',
              subtitle: 'دخول العمليات',
              highlight: 'أقسام العمل والمهام',
              cta: 'تسجيل دخول الموظف'
            },
            admin: {
              title: 'المسؤول',
              subtitle: 'التحكم بالنظام',
              highlight: 'صلاحيات إدارة كاملة',
              cta: 'تسجيل دخول المسؤول'
            }
          }
        },
        guestNew: {
          title: 'ضيف لأول مرة',
          subtitle: 'أنشئ حسابك واحصل على خصم 20% على إقامتك الأولى',
          fields: {
            fullName: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            phone: 'رقم الهاتف (اختياري)',
            preferences: 'تفضيلات خاصة (اختياري)'
          },
          cta: 'متابعة',
          footer: 'مسجل بالفعل؟',
          footerLink: 'تسجيل دخول كضيف عائد',
          errors: {
            invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
            invalidPassword: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
            invalidName: 'يرجى إدخال اسمك الكامل',
            loginFailed: 'فشل التسجيل. يرجى المحاولة مرة أخرى.'
          }
        },
        guestReturning: {
          title: 'ضيف عائد',
          subtitle: 'سجل الدخول واستمتع بخصم الولاء الدائم 10%',
          fields: {
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            loyaltyId: 'رقم الولاء (اختياري)'
          },
          cta: 'تسجيل الدخول',
          footer: 'جديد هنا؟',
          footerLink: 'إنشاء حساب ضيف لأول مرة',
          errors: {
            invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
            loginFailed: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.'
          }
        },
        staff: {
          title: 'دخول الموظفين',
          subtitle: 'تسجيل دخول تشغيلي لموظفي الفندق',
          fields: {
            staffId: 'رقم الموظف',
            pin: 'الرقم السري'
          },
          cta: 'تسجيل الدخول',
          errors: {
            invalidCredentials: 'رقم موظف أو رقم سري غير صحيح',
            loginFailed: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.'
          }
        },
        admin: {
          title: 'المسؤول',
          subtitle: 'دخول لوحة التحكم المصرح بها',
          fields: {
            username: 'اسم المستخدم',
            password: 'كلمة المرور'
          },
          cta: 'دخول',
          errors: {
            invalidCredentials: 'اسم مستخدم أو كلمة مرور غير صحيحة',
            loginFailed: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.'
          }
        },
        backToSelection: 'العودة لاختيار الدور'
      }
    },
    rooms: {
      hero: { title: 'الإقامات الفاخرة', description: 'اكتشف مجموعتنا من الغرف الأنيقة، كل منها مصمم لتوفير أقصى درجات الراحة والفخامة' },
      filters: { all: 'جميع الغرف', standard: 'قياسي', deluxe: 'فاخر', premium: 'مميز' },
      types: { STANDARD: 'قياسي', SINGLE: 'مفرد', COUPLE: 'زوجي', FAMILY: 'عائلي', DELUXE: 'فاخر', JUNIOR_SUITE: 'جناح صغير', EXECUTIVE_SUITE: 'جناح تنفيذي', FAMILY_SUITE: 'جناح عائلي', PRESIDENTIAL_SUITE: 'جناح رئاسي', ROYAL_SUITE: 'جناح ملكي' },
      allFilters: { all: 'جميع الغرف', STANDARD: 'قياسي', SINGLE: 'مفرد', COUPLE: 'زوجي', FAMILY: 'عائلي', DELUXE: 'فاخر', suites: 'أجنحة' },
      status: { available: 'متاح', booked: 'محجوز حالياً', nearAvailable: 'متاح قريباً', maintenance: 'صيانة' },
      roomCard: { bookNow: 'احجز الآن', viewDetails: 'عرض التفاصيل', perNight: '/ ليلة', sqm: 'م²', guests: 'ضيوف', booked: 'محجوز', availableSoon: 'متاح قريباً' },
      page: { label: 'فندق الفخامة الرئاسية', title: 'غرفنا وأجنحتنا', found: 'تم العثور على {{count}} {{type}}', roomsType: 'غرفة', suitesType: 'جناح', loading: 'جارٍ تحميل الغرف…', empty: 'لا توجد غرف في هذه الفئة.', showAll: 'عرض الكل', floorTag: 'الطابق {{n}}', roomTitle: 'الغرفة {{n}}', prev: '→ السابق', next: 'التالي ←', bed: 'سرير', beds: 'أسرّة', bath: 'حمام', baths: 'حمامات', details: 'التفاصيل', unavailable: 'غير متاح', pricePerNight: '/ليلة', bookedMsg: 'هذه الغرفة محجوزة حالياً.', checkoutMsg: 'الخروج قريباً.', availableOn: 'متاح مرة أخرى في:', freeOn: 'متاح في:', overlayBooked: '🔴 محجوز', overlaySoon: '🟣 متاح قريباً', overlayMaintenance: '🔧 صيانة' },
      legend: { available: '● متاح', soon: '● متاح قريباً', booked: '● محجوز' },
      card: { floor: 'الطابق {{floor}}', size: '{{size}} م²', pricePerNight: '${{price}}/ليلة', viewDetails: 'عرض التفاصيل' }
    },
    home: {
      hero: { title: 'الفخامة الرئاسية', subtitle: 'نظام إدارة الفندق', description: 'حيث تلتقي الملكية بالرقي العصري', actions: { reserve: 'احجز إقامتك', exploreFloors: 'استكشف الطوابق' }, stats: { luxuryFloors: 'طوابق فاخرة', premiumRooms: 'غرف مميزة', conciergeService: 'خدمة الكونسيرج' }, scroll: 'مرر للاستكشاف' },
      features: { heading: 'تميز لا مثيل له', subheading: 'استمتع بأفضل ضيافة فاخرة', items: { elegance: { title: 'الأناقة الرئاسية', description: 'تجربة الفخامة المعرَّفة من جديد عبر 12 طابقاً مصمماً بعناية' }, concierge: { title: 'كونسيرج 24/7', description: 'خدمة عالمية في متناول يدك في أي وقت' }, helipad: { title: 'خدمات المهبط', description: 'اصل بأسلوب مع مرافق هبوط المروحيات الحصرية' }, rooftopPool: { title: 'مسبح السطح اللامتناهي', description: 'مناظر بانورامية من مسبحنا الفاخر على السطح' } } },
      suites: { heading: 'الأجنحة المميزة', subheading: 'استمتع بأفخم أماكن الإقامة', actions: { viewDetails: 'عرض التفاصيل' }, items: { presidential: { title: 'الجناح الرئاسي', floor: 'الطابق 8', size: '500 م²', features: 'مسبح خاص، سينما، قاعة طعام' }, royal: { title: 'الجناح الملكي', floor: 'الطابق 7', size: '350 م²', features: 'مرافق مميزة، إطلالات على المدينة' }, executive: { title: 'الجناح التنفيذي', floor: 'الطابق 7', size: '200 م²', features: 'مركز أعمال، وصول للردهة' } } },
      experience: { heading: 'التجربة الرئاسية', paragraphs: { 0: 'انغمس في عالم يعكس كل تفصيلة فيه المكانة والرقي.', 1: 'تضم تحفتنا المعمارية كل شيء من المطاعم الحائزة على نجمة ميشلان إلى خدمات المروحيات الخاصة.' }, actions: { exploreAllFloors: 'استكشاف جميع الطوابق' } },
      cta: { heading: 'ابدأ رحلتك الرئاسية', subheading: 'احجز تجربتك الاستثنائية اليوم', actions: { bookNow: 'احجز الآن', viewServices: 'عرض الخدمات' } },
      heroNew: { kicker: 'فندق الفخامة الرئاسية', title: 'استمتع بالفخامة الرئاسية', subtitle: 'حيث تبدأ الأناقة لحظة وصولك', stats: { rooms: 'غرف فاخرة', floors: 'طوابق مميزة', rating: 'تقييم فوربس', concierge: 'خدمة الكونسيرج' }, actions: { exploreRooms: 'استكشاف الغرف', bookNow: 'احجز الآن' }, scroll: 'مرر' },
      about: { kicker: 'قصتنا', title: 'قرن من التميز المطلق', para1: 'على مدى أكثر من قرن، كان فندق الفخامة الرئاسية منارة للرقي والأناقة.', para2: 'من أجنحة البنتهاوس الشهيرة إلى مطعمنا الحائز على جوائز وسباتنا العالمي.', pillars: { heritage: 'الإرث', excellence: 'التميز', discretion: 'التكتم', craft: 'الحرفية' }, since: 'منذ', action: 'اكتشف قصتنا' },
      rooms: { kicker: 'إقاماتنا', title: 'مساحات مُختارة بعناية فائقة للراحة', viewAll: 'عرض جميع 60 غرفة وجناحاً', perNight: '/ ليلة', viewDetails: 'عرض التفاصيل', bookNow: 'احجز الآن', badges: { mostExclusive: 'الأكثر تميزاً', mostPopular: 'الأكثر شعبية' }, featured: { r1: { name: 'الجناح الملكي', type: 'جناح ملكي', floor: 'الطابق 11', size: '420 م²', features: ['مسبح خاص', 'خدمة الغرف 24/7', 'إطلالات بانورامية', 'وصول للمهبط'] }, r2: { name: 'الجناح الرئاسي', type: 'جناح رئاسي', floor: 'الطابق 10', size: '320 م²', features: ['جاكوزي خاص', 'غرفة معيشة كاملة', 'تراس خاص', 'خدمة الكونسيرج'] }, r3: { name: 'ديلوكس التنفيذي', type: 'ديلوكس', floor: 'الطابق 5', size: '65 م²', features: ['أفق المدينة', 'سرير كينج', 'حمام رخامي', 'بار نسبريسو'] } } },
      services: { kicker: 'خدمات الفندق', title: 'كل تفصيلة، مُصممة من أجلك', explore: 'استكشف ←', items: { spa: { name: 'سبا فاخر', desc: 'علاجات عالمية وحمام مغربي ورحلات عافية' }, dining: { name: 'طعام راقٍ', desc: 'مطبخ نجمة ميشلان بقوائم ملهمة عالمياً' }, pool: { name: 'مسبح لا متناهٍ', desc: 'واحة على السطح بإطلالات بانورامية' }, gym: { name: 'مركز اللياقة', desc: 'معدات حديثة ومدربون شخصيون' }, butler: { name: 'خدمة الخادم الشخصي', desc: 'مساعد شخصي مخصص على مدار الساعة' }, driver: { name: 'نقل المطار', desc: 'ليموزين خاصة، أي وجهة، في أي وقت' } } },
      lifestyle: { kicker: 'التجربة', title: 'مصمم لكل فصول حياتك', explore: 'استكشف ←', items: { romantic: { title: 'الهروب الرومانسي', desc: 'بيئات حميمة وأمسيات بالشموع' }, family: { title: 'عطلات العائلة', desc: 'أجنحة فسيحة ورعاية مخصصة للعائلات' }, business: { title: 'النخبة في الأعمال', desc: 'مقاهي تنفيذية واتصالية لا تشوبها شائبة' }, vip: { title: 'أسلوب حياة VIP', desc: 'فخامة غير محدودة وخصوصية مطلقة' } } },
      testimonials: { kicker: 'قصص الضيوف', title: 'كلمات من ضيوفنا المتميزين', items: { t1: { quote: 'الجناح الرئاسي تجاوز كل التوقعات. خدمة الخادم الشخصي كانت لا تشوبها شائبة.', name: 'Jonathan M.', role: 'رجل أعمال' }, t2: { quote: 'شهر العسل كان مثالياً تماماً. لحظات لا تُنسى.', name: 'Sarah & James L.', role: 'عروسان' }, t3: { quote: 'السفر مع ثلاثة أطفال لم يكن أبداً بهذه السهولة.', name: 'عائلة الراشد', role: 'إقامة عائلية' }, t4: { quote: 'كمسافر تجاري متكرر، هذا الفندق يتميز بشكل استثنائي.', name: 'Chloé Dubois', role: 'ضيف الشركات' } } },
      ctaNew: { kicker: 'رحلتك تنتظرك', title: 'احجز إقامتك المثالية اليوم', sub: 'من 150 دولار / ليلة · 60 غرفة وجناحاً · شهادة فوربس خمس نجوم', bookNow: 'احجز الآن', contactUs: 'اتصل بنا' },
      awards: ['دليل فوربس للسفر ★★★★★', 'اختيار قارئي كوندي ناست', 'أفضل 100 فندق في العالم', 'جائزة ديزاين ديجست المعمارية', 'AAA خمسة ألماس', 'الفنادق الرائدة في العالم']
    },
    services: { hero: { title: 'الخدمات المميزة', subtitle: 'مرافق استثنائية وخدمة شخصية' }, items: { dining: { name: 'طعام راقٍ', desc: 'مطاعم عالمية' }, spa: { name: 'سبا والعافية', desc: 'علاجات فاخرة' }, gym: { name: 'مركز اللياقة', desc: 'وصول 24/7' }, pool: { name: 'مسبح لا متناهٍ', desc: 'جنة على السطح' }, chauffeur: { name: 'خدمة السائق', desc: 'نقل خاص' }, concierge: { name: 'الكونسيرج', desc: 'مساعدة 24/7' }, store: { name: 'متجر الفندق', desc: 'منتجات ومقتنيات فاخرة' } } },
    about: {
      hero: { title: 'عن PLHMS', subtitle: 'نظام إدارة الفندق الرئاسي الفاخر' },
      story: { title: 'قصتنا', body: 'يمثل PLHMS قمة إدارة الضيافة الفاخرة، حيث يجمع بين التكنولوجيا المتطورة والأناقة الخالدة. يوفر فندقنا المكون من 11 طابقاً تجربة لا مثيل لها للضيوف المتميزين من جميع أنحاء العالم.' },
      facilities: { title: 'مرافقنا', rooms: { title: 'أكثر من 300 غرفة فاخرة', desc: 'من الغرف القياسية إلى الأجنحة الرئاسية' }, dining: { title: 'المطاعم الحائزة على نجمة ميشلان', desc: 'مطاعم وحانات عالمية' }, spa: { title: 'السبا والعافية', desc: 'مرافق عافية واسترخاء شاملة' }, helipad: { title: 'خدمات المهبط', desc: 'نقل بالمروحية الخاصة' } },
      commitment: { title: 'التزامنا', body: 'نلتزم بتقديم خدمة استثنائية وخلق تجارب لا تُنسى لكل ضيف. يعمل فريقنا من المحترفين المتفانين على مدار الساعة.' }
    },
    contact: {
      hero: { title: 'اتصل بنا', subtitle: 'نحن هنا للمساعدة والإجابة على أي أسئلة لديك' },
      info: { title: 'تواصل معنا', phone: 'الهاتف', email: 'البريد الإلكتروني', address: 'العنوان', hours: 'ساعات العمل', phoneValue: '+1 (555) 123-4567', addressValue: 'شارع الرئاسة، حي الفخامة', hoursValue: '24/7 - نحن دائماً هنا من أجلك' },
      form: { title: 'أرسل لنا رسالة', name: 'الاسم', email: 'البريد الإلكتروني', phone: 'الهاتف', subject: 'الموضوع', message: 'الرسالة', submit: 'إرسال الرسالة' },
      success: 'شكراً لك! سنرد عليك قريباً.'
    },
    faqs: {
      hero: { title: 'الأسئلة الشائعة', subtitle: 'ابحث عن إجابات للأسئلة الشائعة حول فندقنا' },
      q1: { question: 'ما هي أوقات تسجيل الوصول والمغادرة؟', answer: 'تسجيل الوصول في الساعة 3:00 مساءً وتسجيل المغادرة في الساعة 12:00 ظهراً. الوصول المبكر والمغادرة المتأخرة متاحان بناءً على الطلب وحسب التوفر.' },
      q2: { question: 'هل تقدمون خدمة نقل من المطار؟', answer: 'نعم، نقدم خدمة حافلة مجانية من وإلى المطار. كما تتوفر خدمات الهليكوبتر لضيوف VIP.' },
      q3: { question: 'هل يتوفر موقف للسيارات؟', answer: 'نعم، لدينا خيارا صف السيارات والوقوف الذاتي. الوقوف مجاني لضيوف الفندق.' },
      q4: { question: 'ما هي خيارات تناول الطعام المتاحة؟', answer: 'لدينا خيارات متعددة بما في ذلك مطعم حائز على نجمة ميشلان وطعام غير رسمي وخدمة غرف 24/7 وبار على السطح.' },
      q5: { question: 'هل لديكم مرافق سبا وعافية؟', answer: 'نعم، مركز السبا والعافية الفاخر موجود في الطابق 9، ويقدم مجموعة كاملة من العلاجات.' },
      q6: { question: 'هل يمكنني إلغاء أو تعديل حجزي؟', answer: 'يُقبل الإلغاء والتعديل حتى 48 ساعة قبل تسجيل الوصول. يرجى التواصل مع فريق الحجوزات للمساعدة.' },
      q7: { question: 'هل الحيوانات الأليفة مسموح بها؟', answer: 'نعم، نرحب بالحيوانات الأليفة. يرجى إبلاغنا مسبقاً. قد تُطبق رسوم إضافية.' },
      q8: { question: 'ما هي سياسات الخصم للضيوف؟', answer: 'يحصل الضيوف لأول مرة على خصم 20%، ويحصل الضيوف العائدون على خصم 10% على جميع الحجوزات.' },
      contact: { title: 'هل لا تزال لديك أسئلة؟', subtitle: 'فريقنا هنا لمساعدتك على مدار الساعة' }
    },
    servicesIndex: {
      hero: { title: '✨ خدمات الفندق', subtitle: 'استمتع بالفخامة مع خدماتنا المميزة' },
      explore: 'استكشف ←',
      services: {
        restaurant: { name: 'المطعم والمطبخ', description: 'تجربة طعام راقية مع مطبخ نجمة ميشلان', features: ['مطبخ راقٍ', 'طعام خاص', 'قبو نبيذ', 'خدمة غرف 24/7'], price: 'الأسعار تبدأ حسب الطلب' },
        market: { name: 'متجر الفندق', description: 'وجبات خفيفة ومشروبات ومستلزمات مميزة تُوصل إلى غرفتك', features: ['منتجات طازجة', 'توصيل للغرفة', 'تشكيلة دولية', 'مفتوح 24/7'], price: 'متنوعة' },
        spa: { name: 'السبا والعافية', description: 'انغمس في الاسترخاء التام مع علاجات السبا الفاخرة', features: ['تدليك سويدي', 'أنسجة عميقة', 'علاج الحجر الساخن', 'العلاج بالروائح'], price: 'من 150 دولار' },
        gym: { name: 'مركز اللياقة البدنية', description: 'معدات متطورة وخدمات تدريب شخصية', features: ['معدات حديثة', 'مدربون شخصيون', 'وصول 24/7', 'حصص لياقة'], price: 'من 50 دولار/يوم' },
        pool: { name: 'المسبح والرياضات المائية', description: 'مسابح لا متناهية شفافة بإطلالات بانورامية رائعة', features: ['مسبح لا متناهٍ', 'أجنحة مسبح خاصة', 'دروس سباحة', 'خدمة على حافة المسبح'], price: 'من 40 دولار/ساعة' },
        driver: { name: 'سائق خاص', description: 'خدمة سائق احترافية مع سيارات فاخرة', features: ['نقل من/إلى المطار', 'جولات المدينة', 'سيارات فاخرة', 'سائقون متعددو اللغات'], price: 'من 100 دولار' },
        butler: { name: 'خادم شخصي', description: 'مساعدة شخصية مخصصة لكل احتياجاتك', features: ['توفر 24/7', 'تسوق شخصي', 'تخطيط الفعاليات', 'كونسيرج VIP'], price: 'من 200 دولار' }
      }
    },
    spa: {
      hero: { title: '💆 السبا والتدليك', subtitle: 'انغمس في الاسترخاء والتجديد التام' },
      steps: { 1: 'اختيار الخدمة', 2: 'تفضيلاتك', 3: 'تفاصيلك' },
      step1: { title: 'اختر علاجك', sessionType: 'نوع الجلسة', duration: 'المدة', location: 'الموقع', date: 'التاريخ المفضل', time: 'الوقت المفضل', selectTime: 'اختر الوقت', estimatedTotal: 'الإجمالي التقديري:' },
      step2: { title: 'تفضيلاتك', desc: 'ساعدنا في تخصيص تجربتك', experienceQuestion: 'هل لديك تجربة سابقة في التدليك؟', experience: 'تجربة السبا', experienceYes: 'نعم', experienceNo: 'لا، أول مرة', goal: 'هدف الجلسة', goalPlaceholder: 'مثل: استرخاء وتخفيف التوتر', goalOptions: ['استرخاء', 'تخفيف الألم', 'إعادة التأهيل', 'نوم أفضل', 'تخفيف التوتر'], focusAreas: 'مناطق التركيز (اختر جميع ما ينطبق)', medicalIssues: 'اعتبارات طبية', pressure: 'تفضيل الضغط', pressureLight: 'خفيف جداً', pressureSoft: 'خفيف', pressureMedium: 'متوسط', pressureFirm: 'قوي', pressureDeep: 'عميق', therapist: 'تفضيل المعالج', therapistMale: 'ذكر', therapistFemale: 'أنثى', therapistNoPreference: 'لا تفضيل', style: 'أجواء الجلسة', styleSilent: 'هادئ', styleMusic: 'موسيقى هادئة', styleNature: 'أصوات الطبيعة' },
      step3: { title: 'تفاصيلك', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', notes: 'ملاحظات إضافية', yourRoom: 'غرفتك', autoLinked: 'مرتبطة تلقائياً', bookingSummary: 'ملخص الحجز', service: 'الخدمة:', duration: 'المدة:', location: 'الموقع:', dateTime: 'التاريخ والوقت:', total: 'المجموع:', at: 'في' },
      sessionTypes: { relaxation: { label: 'تدليك استرخاء', desc: 'حركات لطيفة لتخفيف التوتر' }, deep_tissue: { label: 'أنسجة عميقة', desc: 'ضغط شديد لإرخاء العضلات' }, hot_stone: { label: 'علاج الحجر الساخن', desc: 'أحجار مُسخّنة للاسترخاء العميق' }, aromatherapy: { label: 'العلاج بالروائح', desc: 'زيوت عطرية للعقل والجسم' }, couples: { label: 'تدليك الأزواج', desc: 'تجربة رومانسية للاثنين' } },
      durations: { '30min': '30 دقيقة', '60min': '60 دقيقة', '90min': '90 دقيقة', '120min': '120 دقيقة' },
      locations: { spa_room: 'غرفة علاج السبا', private_suite: 'الجناح الخاص الفاخر', in_room: 'خدمة في الغرفة' },
      focusAreas: ['الرقبة', 'الكتفان', 'الظهر العلوي', 'الظهر السفلي', 'الساقان', 'القدمان', 'الذراعان', 'الجسم كله'],
      medicalIssues: ['لا شيء', 'إصابة سابقة', 'ألم مزمن', 'حساسية الجلد', 'الحمل', 'أمراض القلب', 'أخرى'],
      success: { title: 'تم تأكيد الحجز!', service: 'الخدمة', serviceValue: 'السبا والتدليك', type: 'النوع', date: 'التاريخ', time: 'الوقت', duration: 'المدة', total: 'المجموع', confirmation: 'تم إرسال بريد تأكيد إلى', backToServices: 'العودة للخدمات' },
      from: 'من $', next: 'التالي ←', back: '→ رجوع', confirm: 'تأكيد الحجز', processing: 'جارٍ المعالجة…', price: 'السعر التقديري', continue: 'متابعة ←'
    },
    gym: {
      hero: { title: '💪 مركز اللياقة البدنية', subtitle: 'معدات متطورة وتدريب شخصي' },
      steps: { 1: 'اختيار الباقة', 2: 'ملفك الشخصي', 3: 'تفاصيلك' },
      step1: { title: 'اختر باقتك', duration: 'المدة', trainer: 'مدرب شخصي', trainerYes: 'نعم (+80 دولار/يوم)', trainerNo: 'لا', date: 'تاريخ البدء', hours: 'الساعات اليومية', hoursPlaceholder: 'مثل: 2', estimatedTotal: 'الإجمالي التقديري:' },
      step2: { title: 'ملفك الرياضي', desc: 'أخبرنا عن خلفيتك الرياضية', goal: 'هدف التدريب', goalOptions: ['إنقاص الدهون', 'زيادة الوزن', 'بناء العضلات', 'اللياقة العامة', 'القوة', 'التحمل'], goalPlaceholder: 'مثل: إنقاص الوزن', age: 'العمر', height: 'الطول (سم)', weight: 'الوزن (كجم)', weeklyHours: 'ساعات التدريب الأسبوعية', weeklyOptions: ['0–2 ساعة', '2–5 ساعات', '5–10 ساعات', '10+ ساعات'], experience: 'مستوى الخبرة', experienceBeginner: 'مبتدئ', experienceIntermediate: 'متوسط', experienceAdvanced: 'متقدم', experienceProfessional: 'محترف', injuries: 'إصابات سابقة (اختر جميع ما ينطبق)', preferredTime: 'وقت التدريب المفضل', timeMorning: 'صباحاً (6–10 ص)', timeMidday: 'الظهيرة (10 ص–2 م)', timeAfternoon: 'بعد الظهر (2–6 م)', timeEvening: 'مساءً (6–10 م)' },
      step3: { title: 'بيانات الاتصال', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', room: 'رقم الغرفة', notes: 'طلبات خاصة', bookingSummary: 'ملخص الحجز', package: 'الباقة:', trainer: 'المدرب:', total: 'المجموع:', dateLabel: 'تاريخ البدء:' },
      dayOptions: { '1': 'يوم واحد', '3': '3 أيام', '7': 'أسبوع واحد', '14': 'أسبوعان', '30': 'شهر واحد' },
      injuries: ['لا شيء', 'الظهر', 'الركبة', 'الكتف', 'الكاحل', 'المعصم', 'الرقبة', 'الورك'],
      success: { title: 'تم تأكيد الحجز!', backToServices: 'العودة للخدمات' },
      next: 'التالي ←', back: '→ رجوع', confirm: 'تأكيد الحجز', processing: 'جارٍ المعالجة…', price: 'السعر التقديري', continue: 'متابعة ←'
    },
    pool: {
      hero: { title: '🏊 المسبح والرياضات المائية', subtitle: 'انغمس في الفخامة الشفافة' },
      steps: { 1: 'اختيار الباقة', 2: 'تفضيلاتك', 3: 'تفاصيلك' },
      step1: { title: 'اختر تجربة المسبح', poolType: 'نوع المسبح', duration: 'المدة', coach: 'مدرب سباحة', coachYes: 'نعم (+60 دولار)', coachNo: 'لا', date: 'التاريخ', time: 'الوقت', people: 'عدد الأشخاص', estimatedTotal: 'الإجمالي التقديري:' },
      step2: { title: 'تفضيلاتك', desc: 'ساعدنا في تخصيص تجربة المسبح لك', ability: 'مستوى السباحة', abilityBeginner: 'مبتدئ', abilityIntermediate: 'متوسط', abilityAdvanced: 'متقدم', goal: 'هدف الجلسة', goalPlaceholder: 'مثل: استرخاء، لياقة', temperature: 'درجة حرارة الماء', tempCool: 'بارد', tempModerate: 'معتدل', tempWarm: 'دافئ', preferredTime: 'الوقت المفضل' },
      step3: { title: 'بيانات الاتصال', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', room: 'رقم الغرفة', notes: 'طلبات خاصة', bookingSummary: 'ملخص الحجز', poolType: 'نوع المسبح:', duration: 'المدة:', coach: 'المدرب:', date: 'التاريخ والوقت:', total: 'المجموع:' },
      poolTypes: { shared: { label: 'مسبح مشترك', desc: 'الوصول إلى منطقة المسبح الرئيسية' }, private: { label: 'مسبح خاص', desc: 'جناح مسبح خاص حصري' } },
      durations: { '1hour': 'ساعة واحدة', '2hours': 'ساعتان', half_day: 'نصف يوم', full_day: 'يوم كامل' },
      success: { title: 'تم تأكيد الحجز!', backToServices: 'العودة للخدمات' },
      next: 'التالي ←', back: '→ رجوع', confirm: 'تأكيد الحجز', processing: 'جارٍ المعالجة…', price: 'السعر التقديري', continue: 'متابعة ←'
    },
    butler: {
      hero: { title: '🎩 الخادم الشخصي', subtitle: 'مساعدة شخصية مخصصة لكل احتياجاتك' },
      steps: { 1: 'اختيار الخدمة', 2: 'تفضيلاتك', 3: 'تفاصيلك' },
      step1: { title: 'اختر خدمة الخادم', serviceType: 'نوع الخدمة', duration: 'المدة', language: 'اللغة المفضلة', date: 'التاريخ', time: 'الوقت', estimatedTotal: 'الإجمالي التقديري:' },
      step2: { title: 'تفضيلات الخدمة', desc: 'خصّص تجربة الخادم الشخصي لك', interaction: 'مستوى التفاعل', interactionMinimal: 'أدنى حد', interactionModerate: 'معتدل', interactionVerbose: 'تفاعل عالٍ', style: 'أسلوب الخدمة', styleFormal: 'رسمي وتقليدي', styleCasual: 'دافئ وودود', styleDiscrete: 'منفصل وفعّال', leaving: 'مغادرة الفندق', leavingYes: 'نعم، مرافقة مطلوبة', leavingNo: 'لا، داخل الفندق فقط', leavingMaybe: 'ربما / مرن', tasks: 'المهام المطلوبة (اختر جميع ما ينطبق)' },
      step3: { title: 'بيانات الاتصال', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', room: 'رقم الغرفة', notes: 'طلبات خاصة', bookingSummary: 'ملخص الحجز', service: 'الخدمة:', duration: 'المدة:', date: 'التاريخ والوقت:', total: 'المجموع:' },
      serviceTypes: { basic: { label: 'مساعدة أساسية', desc: 'مساعدة عامة وتنفيذ المهام' }, premium: { label: 'خادم مميز', desc: 'خدمة شخصية مخصصة' }, exclusive: { label: 'كونسيرج حصري', desc: 'تجربة VIP شاملة' } },
      durations: { '2hours': 'ساعتان', '4hours': '4 ساعات', half_day: 'نصف يوم', full_day: 'يوم كامل' },
      taskOptions: ['فك/حزم الأمتعة', 'تنظيم الملابس', 'حجوزات المطاعم', 'تذاكر الفعاليات', 'مساعدة في التسوق', 'مهام شخصية', 'ترتيبات السفر', 'تنسيق الاجتماعات', 'إعداد مناسبة خاصة', 'تسوق شخصي'],
      success: { title: 'تم تأكيد الحجز!', backToServices: 'العودة للخدمات' },
      next: 'التالي ←', back: '→ رجوع', confirm: 'تأكيد الحجز', processing: 'جارٍ المعالجة…', price: 'السعر التقديري', continue: 'متابعة ←'
    },
    driver: {
      hero: { title: '🚗 سائق خاص', subtitle: 'خدمة سائق احترافية مع سيارات فاخرة' },
      steps: { 1: 'اختيار الرحلة', 2: 'تفاصيل الرحلة', 3: 'تفاصيلك' },
      step1: { title: 'اختر رحلتك', tripType: 'نوع الرحلة', carType: 'المركبة', date: 'التاريخ', time: 'الوقت', duration: 'الساعات (للحجز بالساعة)', serviceType: 'مستوى الخدمة', language: 'لغة السائق', estimatedTotal: 'الإجمالي التقديري:' },
      step2: { title: 'تفاصيل الرحلة', desc: 'أخبرنا المزيد عن رحلتك', serviceLevel: 'مستوى الخدمة', serviceLevelOneWay: 'رحلة ذهاب فقط', serviceLevelRound: 'ذهاب وإياب', serviceLevelDisposal: 'طوال الوقت تحت التصرف', style: 'أسلوب السائق', styleFormal: 'رسمي ومحترف', styleFriendly: 'ودود وتحادثي', styleSilent: 'هادئ ومتحفظ', purpose: 'غرض الرحلة', purposeOptions: ['نقل المطار', 'اجتماعات العمل', 'السياحة والمشاهدة', 'التسوق', 'مناسبة خاصة', 'أخرى'], waiting: 'وقت الانتظار', waitingNone: 'لا حاجة للانتظار', waiting30min: 'حتى 30 دقيقة', waiting1hour: 'حتى ساعة واحدة', waitingFlexible: 'مرن / عند الطلب', pickup: 'موقع الاستلام', dropoff: 'موقع التسليم', pickupPlaceholder: 'مثل: بهو الفندق', dropoffPlaceholder: 'مثل: صالة المطار', hourlyLabel: 'عدد الساعات', hourlyPlaceholder: 'اختر الساعات', language: 'لغة السائق' },
      step3: { title: 'بيانات الاتصال', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', room: 'رقم الغرفة', notes: 'طلبات خاصة', bookingSummary: 'ملخص الحجز', vehicle: 'المركبة:', trip: 'نوع الرحلة:', date: 'التاريخ والوقت:', total: 'المجموع:', from: 'من:', to: 'إلى:' },
      tripTypes: { airport_transfer: { label: 'نقل المطار', desc: 'من/إلى المطار' }, city_tour: { label: 'جولة المدينة', desc: 'استكشاف المدينة بمرشد' }, full_day: { label: 'توظيف ليوم كامل', desc: 'أكثر من 8 ساعات' }, hourly: { label: 'خدمة بالساعة', desc: 'حجز بالساعة' } },
      carTypes: { sedan: { label: 'سيدان تنفيذي', desc: 'مرسيدس E-Class أو مماثل' }, suv: { label: 'سيارة دفع رباعي فاخرة', desc: 'رينج روفر أو مماثل' }, luxury: { label: 'فخامة قصوى', desc: 'مرسيدس S-Class أو مماثل' }, limousine: { label: 'ليموزين', desc: 'ليموزين ممتدة' } },
      success: { title: 'تم تأكيد الحجز!', backToServices: 'العودة للخدمات' },
      next: 'التالي ←', back: '→ رجوع', confirm: 'تأكيد الحجز', processing: 'جارٍ المعالجة…', price: 'السعر التقديري', continue: 'متابعة ←'
    },
    admin: {
      tabs: { dashboard: 'لوحة التحكم', bookings: 'الحجوزات', clients: 'العملاء', rooms: 'الغرف', store: 'المتجر', orders: 'الطلبات', services: 'الخدمات', activity: 'النشاط', settings: 'الإعدادات' },
      floors: { b2: 'البدروم 2', b1: 'البدروم 1', g: 'الطابق الأرضي', f1: 'الطابق الأول', f2: 'الطابق الثاني', f3: 'الطابق الثالث', f4: 'الطابق الرابع', f5: 'الطابق الخامس', f6: 'الطابق السادس', f7: 'الطابق السابع', f8: 'الطابق الثامن', f9: 'الطابق التاسع', f10: 'الطابق العاشر', f11: 'الطابق الحادي عشر' },
      messages: { roomAdded: 'تمت إضافة الغرفة بنجاح', roomUpdated: 'تم تحديث الغرفة بنجاح', roomDeleted: 'تم حذف الغرفة بنجاح', storeItemAdded: 'تمت إضافة المنتج بنجاح', storeItemUpdated: 'تم تحديث المنتج بنجاح', storeItemDeleted: 'تم حذف المنتج بنجاح', bookingCancelled: 'تم إلغاء الحجز بنجاح', settingsSaved: 'تم حفظ الإعدادات بنجاح', passwordChanged: 'تم تغيير كلمة المرور بنجاح' },
      confirm: { deleteRoom: 'هل أنت متأكد من حذف هذه الغرفة؟', deleteItem: 'هل أنت متأكد من حذف هذا العنصر؟', cancelBooking: 'هل أنت متأكد من إلغاء هذا الحجز؟' },
      labels: { addRoom: 'إضافة غرفة', editRoom: 'تعديل الغرفة', addProduct: 'إضافة منتج', editProduct: 'تعديل المنتج', roomNumber: 'رقم الغرفة', floor: 'الطابق', type: 'النوع', price: 'السعر / الليلة', capacity: 'السعة', status: 'الحالة', description: 'الوصف', images: 'روابط الصور', features: 'المميزات', amenities: 'المرافق', save: 'حفظ', cancel: 'إلغاء', delete: 'حذف', edit: 'تعديل', search: 'بحث', filterBy: 'تصفية حسب', allBookings: 'الكل', active: 'نشطة', completed: 'مكتملة', cancelled: 'ملغاة' }
    },
    roomDetail: {
      loading: 'جارٍ تحميل تفاصيل الغرفة...',
      notFound: 'الغرفة غير موجودة', notFoundText: 'الغرفة المطلوبة غير متوفرة.',
      backToRooms: 'العودة إلى الغرف',
      viewPhotos: '🖼️ عرض جميع الصور ({{count}})',
      noImages: 'لا توجد صور متاحة',
      description: 'الوصف', view: '🌅 الإطلالة', bed: '🛏️ السرير',
      bathroom: '🛁 الحمام', services: '✨ الخدمات المشمولة', amenities: '🎯 المرافق',
      pricePerNight: 'السعر لكل ليلة',
      upToGuests: 'حتى {{count}} ضيف', roomSize: 'مساحة الغرفة {{size}} م²',
      available: '✓ متاحة', bookNow: 'احجز الآن',
      freeCancellation: 'إلغاء مجاني حتى 24 ساعة قبل تسجيل الوصول',
      floor: 'الطابق', guests: 'ضيوف', roomTitle: 'غرفة'
    }
  },
  tr: {
    translation: {
      nav: {
        home: 'Ana Sayfa',
        floors: 'Katlar',
        rooms: 'Odalar',
        suites: 'Süitler',
        services: 'Hizmetler',
        premium: 'Premium',
        bookNow: 'Hemen Rezervasyon',
        signIn: 'Giriş',
        dashboard: 'Panel',
        myProfile: 'Profilim',
        myBookings: 'Rezervasyonlarım',
        myOrders: 'Siparişlerim',
        hotelStore: 'Otel Mağazası',
        logout: 'Çıkış Yap',
        guest: 'Misafir',
        guestRole: 'Otel Misafiri'
      },
      profile: {
        member: 'Üye',
        totalBookings: 'Toplam Rezervasyon',
        activeBookings: 'Aktif Rezervasyonlar',
        totalSpent: 'Toplam Harcama',
        loyaltyPoints: 'Sadakat Puanları',
        overview: 'Genel Bakış',
        myBookings: 'Rezervasyonlarım',
        settings: 'Ayarlar',
        welcomeBack: 'Tekrar hoş geldiniz',
        overviewDescription: 'Rezervasyonlarınızı yönetin, hizmetleri keşfedin ve konaklamanızın tadını çıkarın.',
        bookRoom: 'Oda Rezervasyonu',
        viewBookings: 'Rezervasyonları Görüntüle',
        exploreServices: 'Hizmetleri Keşfet',
        hotelStore: 'Otel Mağazası',
        recentBookings: 'Son Rezervasyonlar',
        noBookings: 'Henüz rezervasyonunuz yok.',
        makeFirstBooking: 'İlk Rezervasyonunuzu Yapın',
        room: 'Oda',
        accountSettings: 'Hesap Ayarları',
        personalInfo: 'Kişisel Bilgiler',
        email: 'E-posta',
        phone: 'Telefon',
        addPhone: 'Telefon numarası ekle',
        dangerZone: 'Tehlikeli Bölge'
      },
      bookings: {
        myBookings: 'Rezervasyonlarım',
        manageYourReservations: 'Rezervasyonlarınızı yönetin ve detayları görüntüleyin',
        all: 'Tümü',
        active: 'Aktif',
        completed: 'Tamamlandı',
        cancelled: 'İptal Edildi',
        noBookingsFound: 'Rezervasyon bulunamadı',
        startBooking: 'Odalarımızı keşfedin ve ilk rezervasyonunuzu yapın!',
        bookNow: 'Hemen Rezervasyon',
        bookingNumber: 'Rezervasyon #',
        room: 'Oda',
        floor: 'Kat',
        checkIn: 'Giriş',
        checkOut: 'Çıkış',
        nights: 'gece',
        guests: 'Misafirler',
        totalPrice: 'Toplam Fiyat',
        specialRequests: 'Özel İstekler',
        bookedOn: 'Rezervasyon tarihi',
        cancel: 'Rezervasyonu İptal Et',
        newBooking: 'Yeni Rezervasyon',
        backToProfile: 'Profile Dön'
      },
      orders: {
        myOrders: 'Siparişlerim',
        trackYourOrders: 'Oda servisi ve mağaza siparişlerinizi takip edin',
        noOrdersFound: 'Sipariş bulunamadı',
        startOrdering: 'İlk siparişinizi vermek için otel mağazasını ziyaret edin!',
        visitStore: 'Mağazayı Ziyaret Et',
        orderNumber: 'Sipariş #',
        total: 'Toplam',
        goToStore: 'Mağazaya Git',
        backToProfile: 'Profile Dön'
      },
      common: {
        loading: 'Yükleniyor...',
        error: 'Bir hata oluştu',
        save: 'Kaydet',
        cancel: 'İptal',
        delete: 'Sil',
        edit: 'Düzenle',
        view: 'Görüntüle',
        close: 'Kapat',
        confirm: 'Onayla',
        back: 'Geri',
        next: 'İleri',
        submit: 'Gönder'
      },
      dashboard: {
        guestPortal: 'Misafir Portalı',
        adminPanel: 'Yönetim Paneli',
        guestDashboard: 'Misafir Paneli',
        adminDashboard: 'Yönetici Paneli',
        welcomeBack: 'Presidential Luxury’ye tekrar hoş geldiniz',
        overview: 'Genel Bakış',
        floorManagement: 'Kat Yönetimi',
        roomManagement: 'Oda Yönetimi',
        pricingAvailability: 'Fiyatlandırma ve Uygunluk',
        staffManagement: 'Personel Yönetimi',
        analyticsReports: 'Analitik ve Raporlar',
        myReservations: 'Rezervasyonlarım',
        billing: 'Fatura ve Ödemeler',
        serviceRequests: 'Hizmet Talepleri',
        profile: 'Profil',
        bookingHistory: 'Rezervasyon Geçmişi',
        logout: 'Çıkış'
      },
      language: {
        label: 'Dil',
        en: 'EN',
        ar: 'AR',
        tr: 'TR'
      },
      auth: {
        signIn: 'Giriş Yap',
        register: 'Kayıt Ol',
        backToSelection: 'Rol seçimine dön',
        backToDepartment: 'Bölüm seçimine dön',
        staffId: 'Personel Kimliği',
        pin: 'PIN Kodu',
        invalidCredentials: 'Geçersiz Personel Kimliği veya PIN',
        invalidPin: 'PIN en az 4 rakam olmalıdır',
        success: {
          registrationTitle: 'Kayıt Başarılı!',
          registrationMessage: 'Hoş geldiniz! %20 ilk ziyaretçi indirimi ile keyif alın',
          loginTitle: 'Giriş Başarılı!',
          welcomeBack: 'Tekrar Hoş Geldiniz!',
          welcomeBackMessage: '%10 sadakat indirimi aktif',
          adminTitle: 'Yönetici Erişimi Verildi',
          adminMessage: 'Kontrol paneline hoş geldiniz',
          staffWelcome: '{{department}} bölümüne hoş geldiniz'
        },
        accessEntry: {
          title: 'Erişim Düzeyinizi Seçin',
          subtitle: 'Devam etmek için rolünüzü seçin',
          footer: 'Presidential Luxury Oteline güvenli erişim',
          roles: {
            firstTime: {
              title: 'İlk Kez Misafir',
              subtitle: 'Lüks deneyime yeni',
              highlight: '%20 İndirim',
              cta: 'Şimdi Kayıt Ol'
            },
            returning: {
              title: 'Dönen Misafir',
              subtitle: 'Mükemmelliğe tekrar hoş geldiniz',
              highlight: '%10 Sadakat',
              cta: 'Giriş Yap'
            },
            staff: {
              title: 'Personel Üyesi',
              subtitle: 'Çalışan erişim portalı',
              highlight: 'Ekip Erişimi',
              cta: 'Personel Girişi'
            },
            admin: {
              title: 'Yönetici',
              subtitle: 'Yönetim kontrol paneli',
              highlight: 'Tam Erişim',
              cta: 'Yönetici Girişi'
            }
          }
        },
        guestNew: {
          title: 'İlk Kez Misafir Kayıt',
          subtitle: 'Özel topluluğumuza katılın',
          fields: {
            fullName: 'Tam Ad',
            email: 'E-posta Adresi',
            password: 'Şifre',
            phone: 'Telefon Numarası',
            preferences: 'Özel Tercihler (Opsiyonel)'
          },
          cta: 'Giriş Yap',
          footer: 'Zaten hesabınız var mı?',
          footerLink: 'Buradan giriş yapın',
          errors: {
            invalidName: 'Lütfen geçerli bir isim girin',
            invalidEmail: 'Lütfen geçerli bir e-posta girin',
            invalidPassword: 'Şifre en az 6 karakter olmalıdır',
            loginFailed: 'Kayıt başarısız. Tekrar deneyin.'
          }
        },
        guestReturning: {
          title: 'Tekrar Hoş Geldiniz',
          subtitle: 'Hesabınıza giriş yapın',
          fields: {
            email: 'E-posta Adresi',
            password: 'Şifre',
            loyaltyId: 'Sadakat Kimliği (Opsiyonel)'
          },
          cta: 'Giriş Yap',
          footer: 'Otelimizde yeni misiniz?',
          footerLink: 'Buradan kaydın',
          errors: {
            invalidEmail: 'Lütfen geçerli bir e-posta girin',
            invalidPassword: 'Şifre gerekli',
            loginFailed: 'Giriş başarısız. Bilgilerinizi kontrol edin.'
          }
        },
        admin: {
          title: 'Yönetici Girişi',
          subtitle: 'Yönetim kontrol paneli erişimi',
          fields: {
            username: 'Yönetici Kullanıcı Adı',
            password: 'Yönetici Şifre'
          },
          cta: 'Giriş Yap',
          errors: {
            invalidUsername: 'Kullanıcı adı gerekli',
            invalidPassword: 'Şifre gerekli',
            loginFailed: 'Geçersiz yönetici bilgileri'
          }
        },
        staff: {
          title: 'Personel Girişi',
          subtitle: 'Çalışan erişim portalı',
          fields: {
            staffId: 'Personel Kimliği',
            pin: 'PIN Kodu'
          },
          cta: 'Giriş Yap'
        },
        staffRoles: {
          title: 'Bölümünüzü Seçin',
          subtitle: 'Devam etmek için personel rolünüzü seçin',
          roles: {
            cleaning: {
              title: 'Temizlik Personeli',
              department: 'Kat Hizmetleri'
            },
            maintenance: {
              title: 'Bakım Personeli',
              department: 'Teknik Hizmetler'
            },
            kitchen: {
              title: 'Mutfak Personeli',
              department: 'Mutfak'
            },
            club: {
              title: 'Kulüp Personeli',
              department: 'Eğlence'
            },
            security: {
              title: 'Güvenlik Personeli',
              department: 'Güvenlik'
            },
            nurse: {
              title: 'Tıbbi Hemşire',
              department: 'Tıbbi'
            }
          }
        }
      },
      profile: {
        title: 'Profilim',
        editProfile: 'Profili Düzenle',
        saveChanges: 'Değişiklikleri Kaydet',
        cancelEdit: 'İptal',
        defaultName: 'Kullanıcı',
        sections: {
          personalInfo: 'Kişisel Bilgiler',
          accountDetails: 'Hesap Detayları',
          privileges: 'Erişim Ayrıcalıkları',
          invoices: 'Faturalarım',
          offers: 'Aktif Tekliflerim'
        },
        fields: {
          name: 'Tam Ad',
          fullName: 'Tam Ad',
          userId: 'Kullanıcı Kimliği',
          username: 'Kullanıcı Adı',
          email: 'E-posta Adresi',
          phone: 'Telefon Numarası',
          phoneNumber: 'Telefon Numarası',
          preferences: 'Tercihler',
          specialPreferences: 'Özel Tercihler',
          role: 'Rol',
          accountType: 'Hesap Tipi',
          accountStatus: 'Hesap Durumu',
          memberId: 'Üyelik Kimliği',
          loyaltyId: 'Sadakat Kimliği',
          memberSince: 'Üye Olma Tarihi',
          activeDiscount: 'Aktif İndirim',
          staffId: 'Personel Kimliği',
          department: 'Bölüm'
        },
        status: {
          active: 'Aktif',
          inactive: 'Pasif'
        },
        roles: {
          guest: 'Misafir',
          staff: 'Personel',
          admin: 'Yönetici'
        },
        accountTypes: {
          firstTime: 'İlk Kez Misafir',
          returning: 'Dönen Misafir',
          vip: 'VIP Üye'
        },
        invoices: {
          number: 'Fatura',
          date: 'Tarih',
          status: 'Durum',
          paid: 'Ödendi',
          pending: 'Beklemede',
          total: 'Toplam Tutar',
          discount: 'İndirim',
          downloadPdf: 'PDF İndir',
          items: {
            suiteBooking: 'Suit Rezervasyonu',
            nights: 'gece',
            spaServices: 'Spa Hizmetleri',
            restaurantCharges: 'Restoran Ücretleri',
            premiumSuite: 'Premium Suit'
          }
        },
        offers: {
          validUntil: 'Geçerlilik:',
          status: 'Durum:',
          activeNow: 'Şimdi Aktif',
          claimOffer: 'Teklifi Al',
          luxurySpa: {
            title: 'Lüks Spa Paketi',
            description: 'Masaj, yüz bakımı ve vücut bakımı ile tam günlük spa deneyimi'
          },
          michelinDining: {
            title: 'Michelin Yıldızlı Yemek',
            description: 'Ödüllü restoranımızda üç tabakalı yemek'
          },
          welcomeDiscount: {
            title: 'Hoş Geldin İndirimin',
            description: 'Tüm rezervasyonlar ve hizmetlere otomatik uygulanan indirim'
          },
          loyaltyDiscount: {
            title: 'Sadakat İndirimin',
            description: 'Tüm rezervasyonlar ve hizmetlere otomatik uygulanan indirim'
          }
        },
        member: 'Altın Üye',
        totalBookings: 'Toplam Rezervasyon',
        activeBookings: 'Aktif Rezervasyon',
        totalSpent: 'Toplam Harcama',
        loyaltyPoints: 'Sadakat Puanı',
        overview: 'Genel Bakış',
        myBookings: 'Rezervasyonlarım',
        myOrders: 'Siparişlerim',
        myServices: 'Hizmetlerim',
        account: 'Hesabım',
        settings: 'Ayarlar',
        welcomeBack: 'Tekrar hoş geldiniz',
        overviewDescription: 'Rezervasyonlarınızı, siparişlerinizi ve hesabınızı tek yerden yönetin.',
        bookRoom: 'Oda Rezervasyonu',
        viewBookings: 'Rezervasyonlarım',
        exploreServices: 'Hizmetler',
        hotelStore: 'Otel Mağazası',
        recentActivity: 'Son Aktiviteler',
        recentBookings: 'Son Rezervasyonlar',
        noBookings: 'Henüz oda rezervasyonunuz yok.',
        noOrders: 'Henüz siparişiniz yok.',
        noServices: 'Henüz hizmet rezervasyonunuz yok.',
        makeFirstBooking: 'Oda Rezervasyonu Yap',
        room: 'Oda',
        accountSettings: 'Hesap Ayarları',
        personalInfo: 'Kişisel Bilgiler',
        email: 'E-posta',
        phone: 'Telefon',
        addPhone: 'Telefon numarası ekle',
        dangerZone: 'Oturum'
      },
      floors: {
        interactiveMap: 'Etkileşimli Kat Haritası',
        parkingZones: 'Park Alanları',
        amenities: 'Olanaklar',
        facilities: 'Tesisler',
        zonePrefix: 'Bölge',
        capacityLabel: 'Kapasite',
        typeLabel: 'Tür',
        slotsLabel: 'park yeri',
        unitsLabel: 'Birim Mevcut',
        roomsLabel: 'Odalar'
      },
      receptionist: {
        title: 'Misafir Konsiyerj Asistanı',
        subtitle: 'Mükemmel konaklamaya sizi yönlendirelim',
        chat: {
          welcome: 'Hoş geldiniz! Size mükemmel konaklama bulmada yardımcı olmak için buradayım. Size birkaç soru sorabilir miyim?',
          numberOfGuests: 'Kaç misafir kalacak?',
          stayType: 'Ne tür bir konaklama arıyorsunuz?',
          preferences: 'Sizin için en önemli özellikler nelerdir?',
          duration: 'Ne kadar süre kalacaksınız?',
          specialNeeds: 'Özel ihtiyaçlarınız var mı?',
          summary: 'Tercihlerinize göre önerilerimiz:',
          letsBegin: 'Başlayalım',
          next: 'İleri',
          previous: 'Geri',
          finish: 'Önerileri Görüntüle',
          reset: 'Yeniden Başla'
        },
        stayTypes: {
          luxury: 'Lüks Deneyim',
          family: 'Aile Konforu',
          business: 'İş Seyahati',
          quiet: 'Sessiz Dinlenme'
        },
        features: {
          view: 'Manzara',
          spa: 'Spa Erişimi',
          restaurant: 'Gurme Yemek',
          budget: 'Ekonomik',
          suite: 'Suit Oda',
          pool: 'Havuz Erişimi',
          gym: 'Fitness Merkezi',
          parking: 'Otopark Dahil'
        },
        duration: {
          short: '1-2 Gece',
          medium: '3-7 Gece',
          long: '7+ Gece',
          extended: 'Uzun Süreli (Aylık)'
        },
        specialNeeds: {
          children: 'Çocuklu Seyahat',
          elderly: 'Yaşlı Misafir',
          medical: 'Tıbbi Gereksinimler',
          vip: 'VIP Hizmetler',
          accessibility: 'Erişilebilirlik İhtiyaçları',
          pets: 'Evcil Hayvan Dostu'
        },
        recommendations: {
          title: 'Sizin İçin Önerilen',
          floors: 'Önerilen Katlar',
          rooms: 'Mevcut Odalar',
          services: 'Önerilen Hizmetler',
          viewMap: 'Haritada Görüntüle',
          bookNow: 'Şimdi Rezerve Et',
          learnMore: 'Daha Fazla Bilgi',
          noResults: 'Eşleşme bulunamadı. Tercihlerinizi ayarlayalım.',
          perfect: 'Mükemmel Eşleşme',
          good: 'İyi Eşleşme',
          available: 'Mevcut'
        },
        filters: {
          applying: 'Tercihleriniz uygulanıyor...',
          found: '{{count}} seçenek bulundu',
          refining: 'Sonuçlar iyileştiriliyor...'
        }
      },
      guestDashboard: {
        welcome: 'Hoş geldin, {{name}}!',
        welcomeGuest: 'Hoş geldiniz!',
        firstTimeDiscount: '%20 İlk Ziyaretçi İndirimi Aktif 🎉',
        loyaltyDiscount: '%10 Sadakat İndirimi Aktif ⭐',
        quickAccess: 'Hızlı Erişim',
        latestAnnouncements: 'Son Duyurular',
        exclusiveOffers: 'Özel Teklifler',
        actions: {
          bookRoom: 'Oda Rezervasyonu',
          diningReservation: 'Yemek Rezervasyonu',
          spaBooking: 'Spa Rezervasyonu',
          premiumServices: 'Premium Hizmetler'
        },
        announcements: {
          specialOffer: {
            title: 'Özel Hafta Sonu Teklifi',
            description: 'Bu ay hafta sonu rezervasyonlarında ek %15 indirim kazanın!'
          },
          newRestaurant: {
            title: 'Yeni Restoran Açılışı',
            description: 'Kat 1\'deki yepyeni Michelin yıldızlı restoranımızı deneyimleyin'
          },
          maintenance: {
            title: 'Havuz Bakım Bildirimi',
            description: 'Çatı havuzu 20-21 Aralık tarihlerinde bakımda olacaktır'
          }
        },
        offers: {
          spaPackage: {
            title: '%30 İNDİRİMLİ Spa Paketi',
            description: 'Lüks sağlık deneyimi',
            validUntil: '31 Aralık 2024'
          },
          dining: {
            title: '%25 İNDİRİMLİ İyi Yemek',
            description: 'Michelin yıldızlı restoran',
            validUntil: '25 Aralık 2024'
          },
          suite: {
            title: '%20 İNDİRİMLİ Suit Yükseltme',
            description: 'Premium konaklama',
            validUntil: '30 Aralık 2024'
          }
        },
        claimOffer: 'Teklifi Al',
        viewProfile: 'Profili Görüntüle'
      },
      concierge: {
        launcherTitle: 'Concierge',
        title: 'Presidential Concierge',
        subtitle: 'Kişiselleştirilmiş konaklama için zarif yönlendirme',
        restart: 'Yeniden Başlat',
        close: 'Kapat',
        inputPlaceholder: 'Yanıtınızı yazın…',
        send: 'Gönder',
        services: {
          spa: 'Spa',
          dining: 'Yemek',
          private_driver: 'Özel Şoför',
          medical_support: 'Tıbbi Destek'
        },
        messages: {
          greeting: 'İyi günler. Ben sizin Presidential Concierge’inizim.',
          intro: 'Mükemmel bir konaklama önermek için birkaç kısa soru sorabilir miyim?',
          validation: 'Lütfen seçeneklerden birini seçin veya geçerli bir yanıt girin.',
          useButtons: 'Bu adım için lütfen aşağıdaki düğmeleri kullanın.',
          noPreference: 'Tercihim yok',
          recommendationIntro: 'Tercihlerinize göre önerim:',
          room: 'Oda',
          services: 'Önerilen Hizmetler',
          experiences: 'İmza Deneyimler',
          followUp: 'Bunu daha sonra tarihler veya özel istekler için iyileştireyim mi?'
        },
        flow: {
          guests: {
            question: 'Kaç kişi konaklayacak?',
            one: '1',
            two: '2',
            three: '3',
            fourPlus: '4+'
          },
          purpose: {
            question: 'Konaklama amacınız nedir?',
            business: 'İş',
            leisure: 'Tatil',
            honeymoon: 'Balayı',
            family: 'Aile'
          },
          services: {
            question: 'Hangi hizmetlere öncelik vermek istersiniz?',
            spa: 'Spa',
            dining: 'Yemek',
            privateDriver: 'Özel Şoför',
            medicalSupport: 'Tıbbi Destek',
            done: 'Tamam'
          },
          budget: {
            question: 'Hangi bütçe seviyesini tercih edersiniz?',
            luxury: 'Lüks',
            premium: 'Premium',
            exclusive: 'Özel'
          }
        }
      },
      footer: {
        brandName: 'Presidential Royal Palace Hotel',
        description: 'Eşsiz lüks ve sofistike bir deneyim yaşayın. Başkanlık zarafetinin modern konukseverlikle buluştuğu yer.',
        copyright: 'Presidential Royal Palace Hotel. Tüm Hakları Saklıdır.',
        sections: {
          ourHotel: 'Otelimiz',
          services: 'Hizmetler',
          support: 'Destek'
        },
        links: {
          aboutUs: 'Hakkımızda',
          floorsOverview: 'Kat Rehberi',
          roomsSuites: 'Odalar ve Süitler',
          services: 'Hizmetler',
          restaurant: 'Restoran',
          spaWellness: 'Spa ve Wellness',
          eventHalls: 'Etkinlik Salonları',
          helipadServices: 'Helikopter Hizmetleri',
          contactUs: 'İletişim',
          faqs: 'SSS',
          terms: 'Şartlar ve Koşullar',
          privacy: 'Gizlilik Politikası'
        }
      },
      floorsOverview: {
        hero: {
          title: 'Katlarımızı Keşfedin',
          description: 'Her biri benzersiz deneyimler ve eşsiz hizmet sunmak için titizlikle tasarlanmış 12 katlık başkanlık lüksünü keşfedin'
        },
        floorLabel: 'Kat',
        stats: {
          totalLevels: 'Toplam Kat',
          roomsSuites: 'Oda ve Süit',
          serviceLevels: 'Hizmet Katı',
          operations: 'Operasyon'
        },
        floors: {
          b2: 'Ana Otopark',
          b1: 'Servis ve Destek',
          f0: 'Büyük Lobi',
          f1: 'Mutfak Mükemmelliği',
          f2: 'Etkinlik ve Konferans',
          f3: 'Wellness ve Rekreasyon',
          f4: 'Standart Odalar',
          f5: 'Deluxe Odalar',
          f6: 'Premium Odalar',
          f7: 'Lüks Süitler',
          f8: 'Başkanlık Katı',
          f9: 'Personel Konaklama',
          f10: 'Helikopter Pisti',
          f11: 'Gökyüzü Bahçesi ve Havuz'
        },
        cta: {
          title: 'Başkanlık Lüksünü Deneyimlemeye Hazır mısınız?',
          subtitle: 'Konaklamanızı rezerve edin ve her katın zarafetini keşfedin',
          bookNow: 'Hemen Rezervasyon',
          viewRooms: 'Odaları Gör'
        },
        categories: { all: 'Tüm Katlar', rooms: 'Konaklama', amenities: 'Tesisler', exclusive: 'Özel', services: 'Hizmetler' },
        badges: { vip: 'VIP Kat', ai: 'Yapay Zeka Önerisi', floor: 'KAT' },
        actions: { explore: 'Katı Keşfet', viewRooms: 'Odaları Gör', bookStay: 'Konaklamayı Rezerve Et', browseRooms: 'Tüm Odaları Gözat' },
        statsBar: { levels: 'Toplam Kat', rooms: 'Oda ve Süit', areas: 'Hizmet Alanları', operations: 'Operasyonlar' },
        ctaNew: { kicker: 'Konaklamanız Sizi Bekliyor', title: 'Mükemmel Lüks Seviyenizi Rezerve Edin', sub: '150 dolardan / gece · 300+ oda ve süit · Forbes Beş Yıldız Sertifikası' },
        heroNew: { kicker: 'Başkanlık Lüks Oteli', title: 'Her Katı ve Seviyeyi Keşfedin', sub: 'Yeraltı otoparkından çatı gökyüzü bahçesine — 14 titizlikle tasarlanmış katı keşfedin' },
        floors: {
          b2: { name: 'Yeraltı Otoparkı', description: '150 araçlık güvenli çok katlı otopark, EV şarj istasyonları ve tam vale hizmeti', features: ['150 Park Yeri', 'EV Şarj', 'Vale Hizmeti'] },
          b1: { name: 'Hizmetler ve Destek', description: 'Operasyonel mükemmellik merkezi — çamaşırhane, soğuk depo, kat hizmetleri ve mühendislik', features: ['Çamaşırhane', 'Soğuk Depo', 'Mühendislik'] },
          f0: { name: 'Büyük Lobi ve Resepsiyon', description: 'Mimari bir başyapıt — üç katlı tavanlar, kristal avizeler ve kapalı botanik bahçe', features: ['Concierge 24/7', '8 Butik', 'Kapalı Bahçe'] },
          f1: { name: 'Mutfak Mükemmeliyeti', description: 'Michelin yıldızlı şeflerin başında olduğu dört dünya standartlarında restoran', features: ['4 Restoran', '480 Kapasite', '25+ Şef'] },
          f2: { name: 'Etkinlikler ve Konferanslar', description: '800 misafire kadar modern konferans tesisleri olan büyük balo salonları', features: ['10 Etkinlik Alanı', '800+ Kapasite', '2500 m²'] },
          f3: { name: 'Sağlık ve Eğlence', description: 'Bir huzur vahası — dünya standartlarında spa, modern spor salonu ve sonsuz havuz', features: ['600 m² Spa', '400 m² Spor Salonu', 'Sonsuz Havuz'] },
          f4: { name: 'Standart Konaklama', description: 'Her konfor için tasarlanmış zarif odalar, premium detaylar ve şehir manzarası', features: ['80 Oda', '35-50 m²', 'Şehir Manzarası'] },
          f5: { name: 'Deluxe Odalar', description: 'Geniş düzenler, özel balkonlar ve premium olanaklarla yükseltilmiş konfor', features: ['60 Oda', '60-65 m²', 'Özel Balkon'] },
          f6: { name: 'Premium Odalar', description: 'Geniş aile süitleri, butler erişimi ve panoramik manzaralarla yüksek yaşam', features: ['50 Oda', '75-90 m²', 'Aile Süitleri'] },
          f7: { name: 'Lüks Süitler', description: 'Özel butler hizmeti, özel yemek ve panoramik şehir manzaralarıyla özel süitler', features: ['35 Süit', '120-200 m²', 'Butler 24/7'] },
          f8: { name: 'Başkanlık Katı', description: 'Mutlak lüksün zirvesi — özel havuz, sinema odası ve tam özel yemek salonu', features: ['500 m² Süit', 'Özel Havuz', 'Özel Sinema'] },
          f9: { name: 'Personel Konutları', description: 'Dünya standartlarındaki ekibimiz için eğlence merkezi ile premium konaklama', features: ['80 Oda', 'Eğlence', 'Eğitim Merkezi'] },
          f10: { name: 'Helipad Katı', description: 'VIP çatı varışı — ikiz helipadler, özel lounge ve havacılık concierge hizmeti', features: ['2 Helipad', 'VIP Lounge', 'Havacılık Ofisi'] },
          f11: { name: 'Çatı Gökyüzü Bahçesi', description: '360° panoramik manzaralar, sonsuz havuz, sky bar ve bakımlı bahçeler', features: ['450 m² Havuz', '800 m² Bahçe', '360° Manzara'] }
        }
      },
      premiumServices: {
        hero: {
          title: 'Premium Hizmetler',
          subtitle: 'En seçici misafirler için özel hizmetler ve kişiselleştirilmiş deneyimler'
        },
        card: {
          requestService: 'Hizmet Talep Et'
        },
        items: {
          medical: { name: '7/24 Tıbbi Destek', desc: 'Nöbetçi doktorlar ve acil tıbbi hizmetler' },
          butler: { name: 'Özel Butler', desc: 'Her ihtiyacınız için özel butler hizmeti' },
          security: { name: 'VIP Güvenlik', desc: 'Gizli kişisel güvenlik ve koruma hizmetleri' },
          maintenance: { name: 'Öncelikli Bakım', desc: 'Teknik gereksinimler için anında müdahale' },
          carFleet: { name: 'Lüks Araç Filosu', desc: 'Profesyonel şoförlerle premium araçlar' },
          helicopter: { name: 'Helikopter Hizmetleri', desc: 'Özel helikopter transferleri ve turlar' },
          wellness: { name: 'Wellness Programları', desc: 'Kişiselleştirilmiş sağlık ve wellness programları' },
          fitnessTrainers: { name: 'Kişisel Antrenörler', desc: 'Uzman fitness antrenörleri hizmetinizde' },
          eventPlanning: { name: 'Etkinlik Planlama', desc: 'Tam kapsamlı etkinlik koordinasyonu ve yönetimi' },
          businessSupport: { name: 'İş Merkezi', desc: 'Yönetici iş desteği ve tesisleri' }
        }
      },
      floorMaps: {
        common: {
          floorLabel: 'Kat {{floor}}',
          instructions: 'Etkileşimli harita — bir bölge seçin ve detayları görüntüleyin veya devam edin.',
          ariaLabel: '{{floor}} katı etkileşimli harita',
          restricted: 'Kısıtlı',
          proceed: 'Devam',
          details: 'Detaylar',
          legend: {
            interactive: 'Etkileşimli bölge',
            restricted: 'Kısıtlı bölge'
          },
          routeModal: {
            description:
              'Devam etmek için aşağıdan bir işlem seçin. Bu detay görünümü üstteyken harita sabit kalır.',
            destination: 'Hedef'
          }
        },
        meta: {
          availability: 'Uygunluk',
          access: 'Erişim',
          process: 'Süreç',
          security: 'Güvenlik',
          transfer: 'Transfer',
          coverage: 'Kapsama',
          control: 'Kontrol',
          function: 'İşlev',
          capacity: 'Kapasite',
          purpose: 'Amaç',
          operations: 'Operasyon',
          standard: 'Standart',
          design: 'Tasarım',
          flow: 'Akış',
          services: 'Hizmetler',
          service: 'Hizmet',
          atmosphere: 'Atmosfer',
          highlights: 'Öne Çıkanlar',
          support: 'Destek',
          layouts: 'Düzenler',
          use: 'Kullanım',
          bestFor: 'En iyi kullanım',
          meals: 'Öğünler',
          separation: 'Ayrım',
          impact: 'Etki',
          experience: 'Deneyim'
        },
        actions: {
          proceedToBooking: 'Rezervasyona Devam Et',
          exploreChauffeur: 'Şoför Hizmetini Keşfet',
          viewPremiumServices: 'Premium Hizmetleri Gör',
          exploreConcierge: 'Concierge Hizmetini Keşfet',
          exploreSpaWellness: 'Spa ve Sağlığı Keşfet',
          exploreServiceRequests: 'Servis Taleplerini Keşfet',
          requestService: 'Servis Talep Et',
          viewStaffResidences: 'Personel Konaklamasını Gör',
          viewServiceRequests: 'Servis Taleplerini Gör',
          exploreWellnessFacilities: 'Wellness Alanlarını Keşfet'
        },
        floors: {
          b2: {
            name: 'Ana Otopark Katı',
            zones: {
              valet: {
                label: 'Vale Teslim',
                hint: 'Premium araç teslimi',
                title: 'Vale Teslim',
                subtitle: 'Sorunsuz varış, gizli teslim ve öncelikli erişim.',
                description:
                  'Vale ekibimiz güvenlik yetkisi ve zaman damgalı teslim protokolleriyle çalışır. Araçlar kontrollü koridorlarla izlenen, ayrılmış bölgelere taşınır.',
                meta: {
                  availability: '7/24',
                  access: 'Misafirler ve VIP',
                  process: 'Doğrulamalı teslim + dijital fiş'
                }
              },
              ev: {
                label: 'EV Şarj Alanı',
                hint: 'Hızlı şarj koridoru',
                title: 'EV Şarj Alanı',
                subtitle: 'Sessiz, iklim kontrollü ve izlenen şarj alanları.',
                description:
                  'EV alanları güvenlik koridoruna en yakın konumdadır. Her istasyon planlı erişim ve akıllı izleme ile araç ve misafir gizliliğini korur.',
                meta: {
                  availability: 'Sınırlı kontenjan',
                  access: 'Misafir araçları',
                  security: 'Kamera + erişim kaydı'
                }
              },
              vip: {
                label: 'VIP Ayrılmış Park',
                hint: 'Kontrollü erişim bölümü',
                title: 'VIP Ayrılmış Park',
                subtitle: 'Üst düzey varışlar için güvenlik kontrollü park alanları.',
                description:
                  'VIP park alanları fiziksel bariyerler ve kontrol noktalarıyla ayrılmıştır. Protokol, gizlilik, hızlı asansör transferi ve minimum görünürlük için tasarlanmıştır.',
                meta: {
                  availability: 'Onay ile',
                  access: 'VIP + güvenlik eşliği',
                  transfer: 'Özel asansör koridoru'
                }
              },
              security: {
                label: 'Güvenlik Kontrol Noktası',
                hint: 'Kontrollü giriş ve izleme',
                title: 'Güvenlik Kontrol Noktası',
                subtitle: 'Araç koridorları için izleme ve kontrollü erişim.',
                description:
                  'Bu alan CCTV kapsamını, bariyer kontrolünü ve olay müdahalesini koordine eder. Misafir erişimi kritik noktalarda yönlendirilir ve doğrulanır.',
                meta: {
                  access: 'Kısıtlı',
                  coverage: 'CCTV + devriye',
                  control: 'Kapılar + asansör koridoru'
                }
              },
              maintenance: {
                label: 'Bakım Alanı',
                hint: 'Servis araçları ve ekipman',
                title: 'Bakım Alanı',
                subtitle: 'Güvenlik ve tesis sürekliliği için operasyon alanı.',
                description:
                  'Mühendislik ekipleri rutin kontrolleri, acil durum ekipmanını ve otopark operasyon altyapısını yönetir. Misafir girişi güvenlik için kısıtlıdır.',
                meta: {
                  access: 'Kısıtlı',
                  function: 'Mühendislik ve güvenlik',
                  availability: '7/24 operasyon'
                }
              },
              guestElevators: {
                label: 'Misafir Asansör Çekirdeği',
                hint: 'Lobiye direkt erişim'
              }
            }
          },
          b1: {
            name: 'Servis ve Destek Katı',
            zones: {
              laundry: {
                label: 'Endüstriyel Çamaşırhane',
                hint: 'Çamaşır işleme ve sterilizasyon',
                title: 'Endüstriyel Çamaşırhane',
                subtitle: 'Hassas hijyen, günlük kapasite ve tekstil bakımı.',
                description:
                  'Çamaşır dolaşımı, temiz ve kullanılmış akışlar arasında sıkı ayrım ile yönetilir. Bu, misafir konforunu ve operasyon güvenilirliğini korur.',
                meta: {
                  access: 'Kısıtlı',
                  capacity: 'Yüksek kapasite',
                  purpose: 'Misafir çarşafları ve üniformalar'
                }
              },
              storage: {
                label: 'Depolama Birimleri',
                hint: 'Envanter ve güvenli malzeme',
                title: 'Depolama Birimleri',
                subtitle: 'Denetim görünürlüğüyle kontrollü envanter alanları.',
                description:
                  'Tedarik, ikram ve etkinlik malzemeleri kısıtlı erişimli raflarda saklanır. Bölge, misafir etkisi olmadan hızlı yenileme sağlar.',
                meta: {
                  access: 'Kısıtlı',
                  purpose: 'İkram ve malzemeler',
                  security: 'Kayıtlı erişim'
                }
              },
              housekeeping: {
                label: 'Kat Hizmetleri Merkezi',
                hint: 'Operasyon komuta ve yönlendirme',
                title: 'Kat Hizmetleri Merkezi',
                subtitle: 'Yönlendirme, kalite kontrol ve misafir-hazır standartlar.',
                description:
                  'Bu merkez oda hazırlığını, turndown planlarını ve VIP hazırlık protokollerini koordine eder. Hız, sessizlik ve hassasiyet için tasarlanmıştır.',
                meta: {
                  access: 'Kısıtlı',
                  operations: '7/24',
                  standard: 'VIP hazırlık protokolleri'
                }
              },
              serviceElevators: {
                label: 'Servis Asansör Çekirdeği',
                hint: 'Operasyonel dikey erişim',
                title: 'Servis Asansör Çekirdeği',
                subtitle: 'Personel ve operasyon için ayrılmış dolaşım.',
                description:
                  'Servis dolaşımı, misafir yollarını sakin tutarken yüksek verimli lojistik sağlar.',
                meta: {
                  access: 'Kısıtlı',
                  purpose: 'Operasyon akışı',
                  design: 'Misafir ayrımı'
                }
              },
              additionalParking: {
                label: 'Ek Otopark',
                hint: 'Taşma ve personel araçları'
              },
              guestCore: {
                label: 'Misafir Asansör Bağlantısı',
                hint: 'Lobiye direkt erişim'
              }
            }
          },
          0: {
            name: 'Büyük Lobi ve Resepsiyon',
            zones: {
              entrance: {
                label: 'Büyük Giriş',
                hint: 'Varış aksı',
                title: 'Büyük Giriş',
                subtitle: 'İlk izlenim için tasarlanmış törensel bir varış.',
                description:
                  'Giriş koridoru bilinçli olarak sakindir: kontrollü aydınlatma, akustik düzenleme ve resepsiyona net bir yol. Personel konumu görsel kalabalık olmadan anında yardım sağlar.',
                meta: {
                  access: 'Halka açık',
                  purpose: 'Varış ve karşılama',
                  flow: 'Resepsiyona direkt'
                }
              },
              reception: {
                label: 'Resepsiyon',
                hint: 'Giriş ve concierge',
                title: 'Resepsiyon',
                subtitle: 'Concierge ustalığıyla desteklenen gizli check-in.',
                description:
                  'Resepsiyon katmanlı hizmetle çalışır: ana masa, VIP karşılama ve öncelikli destek. İstekleriniz doğru ekibe anında yönlendirilir.',
                meta: {
                  availability: '7/24',
                  access: 'Halka açık',
                  services: 'Concierge + VIP karşılama'
                }
              },
              lounge: {
                label: 'Lüks Lounge',
                hint: 'Bekleme ve ikram',
                title: 'Lüks Lounge',
                subtitle: 'Sessiz konfor, seçkin ikramlar ve şehir manzarası.',
                description:
                  'Lounge sakin geçişler için tasarlandı: check-in bekleme, gayriresmî görüşmeler ve özel anlar. Oturma düzeni kişisel alanı korur.',
                meta: {
                  access: 'Misafirler',
                  availability: 'Tüm gün',
                  atmosphere: 'Düşük gürültü premium'
                }
              },
              garden: {
                label: 'Kapalı Bahçe',
                hint: 'Şelale ve botanik alan',
                title: 'Kapalı Bahçe',
                subtitle: 'Zamanı yavaşlatan botanik bir sakinlik.',
                description:
                  'İklim kontrollü mikro bahçe ve su sesi akustiği. Varışlar, toplantılar ve gece dönüşleri için sakin bir odak noktası.',
                meta: {
                  access: 'Halka açık',
                  purpose: 'Dinlenme ve atmosfer',
                  design: 'Akustik + ışık kontrolü'
                }
              },
              retail: {
                label: 'Butik Mağazalar',
                hint: 'Lüks perakende koridoru',
                title: 'Butik Mağazalar',
                subtitle: 'Gizli hizmetle küratörlü lüks.',
                description:
                  'Premium markalar ve seçkin hediyeler içeren sakin bir koridor. Personel desteği misafir akışını kesmeden sağlanır.',
                meta: {
                  access: 'Halka açık',
                  availability: 'Her gün',
                  service: 'Hediye paketi + concierge tedariki'
                }
              },
              cafe: {
                label: 'Kafe ve Bar',
                hint: 'Zanaat kahve ve premium içecekler'
              }
            }
          },
          1: {
            name: 'Mutfak Mükemmelliği',
            zones: {
              main: {
                label: 'Ana Restoran',
                hint: 'İmza lezzetler'
              },
              vip: {
                label: 'VIP Lounge',
                hint: 'Özel yemek ve geç saatler',
                title: 'VIP Lounge',
                subtitle: 'Özel yemek, kontrollü ambiyans, gizli erişim.',
                description:
                  'VIP lounge mahremiyet için tasarlandı: ayrık oturma grupları, premium ses kontrolü ve talep üzerine concierge ve güvenlikle doğrudan koordinasyon.',
                meta: {
                  access: 'Misafirler + onay',
                  availability: 'Geç saatler',
                  service: 'Sommelier + özel menüler'
                }
              },
              cafe: {
                label: 'Café Royale',
                hint: 'Tüm gün kafe',
                title: 'Café Royale',
                subtitle: 'Zanaat kahve, hamur işleri ve sakin sohbetler.',
                description:
                  'Premium çekirdeklerle rafine bir kafe ve kontrollü akustik — toplantılar, okuma ve gündelik lüks için ideal.',
                meta: {
                  availability: '7/24 konsept',
                  access: 'Misafirler + halka açık',
                  highlights: 'Hamur işleri + imza içecekler'
                }
              },
              breakfast: {
                label: 'Kahvaltı Salonu',
                hint: 'Sabah büfesi ve à la carte',
                title: 'Kahvaltı Salonu',
                subtitle: 'Premium seçkiyle sakin bir sabah ritüeli.',
                description:
                  'Kahvaltı alanı akış için optimize edilmiştir: net istasyonlar, düşük bekleme ve sakin oturma düzeni. Diyet tercihleri özel hazırlık protokolleriyle desteklenir.',
                meta: {
                  availability: 'Sabah saatleri',
                  access: 'Misafirler',
                  service: 'Diyet uyarlamaları'
                }
              }
            }
          },
          2: {
            name: 'Etkinlikler ve Konferanslar',
            zones: {
              grandHall: {
                label: 'Büyük Düğün Salonu',
                hint: 'Tören salonu',
                title: 'Büyük Düğün Salonu',
                subtitle: 'Unutulmaz törenler için tasarlanmış amiral salon.',
                description:
                  'Salon esnek oturma, dinamik sahne kurgusu ve premium ışık kontrolü sağlar. Planlayıcılar zamanlama, ikram ve misafir akışını yönetir.',
                meta: {
                  capacity: '500’e kadar',
                  availability: 'Rezervasyon ile',
                  service: 'Planlama + ikram'
                }
              },
              conference: {
                label: 'Konferans Merkezi',
                hint: 'Kurumsal etkinlikler',
                title: 'Konferans Merkezi',
                subtitle: 'Üst düzey teknoloji ve kontrollü akustik.',
                description:
                  'A/V desteği ve profesyonel misafirperverlik omurgasıyla ölçeklenebilir bir konferans alanı. Zirveler, lansmanlar ve kapalı oturumlar için uygundur.',
                meta: {
                  capacity: '300’e kadar',
                  availability: 'Rezervasyon ile',
                  support: 'A/V + concierge yönlendirme'
                }
              },
              meetings: {
                label: 'Toplantı Odaları',
                hint: '8 modüler oda',
                title: 'Toplantı Odaları',
                subtitle: 'Odaklı oturumlar için özel, modüler odalar.',
                description:
                  'Kontrollü aydınlatma ve temiz bir görsel profil. Mobilyalar yönetim kurulu, sınıf veya lounge düzeni için konfigüre edilebilir.',
                meta: {
                  availability: 'Rezervasyon ile',
                  capacity: 'Oda başına 20–50',
                  layouts: 'Yönetim kurulu + sınıf'
                }
              },
              vipSuite: {
                label: 'VIP Toplantı Süiti',
                hint: 'Yüksek mahremiyet',
                title: 'VIP Toplantı Süiti',
                subtitle: 'Kontrollü erişimle yönetici mahremiyeti.',
                description:
                  'Gizli oturumlar için ayrılmış süit. Giriş concierge ve güvenlik protokolleriyle yönetilir. Hizmet gizli ve hassas zamanlıdır.',
                meta: {
                  access: 'Kısıtlı',
                  availability: 'Onay ile',
                  service: 'Özel ikram'
                }
              }
            }
          },
          3: {
            name: 'Wellness ve Rekreasyon',
            zones: {
              gym: {
                label: 'Fitness Merkezi',
                hint: 'Son teknoloji spor salonu'
              },
              spa: {
                label: 'Royal Spa',
                hint: 'Bakım ve wellness'
              },
              pool: {
                label: 'Kapalı Havuz',
                hint: 'Sakin su sığınağı'
              },
              sauna: {
                label: 'Sauna ve Buhar',
                hint: 'Termal süit',
                title: 'Sauna ve Buhar',
                subtitle: 'Kontrollü nem ve ısıyla termal yenilenme.',
                description:
                  'Antrenman sonrası toparlanma ve derin rahatlama için sakin bir termal süit. Misafirler yönlendirmeli seansları concierge veya wellness resepsiyonu üzerinden rezerve edebilir. ',
                meta: {
                  availability: 'Her gün',
                  access: 'Misafirler',
                  use: 'Toparlanma + rahatlama'
                }
              },
              relax: {
                label: 'Rahatlama Lounge’ları',
                hint: 'Sessiz toparlanma',
                title: 'Rahatlama Lounge’ları',
                subtitle: 'Yumuşak ışık, sakin oturma ve mahremiyet odaklı plan.',
                description:
                  'Bu alan terapi sonrası toparlanma ve sakin zaman için idealdir. Oturma geometrisi kişisel alanı ve minimum geçişi korur.',
                meta: {
                  access: 'Misafirler',
                  atmosphere: 'Sakin + düşük gürültü',
                  bestFor: 'Terapi sonrası toparlanma'
                }
              }
            }
          },
          4: {
            name: 'Standart Odalar',
            zones: {
              wingA: {
                label: 'Kanat A (401–420)',
                hint: 'Tek kişilik oda kümesi'
              },
              wingB: {
                label: 'Kanat B (421–445)',
                hint: 'Çift kişilik oda kümesi'
              },
              wingC: {
                label: 'Kanat C (446–465)',
                hint: 'İkiz oda kümesi'
              },
              serviceCore: {
                label: 'Servis Çekirdeği',
                hint: 'Kat hizmetleri erişimi',
                title: 'Servis Çekirdeği',
                subtitle: 'Misafirlerden görünmez kalacak şekilde tasarlanmış operasyon erişimi.',
                description:
                  'Servis çekirdeği çarşaf teslimi, bakım müdahalesi ve sessiz oda servisini sağlar. Premium misafir sakinliğini destekleyen kısıtlı bir güzergâhtır.',
                meta: {
                  access: 'Kısıtlı',
                  purpose: 'Operasyon akışı',
                  design: 'Sessiz lojistik'
                }
              },
              elevators: {
                label: 'Misafir Asansörleri',
                hint: 'Dikey erişim'
              }
            }
          },
          5: {
            name: 'Deluxe Odalar',
            zones: {
              city: {
                label: 'Şehir Manzaralı Deluxe',
                hint: 'Panoramik skyline'
              },
              garden: {
                label: 'Bahçe Manzaralı Deluxe',
                hint: 'Teraslar ve sakinlik'
              },
              lounge: {
                label: 'VIP Misafir Lounge',
                hint: 'Sessiz ikramlar',
                title: 'VIP Misafir Lounge',
                subtitle: 'Deluxe kategori misafirler için sakin bir lounge.',
                description:
                  'Kontrollü bir ortamda ikramlar, sakin oturma ve concierge yönlendirmesi. Kısa toplantılar ve akşam dinlenmesi için tasarlandı.',
                meta: {
                  access: 'Uygun misafirler',
                  availability: 'Her gün',
                  service: 'Concierge yönlendirmesi'
                }
              },
              core: {
                label: 'Asansör Çekirdeği',
                hint: 'Lobi bağlantısı'
              }
            }
          },
          6: {
            name: 'Premium Odalar',
            zones: {
              premium: {
                label: 'Premium Odalar',
                hint: 'Yaşam alanı + balkon'
              },
              family: {
                label: 'Premium Aile',
                hint: 'İki yatak odası'
              },
              concierge: {
                label: 'Aile Concierge Noktası',
                hint: 'Öncelikli yardım'
              },
              core: {
                label: 'Asansör Çekirdeği',
                hint: 'Lobi bağlantısı'
              }
            }
          },
          7: {
            name: 'Lüks Süitler',
            zones: {
              exec: {
                label: 'Executive Süitler',
                hint: 'Ofis + toplantı odası'
              },
              luxury: {
                label: 'Lüks Süitler',
                hint: 'Oturma + yemek'
              },
              royal: {
                label: 'Royal Süitler',
                hint: 'Jakuzi + özel mutfak'
              },
              butler: {
                label: 'Butler Servis Noktası',
                hint: 'Kişiselleştirilmiş hizmet'
              }
            }
          },
          8: {
            name: 'Başkanlık Katı',
            zones: {
              suite: {
                label: 'Başkanlık Süiti',
                hint: 'Özel rezidans'
              },
              pool: {
                label: 'Özel Kapalı Havuz',
                hint: 'İklim kontrollü mahremiyet',
                title: 'Özel Kapalı Havuz',
                subtitle: 'Mutlak mahremiyet için tasarlanmış gizli bir havuz.',
                description:
                  'Bu havuza yalnızca başkanlık koridorundan erişilir. Hizmet, mahremiyeti korumak ve sakin atmosferi sürdürmek için özel personel ile yürütülür.',
                meta: {
                  access: 'Kısıtlı',
                  availability: 'Süit erişimiyle',
                  service: 'Özel personel'
                }
              },
              cinema: {
                label: 'Özel Sinema',
                hint: 'Son teknoloji salon',
                title: 'Özel Sinema',
                subtitle: 'Kontrollü ses ve oturma düzenine sahip özel bir salon.',
                description:
                  'Başkanlık mahremiyeti için tasarlanmış kompakt bir salon. İçerik seçimi ve program concierge ile koordine edilebilir.',
                meta: {
                  access: 'Kısıtlı',
                  availability: 'Süit erişimiyle',
                  service: 'Concierge planlama'
                }
              },
              office: {
                label: 'Yönetici Ofisi',
                hint: 'İş olanakları',
                title: 'Yönetici Ofisi',
                subtitle: 'Kontrollü erişimle özel iş ortamı.',
                description:
                  'Güvenli toplantılar ve gizli iş akışları için tasarlanmış yönetici seviyesinde çalışma alanı. Destek premium hizmetler üzerinden sağlanır.',
                meta: {
                  access: 'Kısıtlı',
                  availability: 'Süit erişimiyle',
                  support: 'Premium hizmetler'
                }
              }
            }
          },
          9: {
            name: 'Personel Konaklaması',
            zones: {
              accommodation: {
                label: 'Personel Konaklaması',
                hint: 'Yaşam alanları',
                title: 'Personel Konaklaması',
                subtitle: 'Operasyonel mükemmelliği destekleyen sakin yaşam alanları.',
                description:
                  'Hızlı müdahale ve istikrarlı operasyon için personel adına ayrılmış konaklama katı. Alanlar misafir yollarından ayrıdır ve erişim kontrolüyle yönetilir.',
                meta: {
                  access: 'Kısıtlı',
                  purpose: 'Operasyonel hazırlık',
                  separation: 'Misafir yolları ayrılmış'
                }
              },
              dining: {
                label: 'Personel Yemekhanesi',
                hint: 'Üç öğün servis',
                title: 'Personel Yemekhanesi',
                subtitle: 'Vardiyalar için planlanmış sağlıklı öğünler.',
                description:
                  'Bu tesis vardiyalar boyunca düzenli öğün hizmetiyle personel refahını destekler. Ortam verimli, temiz ve hızlı akış için optimize edilmiştir.',
                meta: {
                  access: 'Kısıtlı',
                  meals: 'Günlük program',
                  purpose: 'Personel refahı'
                }
              },
              training: {
                label: 'Eğitim Merkezi',
                hint: 'Profesyonel gelişim',
                title: 'Eğitim Merkezi',
                subtitle: 'Operasyon eğitimi ve standart pekiştirme.',
                description:
                  'Eğitim, misafirperverlik standartlarını, güvenlik rutinlerini ve hizmet tutarlılığını pekiştirir. Bu, otelin tamamında premium sonuçları destekler.',
                meta: {
                  access: 'Kısıtlı',
                  purpose: 'Standartlar + güvenlik',
                  impact: 'Misafir deneyimi kalitesi'
                }
              },
              recreation: {
                label: 'Rekreasyon ve Wellness',
                hint: 'Personel toparlanma',
                title: 'Rekreasyon ve Wellness',
                subtitle: 'Mükemmel hizmeti sürdüren toparlanma alanları.',
                description:
                  'Toparlanma alanları tutarlı performans ve refahı destekler. Yerleşim basit, kontrollü ve operasyon koridorlarından ayrıdır.',
                meta: {
                  access: 'Kısıtlı',
                  purpose: 'Toparlanma',
                  design: 'Sessiz ve işlevsel'
                }
              }
            }
          },
          10: {
            name: 'Helipad Katı',
            zones: {
              helipad: {
                label: 'Ana Helipad',
                hint: 'Yönetici varışları',
                title: 'Ana Helipad',
                subtitle: 'Seçkin misafirler için kontrollü varış tesisi.',
                description:
                  'Operasyonlar güvenlik ve havacılık personeliyle koordine edilir. Misafir hareketi minimum görünürlük için VIP resepsiyona ve özel asansör koridorlarına yönlendirilir.',
                meta: {
                  access: 'Kısıtlı',
                  availability: 'Onay ile',
                  flow: 'VIP resepsiyon + özel asansörler'
                }
              },
              vipReception: {
                label: 'VIP Resepsiyon',
                hint: 'Özel varış lounge',
                title: 'VIP Resepsiyon',
                subtitle: 'Hava varışları için gizli lounge.',
                description:
                  'Concierge desteği ve güvenlik yönlendirmesiyle sakin bir varış alanı. Halka açık maruz kalmadan otele hızlı geçiş için tasarlanmıştır.',
                meta: {
                  access: 'Kısıtlı',
                  service: 'Concierge + eskort',
                  transfer: 'Özel asansör koridoru'
                }
              },
              control: {
                label: 'İniş Kontrolü',
                hint: 'Navigasyon ve koordinasyon',
                title: 'İniş Kontrolü',
                subtitle: 'Navigasyon sistemleri ve operasyon koordinasyonu.',
                description:
                  'Kontrol merkezi hava durumunu, yaklaşma protokollerini ve güvenli varış zamanlamasını yönetir. Misafir erişimi güvenlik için kısıtlıdır.',
                meta: {
                  access: 'Kısıtlı',
                  purpose: 'Güvenlik + koordinasyon',
                  availability: '7/24 hazır'
                }
              },
              security: {
                label: 'Güvenlik Merkezi',
                hint: 'İzleme ve müdahale',
                title: 'Güvenlik Merkezi',
                subtitle: 'Yönetici varışları için gelişmiş izleme.',
                description:
                  'Güvenlik personeli eskort rotalarını, çevre izlemeyi ve olay müdahalesini koordine eder. Yerleşim hız ve gizliliği önceler.',
                meta: {
                  access: 'Kısıtlı',
                  coverage: 'İzleme sistemleri',
                  service: 'Eskort koordinasyonu'
                }
              }
            }
          },
          11: {
            name: 'Sky Garden ve Sonsuz Havuz',
            zones: {
              pool: {
                label: 'Sonsuz Havuz',
                hint: 'Gün batımı yüzüşü'
              },
              garden: {
                label: 'Sky Garden',
                hint: 'Botanik çatı',
                title: 'Sky Garden',
                subtitle: 'Kontrollü aydınlatma ve sakin yollarla çatı bahçesi.',
                description:
                  'Oturma cepleri ve düşük kalabalıklı yollarla küratörlü botanik alan. Gürültü olmadan gün doğumu sakinliği ve gün batımı buluşmaları için tasarlandı.',
                meta: {
                  access: 'Misafirler',
                  availability: 'Her gün',
                  experience: 'Gün batımı + etkinlikler'
                }
              },
              skybar: {
                label: 'Sky Lounge Bar',
                hint: 'Premium kokteyller',
                title: 'Sky Lounge Bar',
                subtitle: 'Şık akşamlar için tasarlanmış çatı barı.',
                description:
                  'İmza kokteyller, sakin oturma grupları ve kontrollü ışık. Masa servisi mevcut; etkinlik planlama concierge üzerinden yapılır.',
                meta: {
                  access: 'Misafirler',
                  availability: 'Akşamlar',
                  service: 'Masa servisi'
                }
              },
              restaurant: {
                label: 'Panorama Restoran',
                hint: 'Manzaralı fine dining'
              }
            }
          }
        }
      }
      ,
      home: {
        hero: {
          title: 'Presidential Luxury',
          subtitle: 'Otel Yönetim Sistemi',
          description: 'Kraliyet ile modern zarafetin buluştuğu yer',
          actions: {
            reserve: 'Konaklamanı Rezerve Et',
            exploreFloors: 'Katları Keşfet'
          },
          stats: {
            luxuryFloors: 'Lüks Katlar',
            premiumRooms: 'Premium Odalar',
            conciergeService: 'Concierge Hizmeti'
          },
          scroll: 'Keşfetmek için kaydır'
        },
        features: {
          heading: 'Eşsiz Mükemmellik',
          subheading: 'Lüks misafirperverliğin en iyisini yaşayın',
          items: {
            elegance: {
              title: 'Başkanlık Zarafeti',
              description: 'Titizlikle tasarlanmış 12 katta yeniden tanımlanan lüks'
            },
            concierge: {
              title: '7/24 Concierge',
              description: 'Günün her saati parmaklarınızın ucunda dünya standartlarında hizmet'
            },
            helipad: {
              title: 'Helipad Hizmetleri',
              description: 'Özel helikopter iniş imkanlarıyla şık bir varış'
            },
            rooftopPool: {
              title: 'Çatı Sonsuzluk Havuzu',
              description: 'Gökyüzü havuzu ve bahçeden panoramik manzaralar'
            }
          }
        },
        suites: {
          heading: 'İmza Süitler',
          subheading: 'En ayrıcalıklı konaklama seçeneklerimizin tadını çıkarın',
          actions: {
            viewDetails: 'Detayları Gör'
          },
          items: {
            presidential: {
              title: 'Başkanlık Süiti',
              floor: 'Kat 8',
              size: '500 m²',
              features: 'Özel havuz, sinema, yemek salonu'
            },
            royal: {
              title: 'Royal Süit',
              floor: 'Kat 7',
              size: '350 m²',
              features: 'Premium imkanlar, şehir manzarası'
            },
            executive: {
              title: 'Executive Süit',
              floor: 'Kat 7',
              size: '200 m²',
              features: 'İş merkezi, lounge erişimi'
            }
          }
        },
        experience: {
          heading: 'Başkanlık Deneyimi',
          paragraphs: {
            0: 'Her detayın prestij ve zarafeti yansıttığı bir dünyaya dalın. Büyük lobiden çatı sonsuzluk havuzuna kadar her kat, tavizsiz lüks ve zamansız zarafetin hikayesini anlatır.',
            1: '12 katlı mimari şaheserimiz; Michelin seviyesinde yemeklerden özel helikopter hizmetlerine, spa olanaklarından başkanlık süitlerine kadar her şeyi barındırır. Bu sadece bir otel değil—bir destinasyon.'
          },
          actions: {
            exploreAllFloors: 'Tüm Katları Keşfet'
          }
        },
        cta: {
          heading: 'Başkanlık Yolculuğuna Başlayın',
          subheading: 'Olağanüstü deneyiminizi bugün rezerve edin',
          actions: {
            bookNow: 'Hemen Rezervasyon',
            viewServices: 'Hizmetleri Gör'
          }
        },
        heroNew: { kicker: 'Başkanlık Lüks Oteli', title: 'Başkanlık Lüksünü Yaşayın', subtitle: 'Zarafet, gelişinizin ilk anından başlar', stats: { rooms: 'Lüks Oda', floors: 'Premium Kat', rating: 'Forbes Puanı', concierge: 'Concierge Hizmeti' }, actions: { exploreRooms: 'Odaları Keşfet', bookNow: 'Rezervasyon Yap' }, scroll: 'Kaydır' },
        about: { kicker: 'Hikayemiz', title: 'Bir Asırlık Eşsiz Mükemmellik', para1: 'Yüz yılı aşkın bir süredir Başkanlık Lüks Oteli, zarafet ve inceliğin sembolü olmuştur.', para2: 'Ünlü çatı katlı süitlerden ödüllü restoranımıza ve dünya standartlarında spamıza kadar lüksü yaşayan bir felsefe haline getirdik.', pillars: { heritage: 'Miras', excellence: 'Mükemmellik', discretion: 'Takdirsellik', craft: 'Ustalık' }, since: 'Kuruluş', action: 'Hikayemizi Keşfet' },
        rooms: { kicker: 'Konaklama Seçeneklerimiz', title: 'Olağanüstü Konfor için Özenle Seçilmiş Alanlar', viewAll: 'Tüm 60 Oda ve Süiti Gör', perNight: '/ gece', viewDetails: 'Detayları Gör', bookNow: 'Rezervasyon Yap', badges: { mostExclusive: 'En Ayrıcalıklı', mostPopular: 'En Popüler' }, featured: { r1: { name: 'Kraliyet Süiti', type: 'Kraliyet Süiti', floor: '11. Kat', size: '420 m²', features: ['Özel Havuz', 'Butler 24/7', 'Panoramik Manzara', 'Helipad Erişimi'] }, r2: { name: 'Başkanlık Süiti', type: 'Başkanlık Süiti', floor: '10. Kat', size: '320 m²', features: ['Özel Jakuzi', 'Tam Oturma Odası', 'Özel Teras', 'Concierge'] }, r3: { name: 'Executive Deluxe', type: 'Deluxe', floor: '5. Kat', size: '65 m²', features: ['Şehir Silüeti', 'King Yatak', 'Mermer Banyo', 'Nespresso Bar'] } } },
        services: { kicker: 'Otel Hizmetleri', title: 'Her Detay, Sizin İçin Mükemmelleştirildi', explore: 'Keşfet →', items: { spa: { name: 'Lüks Spa', desc: 'Dünya standartlarında tedaviler ve wellness deneyimleri' }, dining: { name: 'Fine Dining', desc: 'Michelin yıldızlı mutfak' }, pool: { name: 'Sonsuz Havuz', desc: 'Panoramik manzaralı çatı vahası' }, gym: { name: 'Fitness Merkezi', desc: 'Modern ekipman, kişisel antrenörler' }, butler: { name: 'Butler Hizmeti', desc: '7/24 kişisel asistan' }, driver: { name: 'Havalimanı Transferi', desc: 'Özel limuzin, her yere, her saat' } } },
        lifestyle: { kicker: 'Deneyim', title: 'Hayatın Her Bölümü İçin Tasarlandı', explore: 'Keşfet →', items: { romantic: { title: 'Romantik Kaçamaklar', desc: 'Samimi ortamlar, mum ışığında akşamlar' }, family: { title: 'Aile Tatilleri', desc: 'Birlikte seyahat eden aileler için geniş süitler' }, business: { title: 'İş Eliti', desc: 'Executive lounge, mükemmel bağlantı' }, vip: { title: 'VIP Yaşam Tarzı', desc: 'Sınırsız lüks, mutlak mahremiyet' } } },
        testimonials: { kicker: 'Misafir Hikayeleri', title: 'Seçkin Misafirlerimizden Sözler', items: { t1: { quote: 'Başkanlık Süiti her beklentimi aştı. Butler hizmeti kusursuzdu.', name: 'Jonathan M.', role: 'İş İnsanı' }, t2: { quote: 'Balayımız kesinlikle mükemmeldi. Unutulmaz anlar.', name: 'Sarah & James L.', role: 'Balayı Çifti' }, t3: { quote: 'Üç çocukla seyahat hiç bu kadar kolay olmamıştı.', name: 'Al-Rashid Ailesi', role: 'Aile Konaklaması' }, t4: { quote: 'Sık seyahat eden biri olarak bu otel farklı. Olağanüstü.', name: 'Chloé Dubois', role: 'Kurumsal Misafir' } } },
        ctaNew: { kicker: 'Yolculuğunuz Sizi Bekliyor', title: 'Mükemmel Konaklamanızı Bugün Rezerve Edin', sub: '150 dolardan / gece · 60 oda ve süit · Forbes Beş Yıldız Sertifikası', bookNow: 'Rezervasyon Yap', contactUs: 'İletişim' },
        awards: ['Forbes Seyahat Rehberi ★★★★★', "Condé Nast Okuyucu Seçimi", "Dünyanın En İyi 100 Oteli", 'Architectural Digest Ödülü', 'AAA Beş Elmas', "Dünyanın Önde Gelen Otelleri"]
      },
      rooms: {
        hero: {
          title: 'Lüks Konaklama',
          description:
            'Her biri en üst düzey konfor ve lüks için tasarlanmış şık odalar koleksiyonumuzu keşfedin'
        },
        filters: {
          all: 'Tüm Odalar',
          standard: 'Standart',
          deluxe: 'Deluxe',
          premium: 'Premium'
        },
        card: {
          floor: 'Kat {{floor}}',
          size: '{{size}} m²',
          pricePerNight: '${{price}}/gece',
          viewDetails: 'Detayları Gör'
        },
        items: {
          single: { type: 'Tek Kişilik Oda' },
          double: { type: 'Çift Kişilik Oda' },
          twin: { type: 'İkiz Oda' },
          deluxe: { type: 'Deluxe Oda' },
          deluxeCity: { type: 'Şehir Manzaralı Deluxe' },
          premium: { type: 'Premium Oda' },
          premiumFamily: { type: 'Premium Aile' },
          superior: { type: 'Superior Oda' }
        },
        amenities: {
          kingBed: 'King yatak',
          cityView: 'Şehir manzarası',
          workstation: 'Çalışma alanı',
          miniBar: 'Mini bar',
          twoQueenBeds: 'İki queen yatak',
          balcony: 'Balkon',
          smartTv: 'Akıllı TV',
          safe: 'Kasa',
          twinBeds: 'İkiz yatak',
          gardenView: 'Bahçe manzarası',
          sittingArea: 'Oturma alanı',
          wifi: 'Wi‑Fi',
          premiumView: 'Premium manzara',
          largeBalcony: 'Geniş balkon',
          espressoMachine: 'Espresso makinesi',
          panoramicView: 'Panoramik manzara',
          workDesk: 'Çalışma masası',
          sofa: 'Kanepe',
          luxuryBath: 'Lüks banyo',
          livingArea: 'Yaşam alanı',
          wineFridge: 'Şarap dolabı',
          premiumLinens: 'Premium nevresim',
          twoBedrooms: 'İki yatak odası',
          kitchenette: 'Mini mutfak',
          familyLounge: 'Aile lounge',
          extraSpace: 'Ekstra alan',
          oceanView: 'Deniz manzarası',
          premiumAmenities: 'Premium imkanlar',
          largeBathroom: 'Geniş banyo'
        },
        types: { STANDARD: 'Standart', SINGLE: 'Tek Kişilik', COUPLE: 'Çift Kişilik', FAMILY: 'Aile', DELUXE: 'Deluxe', JUNIOR_SUITE: 'Junior Süit', EXECUTIVE_SUITE: 'Executive Süit', FAMILY_SUITE: 'Aile Süiti', PRESIDENTIAL_SUITE: 'Başkanlık Süiti', ROYAL_SUITE: 'Kraliyet Süiti' },
        allFilters: { all: 'Tüm Odalar', STANDARD: 'Standart', SINGLE: 'Tek Kişilik', COUPLE: 'Çift Kişilik', FAMILY: 'Aile', DELUXE: 'Deluxe', suites: 'Süitler' },
        status: { available: 'Müsait', booked: 'Şu An Dolu', nearAvailable: 'Yakında Müsait', maintenance: 'Bakımda' },
        roomCard: { bookNow: 'Rezervasyon Yap', viewDetails: 'Detayları Gör', perNight: '/ gece', sqm: 'm²', guests: 'misafir', booked: 'Dolu', availableSoon: 'Yakında Müsait' },
        page: { label: 'Başkanlık Lüks Oteli', title: 'Odalarımız ve Süitlerimiz', found: '{{count}} {{type}} bulundu', roomsType: 'oda', suitesType: 'süit', loading: 'Odalar yükleniyor…', empty: 'Bu kategoride oda bulunamadı.', showAll: 'Tümünü Göster', floorTag: '{{n}}. Kat', roomTitle: 'Oda {{n}}', prev: '← Önceki', next: 'Sonraki →', bed: 'Yatak', beds: 'Yatak', bath: 'Banyo', baths: 'Banyo', details: 'Detaylar', unavailable: 'Müsait Değil', pricePerNight: '/gece', bookedMsg: 'Bu oda şu anda dolu.', checkoutMsg: 'Yakında çıkış yapılacak.', availableOn: 'Tekrar müsait olacak:', freeOn: 'Boşalacak:', overlayBooked: '🔴 Dolu', overlaySoon: '🟣 Yakında Müsait', overlayMaintenance: '🔧 Bakımda' },
        legend: { available: '● Müsait', soon: '● Yakında Müsait', booked: '● Dolu' },
        featureTags: {
          jacuzzi: 'Jakuzi',
          balcony: 'Balkon',
          butler: 'Butler',
          livingRoom: 'Oturma Odası',
          diningArea: 'Yemek Alanı',
          privatePool: 'Özel Havuz',
          minibar: 'Mini Bar',
          nespresso: 'Nespresso',
        },
        viewMap: {
          cityView: 'Şehir Manzarası',
          oceanView: 'Deniz Manzarası',
          poolView: 'Havuz Manzarası',
          gardenView: 'Bahçe Manzarası',
          panoramicCity: 'Panoramik Şehir',
          skylinePanorama: 'Şehir Silüeti Panoraması',
          panorama360: '360° Panorama',
          horizon360: '360° Ufuk',
          panoramicSkyline: 'Panoramik Silüet',
        },
        bedTypeMap: {
          kingBed: 'King Yatak',
          queenBed: 'Queen Yatak',
          singleBed: 'Tek Kişilik Yatak',
          queenBunk: 'Queen + Ranza',
          emperorBed: 'Emperor Yatak',
          emperorKing: 'Emperor + King',
          twinBeds: 'İkiz Yataklar',
        },
      },
      suiteDetail: {
        notFound: 'Süit Bulunamadı',
        notFoundText: 'Aradığınız süit mevcut değil.',
        backToSuites: 'Süitlere Dön',
        loginMessage: 'Rezervasyon için lütfen giriş yapın.',
        labels: {
          size: 'Boyut',
          floor: 'Kat',
          guests: 'Misafir',
          beds: 'Yatak',
          upTo: 'En fazla {{n}}',
          about: 'Bu Süit Hakkında',
          amenities: 'Süit İmkânları',
          luxuryServices: 'Lüks Hizmetler',
          included: 'Dahil',
          from: 'Başlangıç',
          perNight: 'gece başına',
          bestRate: 'En İyi Fiyat Garantisi',
          freeCancellation: 'Ücretsiz İptal (48 saat)',
          memberBenefits: 'Özel Üye Avantajları',
          bookSuite: 'Bu Süiti Rezerve Et',
          callUs: 'Veya bizi arayın:',
        },
        suites: {
          executive: {
            name: 'Executive Süit',
            tagline: 'İş ve Lüksün Buluşma Noktası',
            description: [
              'Executive Süit, şık konfor ve profesyonel işlevselliğin mükemmel bir bileşimini sunar. Prestijli 7. katımızda 120 metrekare alana yayılan bu süit; ergonomik oturma düzeni, yüksek hızlı fiber internet ve 4 misafire kadar özel toplantı alanı içermektedir.',
              'Ana yatak odası, Mısır pamuklu çarşaflara sahip premium king yatak ile öne çıkarken, ayrı oturma odası dinlenme veya ağırlama için zarif bir ortam sunar. Tavandan tabana uzanan camlar panoramik şehir manzarası sunarak iç mekânı doğal ışıkla doldurur.'
            ],
            amenities: [
              'Özel Executive Lounge Girişi',
              'Kişisel Concierge Hizmeti',
              'Premium Mini Bar (Ücretsiz)',
              'Nespresso Makinesi ve Çay Seçimi',
              'Akıllı Ev Kontrolleri',
              'Bang & Olufsen Ses Sistemi',
              '65" 4K Akıllı TV',
              'Yağmur Duşlu Mermer Banyo',
              'Ayrı Islak Hazne',
              'Lüks Bulgari Tuvalet Malzemeleri',
              'Giyinme Odası',
              'Oda Kasası (Laptop Boyutu)',
              'Ütü ve Ütü Masası',
              'Günlük Gazete Servisi'
            ],
            luxuryServicesIncluded: [
              'Özel Check-in/Check-out',
              'Karşılama Şampanyası ve Çikolatası',
              'Mumlu Yataktan Hazırlama Servisi',
              'Öncelikli Restoran Rezervasyonu',
              'Ücretsiz Ütüleme (2 Parça)'
            ],
            luxuryServicesExtra: [
              { name: 'Havalimanı Limuzin Transferi', price: '$150' },
              { name: '24 Saatlik Butler Hizmeti', price: '$200/gün' },
              { name: 'Oda İçi Yemek Deneyimi', price: 'Menü fiyatları' }
            ]
          },
          luxury: {
            name: 'Lüks Süit',
            tagline: 'Yeniden Tanımlanmış Şıklık',
            description: [
              'Lüks Süit, rafine zarafetin zirvesini temsil eder. 150 metrekare genişliğindeki bu büyük retreat; ayrı oturma ve yemek alanları, özel çalışma odası ve dünyanın en iyi butik otellerine rakip bir ana yatak odası içermektedir.',
              'Özel İtalyan mobilyaları, özgün sanat eserleri ve el dokuma halılar zamansız bir sofistike atmosfer yaratır. Süit, sabah kahvesi ya da akşam kokteyli eşliğinde nefes kesen şehir manzaralarının tadını çıkarmak için açık oturma alanı bulunan özel bir teras içermektedir.'
            ],
            amenities: [
              'Şehir Manzaralı Özel Teras',
              'Ayrı Oturma ve Yemek Alanları',
              'Özel Çalışma Odası',
              'Tam Donanımlı Mutfak',
              'Şarap Buzdolabı (Stoklananlar)',
              'Bose Surround Ses Sistemi',
              '75" OLED Akıllı TV',
              'Buharlı Duşlu Ana Banyo',
              'İki Kişilik Jakuzi',
              'La Prairie Tuvalet Malzemeleri',
              'Emanet Hizmetli Giyinme Odası',
              'Süit İçi Espresso Bar',
              'Özel Kasa (Mücevher Boyutu)',
              'Günde İki Kez Oda Temizliği'
            ],
            luxuryServicesIncluded: [
              'Şampanyalı Özel Check-in',
              'Karşılama Meyve Sepeti ve Şarap',
              'Çikolatalı Akşam Yataktan Hazırlama',
              'Kişisel Süit Asistanı',
              'Ücretsiz Spa Seansı (60 dk)',
              '24 Saatlik Butler Hizmeti'
            ],
            luxuryServicesExtra: [
              { name: 'Özel Şef Deneyimi', price: '$500' },
              { name: 'Şoför Hizmeti (4 Saat)', price: '$300' }
            ]
          },
          royal: {
            name: 'Kraliyet Süiti',
            tagline: 'Bir Kral Gibi Yaşayın',
            description: [
              'Kraliyet Süiti, özenle tasarlanmış 200 metrekare alana yayılan eşsiz bir konaklama deneyimi sunar. Her biri kendi banyosuna sahip iki yatak odasıyla bu süit; hem birliktelik hem de gizlilik isteyen aileler veya seyahat arkadaşları için mükemmeldir.',
              'Görkemli oturma odası, 3,6 metre yüksekliğindeki tavanları, kristal avizeler ve sekiz kişilik resmi yemek alanıyla öne çıkmaktadır. Seçilmiş kitaplarla dolu özel kütüphane, ev sinema sistemi ve tam donanımlı gurme mutfak bu süiti başlı başına bir destinasyon haline getirir.'
            ],
            amenities: [
              'Özel Banyolu İki Yatak Odası',
              'Görkemli Oturma Odası (3,6m Tavan)',
              'Özel Kütüphane',
              'Ev Sinema Sistemi',
              'Gurme Mutfak',
              '8 Kişilik Resmi Yemek Salonu',
              'Kristal Avizeler',
              'Steinway Piyano',
              'Özel Spor Ekipmanları',
              'İki Ana Banyo',
              'Hermes Tuvalet Malzemeleri',
              'Özel Şarap Mahzeni',
              'Sanat Koleksiyonu',
              'Günde Üç Kez Oda Temizliği'
            ],
            luxuryServicesIncluded: [
              'Kraliyet Karşılama Töreni',
              'Kişisel Süit Büyükelçisi',
              'Sınırsız Mini Bar',
              'Süitte Günlük Kahvaltı',
              'Ücretsiz Spa (2 Saat)'
            ],
            luxuryServicesExtra: [
              { name: 'Özel Yat Charter', price: '$2.000' },
              { name: 'Kişisel Şef (Tam Gün)', price: '$800' },
              { name: 'Helikopter Turu', price: '$1.500' }
            ]
          },
          presidential: {
            name: 'Başkanlık Süiti',
            tagline: 'Dünya Standartlarında Lüksün Zirvesi',
            description: [
              "Başkanlık Süiti, otelimizin sunduğu en seçkin konaklamayı temsil eden 500 metrekareyi kapsayan olağanüstü bir alanda tüm 8. katı kapsamaktadır. Bu efsanevi rezidans; devlet başkanlarına, kraliyet ailelerine ve dünyanın en seçkin gezginlerine ev sahipliği yapmıştır.",
              "Dört ayrı yatak odası süiti; 6 metre yüksekliğindeki tavanları ve 360 derecelik manzarası olan görkemli büyük salonu çevrelemektedir. Süit, özel toplantı odası, profesyonel mutfak, tedavi odası bulunan özel spa ile sonsuzluk havuzlu çatı terası içermektedir."
            ],
            amenities: [
              'Tüm Kat (500 m²)',
              'Dört Lüks Yatak Odası Süiti',
              'Özel Toplantı Odası (12 Kişilik)',
              'Profesyonel İkram Mutfağı',
              'Özel Spa ve Tedavi Odası',
              'Çatı Sonsuzluk Havuzu',
              '360 Derecelik Panoramik Manzara',
              'Kuyruklu Piyano (Steinway Concert)',
              'Özel Asansör Erişimi',
              'Müze Kalitesinde Sanat Koleksiyonu',
              'Akıllı Ev Otomasyonu',
              'Özel Şarap Mahzeni (500 Şişe)',
              'Diplomatik Güvenlik Özellikleri',
              '7/24 Özel Personel (6 Kişi)'
            ],
            luxuryServicesIncluded: [
              'Başkanlık Karşılama Protokolü',
              'Kişisel Butler Ekibi (3 Kişi)',
              'Özel Şef',
              'Tüm Yiyecek ve İçecekler',
              'Sınırsız Spa Erişimi',
              'Rolls Royce ve Şoför',
              'Kişisel Güvenlik Koordinasyonu'
            ],
            luxuryServicesExtra: [
              { name: 'Özel Jet Düzenlemeleri', price: 'İstek üzerine' }
            ]
          }
        }
      },
      services: {
        hero: {
          title: 'Premium Hizmetler',
          subtitle: 'Olağanüstü olanaklar ve kişiselleştirilmiş hizmet'
        },
        items: {
          dining: { name: 'Fine Dining', desc: 'Dünya standartlarında restoranlar' },
          spa: { name: 'Spa ve Wellness', desc: 'Lüks bakımlar' },
          gym: { name: 'Fitness Merkezi', desc: '7/24 erişim' },
          pool: { name: 'Sonsuzluk Havuzu', desc: 'Çatı cenneti' },
          chauffeur: { name: 'Şoför Hizmeti', desc: 'Özel ulaşım' },
          concierge: { name: 'Concierge', desc: '7/24 yardım' },
          store: { name: 'Otel Mağazası', desc: 'Premium ürünler ve hediyeler' }
        }
      },
      market: {
        hero: {
          title: 'Otel Mağazası',
          subtitle: 'Misafirlerimiz için premium ürünler ve özel ürünler'
        },
        categories: {
          all: 'Tüm Ürünler',
          snacks: 'Atıştırmalıklar ve İçecekler',
          biscuits: 'Bisküviler',
          chips: 'Cipsler',
          drinks: 'İçecekler',
          candy: 'Şekerlemeler',
          toiletries: 'Kişisel Bakım',
          souvenirs: 'Hatıralar',
          luxury: 'Lüks Ürünler'
        },
        loading: 'Ürünler yükleniyor...',
        empty: 'Bu kategoride ürün bulunamadı.',
        product: {
          addToCart: 'Sepete Ekle',
          outOfStock: 'Stokta Yok',
          inStock: 'Stokta Var'
        },
        cart: {
          title: 'Sepetiniz',
          empty: 'Sepetiniz boş',
          total: 'Toplam',
          checkout: 'Sipariş Ver',
          remove: 'Kaldır',
          clientName: 'Adınız',
          roomNumber: 'Oda Numarası',
          notes: 'Özel Notlar',
          placeOrder: 'Sipariş Ver',
          orderSuccess: 'Sipariş başarıyla verildi!',
          orderNote: 'Siparişiniz kısa sürede odanıza teslim edilecektir.'
        }
      },
      premiumServices: {
        hero: {
          title: 'Başkanlık Premium Hizmetleri',
          subtitle: 'Seçkin misafirler için ayrılmış ayrıcalıklar'
        },
        card: {
          requestService: 'Servis Talep Et'
        },
        items: {
          medical: { name: '7/24 Medikal Destek', desc: 'Yerinde hemşire ve sağlık profesyonelleri' },
          butler: { name: 'Kişisel Butler Hizmeti', desc: 'Her ihtiyacınız için özel butler' },
          security: { name: 'VIP Güvenlik Eşliği', desc: 'Profesyonel güvenlik personeli' },
          maintenance: { name: 'Önleyici Bakım', desc: 'Günlük otel sistemleri izleme' },
          carFleet: { name: 'Lüks Araç Filosu', desc: 'Mercedes, Rolls‑Royce, Bentley seçenekleri' },
          helicopter: { name: 'Helikopter Transferleri', desc: 'Özel helipad koordinasyonu' },
          wellness: { name: 'Wellness Programları', desc: 'Zihinsel rahatlama ve yoga' },
          fitnessTrainers: { name: 'Özel Fitness Eğitmenleri', desc: 'Bire bir antrenman seansları' },
          eventPlanning: { name: 'Etkinlik Planlama', desc: 'Lüks düğünler ve kurumsal etkinlikler' },
          businessSupport: { name: 'İş Desteği', desc: 'Diplomatik ve yönetici hizmetleri' }
        }
      },
      roomDetails: {
        rooms: {
          deluxe: { name: 'Deluxe Oda' },
          suite: { name: 'Royal Süit' },
          presidential: { name: 'Başkanlık Süiti' }
        },
        size: 'Boyut: {{size}} m²',
        pricePerNight: '${{price}}/gece',
        actions: {
          reserve: 'Hemen Ayırt'
        },
        confirmation: {
          title: 'Rezervasyon Onaylandı',
          message: 'Lüks konaklamanız rezerve edildi.'
        }
      },
      serviceDetails: {
        items: {
          spa: { name: 'Royal Spa', desc: 'En üst düzey rahatlama ve wellness', hours: '08:00 - 22:00' },
          restaurant: { name: 'Fine Dining', desc: 'Michelin seviyesinde mutfak', hours: '06:00 - 23:00' },
          gym: { name: 'Fitness Merkezi', desc: 'Son teknoloji ekipmanlar', hours: '7/24' },
          pool: { name: 'Çatı Havuzu', desc: 'Manzaralı sonsuzluk havuzu', hours: '06:00 - 22:00' }
        },
        hours: 'Saatler: {{hours}}',
        actions: {
          bookNow: 'Hemen Rezervasyon'
        },
        confirmation: {
          title: 'Rezervasyon Onaylandı',
          message:
            'Rezervasyonunuz başarıyla onaylandı. Presidential Luxury Hotel’i tercih ettiğiniz için teşekkür ederiz.'
        }
      },
      auth: {
        accessEntry: {
          title: 'Kimsiniz?',
          subtitle: 'Devam etmek için erişim yolunuzu seçin.',
          footer: 'Bu sayfada giriş yapılmaz.',
          roles: {
            firstTime: {
              title: 'İlk Kez Misafir',
              subtitle: 'Yeni ziyaretçiler',
              highlight: 'İlk konaklama %20 indirim',
              cta: 'Devam Et'
            },
            returning: {
              title: 'Geri Dönen Misafir',
              subtitle: 'Sadık misafirler',
              highlight: 'Kalıcı %10 sadakat indirimi',
              cta: 'Devam Et'
            },
            staff: {
              title: 'Personel',
              subtitle: 'Operasyon erişimi',
              highlight: 'Çalışma bölümleri ve görevler',
              cta: 'Personel Girişi'
            },
            admin: {
              title: 'Yönetici',
              subtitle: 'Sistem kontrolü',
              highlight: 'Tam yönetim yetkisi',
              cta: 'Yönetici Girişi'
            }
          }
        },
        guestNew: {
          title: 'İlk Kez Misafir',
          subtitle: 'Hesabınızı oluşturun ve %20 ilk konaklama indiriminin kilidini açın',
          fields: {
            fullName: 'Tam adınız',
            email: 'E-posta',
            password: 'Şifre',
            phone: 'Telefon numarası (opsiyonel)',
            preferences: 'Özel tercihler (opsiyonel)'
          },
          cta: 'Devam Et',
          footer: 'Zaten kayıtlı mısınız?',
          footerLink: 'Geri dönen misafir olarak giriş yapın',
          errors: {
            invalidEmail: 'Lütfen geçerli bir e-posta girin',
            invalidPassword: 'Şifre en az 6 karakter olmalıdır',
            invalidName: 'Lütfen tam adınızı girin',
            loginFailed: 'Kayıt başarısız. Lütfen tekrar deneyin.'
          }
        },
        guestReturning: {
          title: 'Geri Dönen Misafir',
          subtitle: 'Giriş yapın ve kalıcı %10 sadakat indiriminizin tadını çıkarın',
          fields: {
            email: 'E-posta',
            password: 'Şifre',
            loyaltyId: 'Sadakat ID (opsiyonel)'
          },
          cta: 'Giriş Yap',
          footer: 'Burada yeni misiniz?',
          footerLink: 'İlk kez misafir hesabı oluşturun',
          errors: {
            invalidCredentials: 'Geçersiz e-posta veya şifre',
            loginFailed: 'Giriş başarısız. Lütfen tekrar deneyin.'
          }
        },
        staff: {
          title: 'Personel Erişimi',
          subtitle: 'Otel personeli için operasyonel giriş',
          fields: {
            staffId: 'Personel ID',
            pin: 'PIN'
          },
          cta: 'Giriş Yap',
          errors: {
            invalidCredentials: 'Geçersiz Personel ID veya PIN',
            loginFailed: 'Giriş başarısız. Lütfen tekrar deneyin.'
          }
        },
        admin: {
          title: 'Yönetici',
          subtitle: 'Yetkili kontrol paneli erişimi',
          fields: {
            username: 'Kullanıcı adı',
            password: 'Şifre'
          },
          cta: 'Gir',
          errors: {
            invalidCredentials: 'Geçersiz kullanıcı adı veya şifre',
            loginFailed: 'Giriş başarısız. Lütfen tekrar deneyin.'
          }
        },
        backToSelection: 'Rol seçimine geri dön'
      }
    },
    about: {
      hero: { title: 'PLHMS Hakkında', subtitle: 'Başkanlık Lüks Otel Yönetim Sistemi' },
      story: { title: 'Hikayemiz', body: 'PLHMS, son teknoloji ile zamansız zarafeti birleştiren lüks konaklama yönetiminin zirvesini temsil eder. 11 katlı tesisimiz, dünyanın dört bir yanından seçkin misafirlere eşsiz bir deneyim sunar.' },
      facilities: { title: 'Tesislerimiz', rooms: { title: '300+ Lüks Oda', desc: 'Standart odalardan başkanlık süitlerine' }, dining: { title: 'Michelin Yemek Deneyimi', desc: 'Dünya standartlarında restoranlar ve barlar' }, spa: { title: 'Spa ve Wellness', desc: 'Kapsamlı wellness ve rahatlama tesisleri' }, helipad: { title: 'Helipad Hizmetleri', desc: 'Özel helikopter transferi' } },
      commitment: { title: 'Taahhüdümüz', body: 'Her misafir için olağanüstü hizmet sunmaya ve unutulmaz deneyimler yaratmaya kararlıyız. Adanmış profesyonellerden oluşan ekibimiz, konforunuz ve memnuniyetiniz için gece gündüz çalışır.' }
    },
    contact: {
      hero: { title: 'İletişim', subtitle: 'Sorularınızı yanıtlamak için buradayız' },
      info: { title: 'Bize Ulaşın', phone: 'Telefon', email: 'E-posta', address: 'Adres', hours: 'Çalışma Saatleri', phoneValue: '+1 (555) 123-4567', addressValue: 'Cumhurbaşkanlığı Caddesi, Lüks Bölgesi', hoursValue: '24/7 - Her zaman hizmetinizdeyiz' },
      form: { title: 'Bize Mesaj Gönderin', name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon', subject: 'Konu', message: 'Mesaj', submit: 'Mesaj Gönder' },
      success: 'Teşekkürler! En kısa sürede size geri döneceğiz.'
    },
    faqs: {
      hero: { title: 'Sık Sorulan Sorular', subtitle: 'Otelimiz hakkında sık sorulan sorulara cevap bulun' },
      q1: { question: 'Giriş ve çıkış saatleri nelerdir?', answer: 'Giriş saat 15:00, çıkış saat 12:00\'dır. Erken giriş ve geç çıkış talep üzerine ve müsaitliğe göre yapılabilir.' },
      q2: { question: 'Havalimanı transferi sunuyor musunuz?', answer: 'Evet, misafirlerimize ücretsiz havalimanı servisi sunuyoruz. VIP misafirler için helikopter hizmeti de mevcuttur.' },
      q3: { question: 'Otopark mevcut mu?', answer: 'Evet, vale park ve kendi kendinize park seçeneklerimiz mevcuttur. Otel misafirleri için otopark ücretsizdir.' },
      q4: { question: 'Hangi yemek seçenekleri mevcut?', answer: 'Michelin yıldızlı restoran, gündelik yemek, 7/24 oda servisi ve çatı barı dahil birden fazla yemek seçeneğimiz bulunmaktadır.' },
      q5: { question: 'Spa ve wellness tesisleriniz var mı?', answer: 'Evet, 9. Kattaki lüks spa ve wellness merkezimiz kapsamlı tedaviler ve tesisler sunmaktadır.' },
      q6: { question: 'Rezervasyonumu iptal edebilir veya değiştirebilir miyim?', answer: 'Girişten 48 saat öncesine kadar iptal ve değişiklik kabul edilmektedir. Yardım için rezervasyon ekibimizle iletişime geçin.' },
      q7: { question: 'Evcil hayvanlar kabul ediliyor mu?', answer: 'Evet, evcil hayvan dostuyuz. Önceden bilgi vermenizi rica ederiz. Ek ücret uygulanabilir.' },
      q8: { question: 'Misafirler için indirim politikaları nelerdir?', answer: 'İlk kez gelen misafirler %20, dönen misafirler tüm rezervasyonlarda %10 indirim alır.' },
      contact: { title: 'Hâlâ Sorularınız mı Var?', subtitle: 'Ekibimiz 7/24 yardımcı olmak için burada' }
    },
    servicesIndex: {
      hero: { title: '✨ Otel Hizmetleri', subtitle: 'Premium hizmetlerimizle lüksü yaşayın' },
      explore: 'Keşfet →',
      services: {
        restaurant: { name: 'Restoran ve Mutfak', description: 'Michelin yıldızlı mutfakla fine dining deneyimi', features: ['Gurme Mutfak', 'Özel Yemek', 'Şarap Mahzeni', '7/24 Oda Servisi'], price: 'À la carte' },
        market: { name: 'Otel Marketi', description: 'Odanıza teslim edilen premium atıştırmalıklar, içecekler ve ihtiyaçlar', features: ['Taze Ürünler', 'Oda Teslimatı', 'Uluslararası Seçim', '7/24 Açık'], price: 'Çeşitli' },
        spa: { name: 'Spa ve Wellness', description: 'Lüks spa tedavileriyle nihai rahatlama', features: ['İsveç Masajı', 'Derin Doku', 'Sıcak Taş Terapisi', 'Aromaterapi'], price: '150 dolardan itibaren' },
        gym: { name: 'Fitness Merkezi', description: 'Son teknoloji ekipman ve kişisel antrenman hizmetleri', features: ['Modern Ekipman', 'Kişisel Antrenörler', '7/24 Erişim', 'Fitness Dersleri'], price: '50 dolar/günden itibaren' },
        pool: { name: 'Havuz ve Su Sporları', description: 'Muhteşem panoramik manzaralı berrak sonsuz havuzlar', features: ['Sonsuz Havuz', 'Özel Havuz Süitleri', 'Yüzme Dersleri', 'Havuz Başı Hizmet'], price: '40 dolar/saatten itibaren' },
        driver: { name: 'Özel Şoför', description: 'Lüks araçlarla profesyonel şoför hizmeti', features: ['Havalimanı Transferleri', 'Şehir Turları', 'Lüks Araçlar', 'Çok Dilli Şoförler'], price: '100 dolardan itibaren' },
        butler: { name: 'Kişisel Butler', description: 'Her ihtiyacınız için özel kişisel yardım', features: ['7/24 Müsaitlik', 'Kişisel Alışveriş', 'Etkinlik Planlaması', 'VIP Concierge'], price: '200 dolardan itibaren' }
      }
    },
    spa: {
      hero: { title: '💆 Spa ve Masaj', subtitle: 'Nihai rahatlama ve yenilenmeyi yaşayın' },
      steps: { 1: 'Hizmet Seçin', 2: 'Tercihleriniz', 3: 'Bilgileriniz' },
      step1: { title: 'Tedavinizi Seçin', sessionType: 'Oturum Türü', duration: 'Süre', location: 'Konum', date: 'Tercih Edilen Tarih', time: 'Tercih Edilen Saat', selectTime: 'Saat seçin', estimatedTotal: 'Tahmini Toplam:' },
      step2: { title: 'Tercihleriniz', desc: 'Deneyiminizi kişiselleştirmemize yardımcı olun', experienceQuestion: 'Daha önce masaj deneyiminiz var mı?', experience: 'Spa Deneyimi', experienceYes: 'Evet', experienceNo: 'Hayır, İlk Kez', goal: 'Oturum Hedefi', goalPlaceholder: 'Örn: Rahatlamak', goalOptions: ['Rahatlama', 'Ağrı Kesimi', 'Rehabilitasyon', 'Daha İyi Uyku', 'Stres Azaltma'], focusAreas: 'Odak Bölgeler (tümünü seçin)', medicalIssues: 'Tıbbi Durumlar', pressure: 'Baskı Tercihi', pressureLight: 'Çok Hafif', pressureSoft: 'Hafif', pressureMedium: 'Orta', pressureFirm: 'Güçlü', pressureDeep: 'Derin', therapist: 'Terapist Tercihi', therapistMale: 'Erkek', therapistFemale: 'Kadın', therapistNoPreference: 'Fark Etmez', style: 'Oturum Atmosferi', styleSilent: 'Sessiz', styleMusic: 'Hafif Müzik', styleNature: 'Doğa Sesleri' },
      step3: { title: 'Bilgileriniz', name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon', notes: 'Ek Notlar', yourRoom: 'Odanız', autoLinked: 'Otomatik Bağlı', bookingSummary: 'Rezervasyon Özeti', service: 'Hizmet:', duration: 'Süre:', location: 'Konum:', dateTime: 'Tarih ve Saat:', total: 'Toplam:', at: 'saat' },
      sessionTypes: { relaxation: { label: 'Rahatlama Masajı', desc: 'Gerilimi azaltan nazik hareketler' }, deep_tissue: { label: 'Derin Doku', desc: 'Kas rahatlama için yoğun baskı' }, hot_stone: { label: 'Sıcak Taş Terapisi', desc: 'Derin rahatlama için ısıtılmış taşlar' }, aromatherapy: { label: 'Aromaterapi', desc: 'Zihin ve beden için uçucu yağlar' }, couples: { label: 'Çift Masajı', desc: 'İki kişi için romantik deneyim' } },
      durations: { '30min': '30 Dakika', '60min': '60 Dakika', '90min': '90 Dakika', '120min': '120 Dakika' },
      locations: { spa_room: 'Spa Tedavi Odası', private_suite: 'Özel Lüks Süit', in_room: 'Oda Hizmeti' },
      focusAreas: ['Boyun', 'Omuzlar', 'Üst Sırt', 'Alt Sırt', 'Bacaklar', 'Ayaklar', 'Kollar', 'Tüm Vücut'],
      medicalIssues: ['Yok', 'Önceki Yaralanma', 'Kronik Ağrı', 'Cilt Hassasiyeti', 'Hamilelik', 'Kalp Rahatsızlığı', 'Diğer'],
      success: { title: 'Rezervasyon Onaylandı!', service: 'Hizmet', serviceValue: 'Spa ve Masaj', type: 'Tür', date: 'Tarih', time: 'Saat', duration: 'Süre', total: 'Toplam', confirmation: 'Onay e-postası gönderildi', backToServices: 'Hizmetlere Dön' },
      from: 'İtibaren $', next: 'İleri →', back: '← Geri', confirm: 'Rezervasyonu Onayla', processing: 'İşleniyor…', price: 'Tahmini Fiyat', continue: 'Devam Et →'
    },
    gym: {
      hero: { title: '💪 Fitness Merkezi', subtitle: 'Son teknoloji ekipman ve kişisel antrenman' },
      steps: { 1: 'Paket Seçin', 2: 'Profiliniz', 3: 'Bilgileriniz' },
      step1: { title: 'Paketinizi Seçin', duration: 'Süre', trainer: 'Kişisel Antrenör', trainerYes: 'Evet (+80 dolar/gün)', trainerNo: 'Hayır', date: 'Başlangıç Tarihi', hours: 'Günlük Saatler', hoursPlaceholder: 'Örn: 2', estimatedTotal: 'Tahmini Toplam:' },
      step2: { title: 'Fitness Profiliniz', desc: 'Fitness geçmişiniz hakkında bilgi verin', goal: 'Antrenman Hedefi', goalOptions: ['Yağ Yakımı', 'Kilo Alma', 'Kas Yapımı', 'Genel Fitness', 'Güç', 'Dayanıklılık'], goalPlaceholder: 'Örn: Kilo vermek', age: 'Yaş', height: 'Boy (cm)', weight: 'Kilo (kg)', weeklyHours: 'Haftalık Antrenman Saatleri', weeklyOptions: ['0–2 saat', '2–5 saat', '5–10 saat', '10+ saat'], experience: 'Deneyim Seviyesi', experienceBeginner: 'Başlangıç', experienceIntermediate: 'Orta', experienceAdvanced: 'İleri', experienceProfessional: 'Profesyonel', injuries: 'Önceki Yaralanmalar (tümünü seçin)', preferredTime: 'Tercih Edilen Antrenman Zamanı', timeMorning: 'Sabah (06–10)', timeMidday: 'Öğle (10–14)', timeAfternoon: 'Öğleden Sonra (14–18)', timeEvening: 'Akşam (18–22)' },
      step3: { title: 'İletişim Bilgileri', name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon', room: 'Oda Numarası', notes: 'Özel İstekler', bookingSummary: 'Rezervasyon Özeti', package: 'Paket:', trainer: 'Antrenör:', total: 'Toplam:', dateLabel: 'Başlangıç Tarihi:' },
      dayOptions: { '1': '1 Gün', '3': '3 Gün', '7': '1 Hafta', '14': '2 Hafta', '30': '1 Ay' },
      injuries: ['Yok', 'Sırt', 'Diz', 'Omuz', 'Ayak Bileği', 'Bilek', 'Boyun', 'Kalça'],
      success: { title: 'Rezervasyon Onaylandı!', backToServices: 'Hizmetlere Dön' },
      next: 'İleri →', back: '← Geri', confirm: 'Rezervasyonu Onayla', processing: 'İşleniyor…', price: 'Tahmini Fiyat', continue: 'Devam Et →'
    },
    pool: {
      hero: { title: '🏊 Havuz ve Su Sporları', subtitle: 'Berrak lükse dalın' },
      steps: { 1: 'Paket Seçin', 2: 'Tercihleriniz', 3: 'Bilgileriniz' },
      step1: { title: 'Havuz Deneyiminizi Seçin', poolType: 'Havuz Türü', duration: 'Süre', coach: 'Yüzme Koçu', coachYes: 'Evet (+60 dolar)', coachNo: 'Hayır', date: 'Tarih', time: 'Saat', people: 'Kişi Sayısı', estimatedTotal: 'Tahmini Toplam:' },
      step2: { title: 'Tercihleriniz', desc: 'Havuz deneyiminizi kişiselleştirmenize yardımcı olun', ability: 'Yüzme Seviyesi', abilityBeginner: 'Başlangıç', abilityIntermediate: 'Orta', abilityAdvanced: 'İleri', goal: 'Oturum Hedefi', goalPlaceholder: 'Örn: Rahatlama, fitness', goalOptions: ['Yüzme Öğrenme', 'Rahatlama', 'Egzersiz', 'Terapi', 'Aile Eğlencesi', 'Havuz Yüzmesi'], temperature: 'Su Sıcaklığı', tempCool: 'Serin', tempModerate: 'Ilık', tempWarm: 'Sıcak', preferredTime: 'Tercih Edilen Saat' },
      step3: { title: 'İletişim Bilgileri', name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon', room: 'Oda Numarası', notes: 'Özel İstekler', bookingSummary: 'Rezervasyon Özeti', poolType: 'Havuz Türü:', duration: 'Süre:', coach: 'Koç:', date: 'Tarih ve Saat:', total: 'Toplam:' },
      poolTypes: { shared: { label: 'Ortak Havuz', desc: 'Ana havuz alanına erişim' }, private: { label: 'Özel Havuz', desc: 'Özel havuz süiti' } },
      durations: { '1hour': '1 Saat', '2hours': '2 Saat', half_day: 'Yarım Gün', full_day: 'Tam Gün' },
      success: { title: 'Rezervasyon Onaylandı!', backToServices: 'Hizmetlere Dön' },
      next: 'İleri →', back: '← Geri', confirm: 'Rezervasyonu Onayla', processing: 'İşleniyor…', price: 'Tahmini Fiyat', continue: 'Devam Et →'
    },
    butler: {
      hero: { title: '🎩 Kişisel Butler', subtitle: 'Her ihtiyacınız için özel kişisel yardım' },
      steps: { 1: 'Hizmet Seçin', 2: 'Tercihleriniz', 3: 'Bilgileriniz' },
      step1: { title: 'Butler Hizmetinizi Seçin', serviceType: 'Hizmet Türü', duration: 'Süre', language: 'Tercih Edilen Dil', date: 'Tarih', time: 'Saat', estimatedTotal: 'Tahmini Toplam:' },
      step2: { title: 'Hizmet Tercihleri', desc: 'Butler deneyiminizi özelleştirin', interaction: 'Etkileşim Seviyesi', interactionMinimal: 'Minimum', interactionModerate: 'Orta', interactionVerbose: 'Yüksek Etkileşim', style: 'Hizmet Stili', styleFormal: 'Resmi ve Geleneksel', styleCasual: 'Sıcak ve Samimi', styleDiscrete: 'Sessiz ve Verimli', leaving: 'Otelden Çıkış', leavingYes: 'Evet, eşlik gerekli', leavingNo: 'Hayır, yalnızca otel içi', leavingMaybe: 'Belki / Esnek', tasks: 'Gerekli Görevler (tümünü seçin)' },
      step3: { title: 'İletişim Bilgileri', name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon', room: 'Oda Numarası', notes: 'Özel İstekler', bookingSummary: 'Rezervasyon Özeti', service: 'Hizmet:', duration: 'Süre:', date: 'Tarih ve Saat:', total: 'Toplam:' },
      serviceTypes: { basic: { label: 'Temel Yardım', desc: 'Genel yardım ve errandlar' }, premium: { label: 'Premium Butler', desc: 'Özel kişisel hizmet' }, exclusive: { label: 'Özel Concierge', desc: 'VIP tam hizmet deneyimi' } },
      durations: { '2hours': '2 Saat', '4hours': '4 Saat', half_day: 'Yarım Gün', full_day: 'Tam Gün' },
      taskOptions: ['Bavul Açma/Kapama', 'Gardırop Düzenleme', 'Restoran Rezervasyonları', 'Etkinlik Biletleri', 'Alışveriş Yardımı', 'Kişisel İşler', 'Seyahat Düzenlemeleri', 'Toplantı Koordinasyonu', 'Özel Etkinlik Kurulumu', 'Kişisel Alışveriş'],
      languageLabels: { english: 'İngilizce', arabic: 'Arapça', french: 'Fransızca', spanish: 'İspanyolca', german: 'Almanca', italian: 'İtalyanca', russian: 'Rusça', chinese: 'Çince' },
      success: { title: 'Rezervasyon Onaylandı!', backToServices: 'Hizmetlere Dön' },
      next: 'İleri →', back: '← Geri', confirm: 'Rezervasyonu Onayla', processing: 'İşleniyor…', price: 'Tahmini Fiyat', continue: 'Devam Et →'
    },
    driver: {
      hero: { title: '🚗 Özel Şoför', subtitle: 'Lüks araçlarla profesyonel şoför hizmeti' },
      steps: { 1: 'Gezi Seçin', 2: 'Gezi Detayları', 3: 'Bilgileriniz' },
      step1: { title: 'Yolculuğunuzu Seçin', tripType: 'Gezi Türü', carType: 'Araç', date: 'Tarih', time: 'Saat', duration: 'Saatler (saatlik için)', serviceType: 'Hizmet Seviyesi', language: 'Şoför Dili', estimatedTotal: 'Tahmini Toplam:' },
      step2: { title: 'Gezi Detayları', desc: 'Yolculuğunuz hakkında daha fazla bilgi verin', serviceLevel: 'Hizmet Seviyesi', serviceLevelOneWay: 'Tek Yönlü Transfer', serviceLevelRound: 'Gidiş-Dönüş', serviceLevelDisposal: 'Tam Gün Emre Amade', style: 'Şoför Stili', styleFormal: 'Resmi ve Profesyonel', styleFriendly: 'Samimi ve Konuşkan', styleSilent: 'Sessiz ve Ayrık', purpose: 'Gezi Amacı', purposeOptions: ['Havalimanı Transferi', 'İş Toplantıları', 'Turizm ve Gezinti', 'Alışveriş', 'Özel Etkinlik', 'Diğer'], waiting: 'Bekleme Süresi', waitingNone: 'Beklemeye gerek yok', waiting30min: '30 dakikaya kadar', waiting1hour: '1 saate kadar', waitingFlexible: 'Esnek / Çağrı üzerine', pickup: 'Alış Yeri', dropoff: 'Bırakış Yeri', pickupPlaceholder: 'Örn: Otel lobisi', dropoffPlaceholder: 'Örn: Havalimanı terminali', hourlyLabel: 'Saat Sayısı', hourlyPlaceholder: 'Saat seçin', language: 'Şoför Dili' },
      step3: { title: 'İletişim Bilgileri', name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon', room: 'Oda Numarası', notes: 'Özel İstekler', bookingSummary: 'Rezervasyon Özeti', vehicle: 'Araç:', trip: 'Gezi Türü:', date: 'Tarih ve Saat:', total: 'Toplam:', from: 'Nereden:', to: 'Nereye:' },
      tripTypes: { airport_transfer: { label: 'Havalimanı Transferi', desc: 'Havalimanına/Havalimanından' }, city_tour: { label: 'Şehir Turu', desc: 'Rehberli şehir keşfi' }, full_day: { label: 'Tam Gün Kiralama', desc: '8+ saat hizmet' }, hourly: { label: 'Saatlik Hizmet', desc: 'Saatlik rezervasyon' } },
      carTypes: { sedan: { label: 'Executive Sedan', desc: 'Mercedes E-Class veya benzeri' }, suv: { label: 'Lüks SUV', desc: 'Range Rover veya benzeri' }, luxury: { label: 'Premium Lüks', desc: 'Mercedes S-Class veya benzeri' }, limousine: { label: 'Limuzin', desc: 'Uzatılmış limuzin' } },
      languageLabels: { english: 'İngilizce', arabic: 'Arapça', french: 'Fransızca', spanish: 'İspanyolca', german: 'Almanca', italian: 'İtalyanca', russian: 'Rusça', chinese: 'Çince' },
      success: { title: 'Rezervasyon Onaylandı!', backToServices: 'Hizmetlere Dön' },
      next: 'İleri →', back: '← Geri', confirm: 'Rezervasyonu Onayla', processing: 'İşleniyor…', price: 'Tahmini Fiyat', continue: 'Devam Et →'
    },
    admin: {
      tabs: { dashboard: 'Panel', bookings: 'Rezervasyonlar', clients: 'Müşteriler', rooms: 'Odalar', store: 'Mağaza', orders: 'Siparişler', services: 'Hizmetler', activity: 'Aktivite', settings: 'Ayarlar' },
      floors: { b2: 'Bodrum 2', b1: 'Bodrum 1', g: 'Zemin Kat', f1: '1. Kat', f2: '2. Kat', f3: '3. Kat', f4: '4. Kat', f5: '5. Kat', f6: '6. Kat', f7: '7. Kat', f8: '8. Kat', f9: '9. Kat', f10: '10. Kat', f11: '11. Kat' },
      messages: { roomAdded: 'Oda başarıyla eklendi', roomUpdated: 'Oda başarıyla güncellendi', roomDeleted: 'Oda başarıyla silindi', storeItemAdded: 'Ürün başarıyla eklendi', storeItemUpdated: 'Ürün başarıyla güncellendi', storeItemDeleted: 'Ürün başarıyla silindi', bookingCancelled: 'Rezervasyon başarıyla iptal edildi', settingsSaved: 'Ayarlar başarıyla kaydedildi', passwordChanged: 'Şifre başarıyla değiştirildi' },
      confirm: { deleteRoom: 'Bu odayı silmek istediğinizden emin misiniz?', deleteItem: 'Bu öğeyi silmek istediğinizden emin misiniz?', cancelBooking: 'Bu rezervasyonu iptal etmek istediğinizden emin misiniz?' },
      labels: { addRoom: 'Oda Ekle', editRoom: 'Oda Düzenle', addProduct: 'Ürün Ekle', editProduct: 'Ürün Düzenle', roomNumber: 'Oda Numarası', floor: 'Kat', type: 'Tür', price: 'Fiyat / Gece', capacity: 'Kapasite', status: 'Durum', description: 'Açıklama', images: 'Görsel URL\'leri', features: 'Özellikler', amenities: 'Olanaklar', save: 'Kaydet', cancel: 'İptal', delete: 'Sil', edit: 'Düzenle', search: 'Ara', filterBy: 'Filtrele', allBookings: 'Tümü', active: 'Aktif', completed: 'Tamamlandı', cancelled: 'İptal Edildi' }
    },
    luxuryAuth: {
      brand: 'Presidential Royal Palace Hotel',
      leftHeadline: 'Mükemmellik\nKonforla Buluşuyor',
      leftSub: 'Eşsiz lüksü deneyimleyin. Varışınızdan ayrılışınıza kadar her detay sizin için özenle tasarlandı.',
      badge1: '★ Forbes 5 Yıldız', badge2: '60 Lüks Oda', badge3: 'Cumhurbaşkanlığı Süitleri',
      quote: '"Hayatın en güzel deneyimleri, onları arayanlar için saklıdır."',
      back: 'Geri',
      optional: '(isteğe bağlı)', orContinueWith: 'veya şununla devam et',
      tabs: { signIn: 'Giriş Yap', createAccount: 'Hesap Oluştur' },
      login: { title: 'Tekrar Hoş Geldiniz', subtitle: 'Lüks hesabınıza giriş yapın', email: 'E-posta Adresi', emailPlaceholder: 'e-posta@adresiniz.com', password: 'Şifre', passwordPlaceholder: 'Şifrenizi girin', rememberMe: 'Beni hatırla', forgotPassword: 'Şifremi unuttum?', submit: '✦ Giriş Yap', submitting: 'Giriş yapılıyor…', noAccount: 'Hesabınız yok mu?', createOne: 'Oluşturun', successMsg: 'Tekrar hoş geldiniz, {{name}}! Yönlendiriliyorsunuz…' },
      register: { title: 'Lüks Deneyiminizi\nOluşturun', subtitle: 'Bugün cumhurbaşkanlığı üyeliğine katılın', firstName: 'Ad', lastName: 'Soyad', email: 'E-posta Adresi', emailPlaceholder: 'e-posta@adresiniz.com', phone: 'Telefon', password: 'Şifre', passwordPlaceholder: 'Min. 8 karakter', confirmPassword: 'Şifreyi Onayla', confirmPlaceholder: 'Şifrenizi tekrarlayın', passwordsMatch: '✓ Şifreler eşleşiyor', termsAgree: 'Kabul ediyorum', termsOf: 'Kullanım Şartları', and: 've', privacyPolicy: 'Gizlilik Politikası', submit: '✦ Hesap Oluştur', submitting: 'Hesap oluşturuluyor…', haveAccount: 'Zaten hesabınız var mı?', signIn: 'Giriş yapın', successMsg: 'Hesap oluşturuldu! Lüks deneyiminiz hazırlanıyor…' },
      strength: { weak: 'Zayıf', fair: 'Orta', good: 'İyi', strong: 'Güçlü' },
      errors: { validEmail: 'Lütfen geçerli bir e-posta adresi girin.', passwordMin6: 'Şifre en az 6 karakter olmalıdır.', passwordMin8: 'Şifre en az 8 karakter olmalıdır.', fullName: 'Lütfen tam adınızı girin.', passwordsMatch: 'Şifreler eşleşmiyor.', termsRequired: 'Devam etmek için Kullanım Şartlarını kabul edin.', connectionError: 'Bağlantı hatası. Lütfen ağınızı kontrol edin ve tekrar deneyin.', invalidCredentials: 'Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.', registrationFailed: 'Kayıt başarısız. Lütfen tekrar deneyin.', fieldTooShort: 'Çok kısa', fieldInvalidEmail: 'Lütfen geçerli bir e-posta girin', fieldPassword6: 'En az 6 karakter gerekli', fieldPassword8: 'En az 8 karakter gerekli', fieldPasswordsMatch: 'Şifreler eşleşmiyor' }
    },
    forgotPassword: {
      leftHeadline: 'Güvenli &\nGüvenilir', leftSub: 'Hesap güvenliğiniz bizim en yüksek önceliğimizdir. Erişiminizi güvenli ve hızlı şekilde yeniden kazanmanıza yardımcı olacağız.', quote: '"Gizliliğiniz bizim kutsal taahhüdümüzdür."',
      title: 'Şifre Sıfırla', subtitle: 'Güvenli sıfırlama bağlantısı almak için e-postanızı girin', emailLabel: 'E-posta Adresi', emailPlaceholder: 'e-posta@adresiniz.com', sendButton: '✦ Sıfırlama Bağlantısı Gönder', sending: 'Gönderiliyor…', rememberedPassword: 'Şifrenizi hatırladınız mı?', signIn: 'Giriş yapın', successTitle: 'Gelen Kutunuzu Kontrol Edin', successSubtitle: 'Şifre sıfırlama bağlantısı gönderildi:', didntReceive: 'Almadınız mı? Spam klasörünüzü kontrol edin veya', tryAgain: 'tekrar deneyin', backToSignIn: '← Girişe Dön', invalidEmail: 'Lütfen geçerli bir e-posta adresi girin.'
    },
    floorPages: {
      f0: {
        heroBadge: 'Kat 0', heroTitle: 'Büyük Lobi ve Resepsiyon', heroDesc: 'Cumhurbaşkanlığı lüksüne açılan kapınız — mermer sütunlar, kristal avizeler ve kapalı bir botanik bahçe içeren mimari bir başyapıt',
        overviewTitle: 'Zarafetin Kalbi',
        stats: ['m² Alan', '7/24 Concierge', 'Perakende Outlet', 'İç Bahçe'],
        areasTitle: 'Lobi Alanları',
        areas: [{ name: 'Büyük Giriş', desc: 'Mermer sütunlarla törensel varış' }, { name: 'Resepsiyon', desc: '7/24 Concierge ve Check-in Hizmetleri' }, { name: 'Lüks Lounge', desc: 'Şehir manzaralı premium oturma alanı' }, { name: 'İç Bahçe', desc: 'Şelale ile botanik cenneti' }, { name: 'Butik Mağazalar', desc: 'Lüks perakende mağazalar' }, { name: 'Kafe & Bar', desc: 'El yapımı kahve ve premium içecekler' }],
        featuresTitle: 'Seçkin Özellikler',
        features: ['Kristal Avizeli Üç Katlı Tavan', 'İtalyan Mermer Döşeme', 'Özel VIP Check-in Alanı', 'Döviz ve Seyahat Masası', 'Lüks Araç Kiralama Hizmetleri', 'Bagaj ve Kapıcı Hizmetleri', 'İş Merkezi Erişimi', 'İç Şelale'],
        closingTitle: 'İlk İzlenimler Önemlidir', closingText: 'Büyük Lobimiz, cumhurbaşkanlığı deneyiminizin tonunu belirliyor. Kapımızdan ilk adımı attığınız andan itibaren zarif bir atmosfere bürünürsünüz. Muhteşem kristal avize ve iç şelalenin sakinleştirici sesleriyle süslenen üç katlı atrium, lüks yaşama unutulmaz bir karşılama sunuyor.'
      },
      f1: {
        heroBadge: 'Kat 1', heroTitle: 'Mutfak Mükemmeliyeti', heroDesc: 'Uluslararası mutfak, el yapımı kafeler ve özel VIP loungelar ile dünya standartlarında yemek destinasyonları',
        overviewTitle: 'Yemek Deneyimi',
        stats: ['Restoran', 'Usta Şef', 'Toplam Kapasite', 'Yıldız Derecelendirmesi'],
        areasTitle: 'Yemek Mekanları',
        areas: [{ name: 'Ana Restoran', cuisine: 'Uluslararası Mutfak', capacity: '200 kişilik', hours: '06:00 - 23:00' }, { name: 'Café Royale', cuisine: 'Kafe & Pastane', capacity: '80 kişilik', hours: '7/24' }, { name: 'VIP Lounge', cuisine: 'Premium Yemek', capacity: '50 kişilik', hours: '12:00 - 02:00' }, { name: 'Kahvaltı Salonu', cuisine: 'Büfe & Á la carte', capacity: '150 kişilik', hours: '06:00 - 12:00' }],
        featuresTitle: 'Özel Özellikler',
        features: ['Michelin Yıldızlı Şef Menüleri', 'Özel Yemek Odaları Mevcut', 'İç ve Dış Mekan Oturma Alanları', '500+ Premium Etiketli Şarap Mahzeni', 'Canlı Müzik ve Eğlence', 'Özel Diyet Düzenlemeleri']
      },
      f2: {
        heroBadge: 'Kat 2', heroTitle: 'Etkinlikler ve Konferanslar', heroDesc: 'Düğünler, konferanslar ve kurumsal toplantılar için son teknoloji tesislerle donatılmış sofistike etkinlik alanları',
        overviewTitle: 'Dünya Standartlarında Etkinlik Tesisleri',
        stats: ['m² Alan', 'Maks. Kapasite', 'Etkinlik Alanı', 'Teknoloji Donanımlı'],
        areasTitle: 'Etkinlik Alanları',
        areas: [{ name: 'Büyük Düğün Salonu', capacity: '500 misafir', size: '800 m²' }, { name: 'Konferans Merkezi', capacity: '300 misafir', size: '500 m²' }, { name: 'Toplantı Odaları', capacity: 'Oda başına 20-50 kişi', size: '8 oda' }, { name: 'VIP Toplantı Süiti', capacity: '30 misafir', size: '200 m²' }],
        featuresTitle: 'Premium Olanaklar',
        features: ['Kristal Avizeler ve Lüks Dekor', 'Gelişmiş Ses-Görüntü Sistemleri', 'Her Yerde Yüksek Hızlı Wi-Fi', 'Profesyonel Etkinlik Planlama Hizmetleri', 'Özelleştirilebilir Işıklandırma ve Sahne', 'Dahili Yemek ve Bar Hizmetleri']
      },
      f3: {
        heroBadge: 'Kat 3', heroTitle: 'Sağlık ve Rekreasyon', heroDesc: 'Spor salonu, spa, havuz ve dinlenme alanları dahil kapsamlı wellness tesisleriyle zihin, beden ve ruhu yenileyin',
        overviewTitle: 'Wellness Sığınağınız',
        stats: ['m² Spor Salonu', 'm² Spa', 'Havuz Uzunluğu', '7/24 Erişim'],
        areasTitle: 'Premium Tesisler',
        areas: [{ name: 'Modern Spor Salonu', size: '400 m²', hours: '7/24' }, { name: 'Kapalı Havuz', size: '25m Olimpik', hours: '06:00 - 22:00' }, { name: 'Lüks Spa', size: '600 m²', hours: '08:00 - 22:00' }, { name: 'Sauna & Buhar Odası', size: '150 m²', hours: '06:00 - 22:00' }],
        featuresTitle: 'Wellness Hizmetleri',
        features: ['Kişisel Antrenman Seansları', 'Yoga ve Meditasyon Dersleri', 'Terapötik Masaj Uygulamaları', 'Yüz ve Vücut Bakımları', 'Hidroterapötik Havuz', 'Dinlenme Loungeları', 'Profesyonel Diyetisyen', 'Spor Tıbbi Danışmanlık']
      },
      f4: {
        heroBadge: 'Kat 4', heroTitle: 'Standart Odalar', heroDesc: 'Modern olanaklara ve lüks konfora sahip seçkin misafirler için zarif döşenmiş standart odalar',
        overviewTitle: 'Rahat Lüks',
        stats: ['Toplam Oda', 'm² Aralığı', 'Yıldız Derecelendirmesi', '7/24 Oda Servisi'],
        areasTitle: 'Oda Kategorileri',
        areas: [{ type: 'Tek Kişilik Oda', number: '401-420', size: '35 m²', status: 'Müsait', features: ['King Yatak', 'Şehir Manzarası', 'Çalışma Masası'] }, { type: 'Çift Kişilik Oda', number: '421-445', size: '45 m²', status: 'Müsait', features: ['İki Yatak', 'Balkon', 'Mini Bar'] }, { type: 'İkiz Oda', number: '446-465', size: '42 m²', status: 'Rezerve', features: ['İkiz Yataklar', 'Bahçe Manzarası', 'Oturma Alanı'] }, { type: 'Superior Oda', number: '466-480', size: '50 m²', status: 'Müsait', features: ['Premium Olanaklar', 'Büyük Banyo', 'Deniz Manzarası'] }],
        featuresTitle: 'Oda Özellikleri',
        features: ['Premium Yatak Takımı ve Çarşaflar', 'Uluslararası Kanallarla Akıllı TV', 'Yüksek Hızlı Wi-Fi', 'Mermer Banyolar Yağmur Duşlu', 'İklim Kontrol Sistemi', 'Oda Kasası ve Mini Bar']
      },
      f5: {
        heroBadge: 'Kat 5', heroTitle: 'Deluxe Odalar', heroDesc: 'Geniş düzenler, premium olanaklar ve şehir ya da bahçe manzaralarıyla geliştirilmiş konfor',
        overviewTitle: 'Yükseltilmiş Lüks',
        stats: ['Deluxe Oda', 'm² Aralığı', 'Premium Manzaralar', 'Misafir Lounge'],
        areasTitle: 'Deluxe Kategorileri',
        areas: [{ type: 'Deluxe Oda', number: '501-525', size: '60 m²', status: 'Müsait', features: ['Premium Manzara', 'Oturma Alanı', 'Büyük Balkon'] }, { type: 'Deluxe Şehir Manzaralı', number: '526-545', size: '65 m²', status: 'Müsait', features: ['Panoramik Manzara', 'Çalışma Masası', 'Kanepe'] }, { type: 'Deluxe Bahçe Manzaralı', number: '546-560', size: '62 m²', status: 'Rezerve', features: ['Bahçe Erişimi', 'Özel Teras', 'Ekstra Olanaklar'] }],
        featuresTitle: 'Deluxe Olanaklar',
        features: ['Özel Misafir Lounge Erişimi', 'Ücretsiz Kahvaltı ve Akşam Kokteylleri', 'Espresso Makinesi ve Premium Kahve', 'Islatmalı Küvetli Lüks Banyo', 'Öncelikli Check-in ve Geç Check-out', 'Günlük Temizlik ve Yatak Açma Hizmeti']
      },
      f6: {
        heroBadge: 'Kat 6', heroTitle: 'Premium Odalar', heroDesc: 'Aileler ve uzun konaklamalar için geliştirilmiş olanaklar ve concierge hizmetleriyle ideal geniş premium odalar',
        overviewTitle: 'Premium Deneyim',
        stats: ['Premium Oda', 'm² Aralığı', 'Aile Dostu', 'Concierge'],
        areasTitle: 'Premium Kategoriler',
        areas: [{ type: 'Premium Oda', number: '601-620', size: '75 m²', status: 'Müsait', features: ['Panoramik Manzara', 'Oturma Alanı', 'Büyük Balkon'] }, { type: 'Premium Aile', number: '621-638', size: '90 m²', status: 'Müsait', features: ['İki Yatak Odası', 'Küçük Mutfak', 'Aile Lounge'] }, { type: 'Premium Plus', number: '639-650', size: '85 m²', status: 'Rezerve', features: ['Köşe Süit', 'Şarap Dolabı', 'Ev Sineması'] }],
        featuresTitle: 'Premium Avantajlar',
        features: ['Özel Aile Concierge Hizmeti', 'Ücretsiz Havalimanı Transferleri', 'Yemek Alanı ile Küçük Mutfak', 'Büyük Özel Balkonlar', 'Premium Eğlence Sistemleri', 'Executive Lounge Erişimi']
      },
      f7: {
        heroBadge: 'Kat 7', heroTitle: 'Lüks Süitler', heroDesc: 'Ayrı oturma alanları, premium mobilyalar ve kişiselleştirilmiş butler hizmetiyle nihai lüks deneyim için muhteşem süitler',
        overviewTitle: 'Süit Mükemmeliyeti',
        stats: ['Lüks Süit', 'm² Aralığı', 'Butler Hizmeti', 'VIP Muamele'],
        areasTitle: 'Süit Kategorileri',
        areas: [{ type: 'Executive Süit', number: '701-715', size: '120 m²', status: 'Müsait', features: ['Ofis Alanı', 'Toplantı Odası', 'Butler Hizmeti'] }, { type: 'Lüks Süit', number: '716-728', size: '150 m²', status: 'Rezerve', features: ['Ana Yatak Odası', 'Oturma Odası', 'Yemek Alanı'] }, { type: 'Kraliyet Süiti', number: '729-735', size: '200 m²', status: 'Müsait', features: ['İki Yatak Odası', 'Özel Mutfak', 'Jakuzi'] }],
        featuresTitle: 'Özel Süit Olanakları',
        features: ['7/24 Kişisel Butler Hizmeti', 'İstek Üzerine Özel Şef', 'Executive Ofis ve Toplantı Tesisleri', 'Giyinme Odalı Ana Süit', 'Spa Küvetli Lüks Banyo', 'Ücretsiz Şoför Hizmeti']
      },
      f8: {
        heroBadge: 'Kat 8', heroTitle: 'Cumhurbaşkanlığı Katı', heroDesc: 'Lüksün zirvesi — özel havuz, sinema, yemek salonu ve ofis tesisleriyle cumhurbaşkanlığı konaklama alanına ayrılmış bir tam kat',
        overviewTitle: 'Cumhurbaşkanlığı Mükemmeliyeti',
        stats: ['m² Süit', 'Özel Havuz', 'Özel Sinema', 'Özel Personel'],
        areasTitle: 'Cumhurbaşkanlığı Tesisleri',
        areas: [{ name: 'Cumhurbaşkanlığı Süiti', size: '500 m²', desc: 'Nihai lüks konaklama' }, { name: 'Özel Yemek Salonu', size: '100 m²', desc: '20 kişilik' }, { name: 'Özel Sinema', size: '80 m²', desc: 'Son teknoloji tiyatro' }, { name: 'Kapalı Özel Havuz', size: '150 m²', desc: 'İklim kontrollü' }, { name: 'Executive Ofis', size: '60 m²', desc: 'Tam iş tesisleri' }, { name: 'Toplantı Odası', size: '75 m²', desc: '12 kişilik boardroom' }],
        featuresTitle: 'Cumhurbaşkanlığı Ayrıcalıkları',
        features: ['Tüm Kata Özel Erişim', 'Özel Hizmet Ekibi ve Butler', 'Özel Helikopter Transferi', 'Kişisel Şef ve Somelier', 'Güvenlik Ekibi Mevcut', 'Kişiye Özel Concierge Hizmetleri'],
        closingTitle: 'Cumhurbaşkanlığı Yaşamını Deneyimleyin', closingText: 'Kat 8, lüks misafirperverliğin zirvesini temsil ediyor. Bu özel kat, yalnızca cumhurbaşkanlığı saraylarında bulunan olanaklarla benzersiz mahremiyet ve sofistike sunar. Özel kapalı havuzunuzdan kişisel sinemaya kadar her detay, dünya liderlerinin ve seçkin misafirlerin beklentilerini aşmak için tasarlandı.'
      },
      f9: {
        heroBadge: 'Kat 9', heroTitle: 'Personel Konutları', heroDesc: 'Değerli ekip üyelerimiz için rahat konaklama, yemek tesisleri ve rekreasyon alanlarına sahip özel kat',
        overviewTitle: 'Ekip Mükemmeliyeti',
        stats: ['Personel Odası', 'Kapasite', 'Tesis', 'Refah Hizmetleri'],
        areasTitle: 'Personel Tesisleri',
        areas: [{ name: 'Personel Konaklama', capacity: '80 oda', desc: 'Konforlu yaşam alanları' }, { name: 'Personel Yemekhane', capacity: '150 kişilik', desc: 'Günlük üç öğün servis' }, { name: 'Eğlence Odası', capacity: '50 kişi', desc: 'Eğlence ve dinlenme' }, { name: 'Eğitim Merkezi', capacity: '40 kişi', desc: 'Mesleki gelişim' }, { name: 'Personel Spor Salonu', capacity: '30 kişi', desc: 'Fitness tesisleri' }, { name: 'Wellness Odası', capacity: '20 kişi', desc: 'Meditasyon ve yoga' }],
        featuresTitle: 'Personel Olanakları',
        features: ['Modern Mobilyalı Konaklama', '7/24 Kafeterya ve Yemek Hizmetleri', 'Eğlence ve Rekreasyon Tesisleri', 'Eğitim ve Gelişim Merkezi', 'Çamaşırhane ve Temizlik Hizmetleri', 'Wellness ve Fitness Programları']
      },
      f10: {
        heroBadge: 'Kat 10', heroTitle: 'Helipad Katı', heroDesc: 'VIP resepsiyon, havacılık ofisi ve kapsamlı güvenlik sistemleriyle seçkin varışlar için executive helikopter iniş tesisi',
        overviewTitle: 'Gökyüzü Varışı',
        stats: ['Helipad', '7/24 Operasyon', 'Tam Güvenlik', 'VIP Hizmet'],
        areasTitle: 'Havacılık Tesisleri',
        areas: [{ name: 'Ana Helipad', capacity: '2 helikopter', desc: 'Eş zamanlı operasyonlar' }, { name: 'İniş Kontrolü', desc: 'Gelişmiş navigasyon sistemleri', size: '50 m²' }, { name: 'VIP Resepsiyon', desc: 'Özel varış lounge', size: '120 m²' }, { name: 'Havacılık Ofisi', desc: 'Uçuş koordinasyon merkezi', size: '80 m²' }, { name: 'Güvenlik Merkezi', desc: 'Gelişmiş izleme sistemleri', size: '100 m²' }, { name: 'Yakıt İkmal İstasyonu', desc: 'Tam hizmet kapasitesi', capacity: 'Havacılık yakıtı' }],
        featuresTitle: 'Özel Özellikler',
        features: ['Eş Zamanlı Operasyon için Çift Helipad', 'Gelişmiş Hava Durumu İzleme Sistemleri', 'VIP Hızlı Giriş Hizmetleri', 'İkramlı Lüks Bekleme Lounge', 'Tüm Katlara Doğrudan Özel Asansör', '7/24 Güvenlik ve Hava Trafik Koordinasyonu'],
        closingTitle: 'Eşsiz Bir Şıklıkla Varın', closingText: 'Helipad tesisimiz, özel varışlarda nihai deneyimi sunuyor. Trafiği atlayın ve doğrudan cumhurbaşkanlığı süitinize varın. İki helikopter kapasitesi ve tam yakıt ikmal hizmetleriyle yolculuğunuzun konaklamanız kadar lüks olmasını sağlıyoruz.'
      },
      f11: {
        heroBadge: 'Kat 11 - Çatı', heroTitle: 'Gökyüzü Bahçesi ve Sonsuzluk Havuzu', heroDesc: 'Çatı sonsuzluk havuzu, lüks bahçe, gökyüzü lounge ve 360 derece şehir manzaralı panoramik restoran ile otelin tacı',
        overviewTitle: 'Çatı Cenneti',
        stats: ['m² Havuz', 'm² Bahçe', 'Panoramik Manzara', 'Mükemmellik'],
        areasTitle: 'Çatı Cazibe Merkezleri',
        areas: [{ name: 'Sonsuzluk Havuzu', size: '30m x 15m', desc: 'Isıtmalı, panoramik manzaralar' }, { name: 'Gökyüzü Bahçesi', size: '800 m²', desc: 'Tropik botanik cenneti' }, { name: 'Sky Lounge Bar', capacity: '80 misafir', desc: 'Premium kokteyller ve manzaralar' }, { name: 'Panorama Restoran', capacity: '120 misafir', desc: 'Fine dining deneyimi' }, { name: 'Seyir Terası', size: '360°', desc: 'Nefes kesen şehir manzaraları' }, { name: 'Açık Hava Mekan', capacity: '150 misafir', desc: 'Etkinlikler ve eğlence' }],
        featuresTitle: 'Gökyüzü Olanakları',
        features: ['Su Altı Müzikli Isıtmalı Sonsuzluk Havuzu', 'Premium Kabinalar ve Havuz Başı Servisi', 'Nadir Bitki Türleriyle Tropik Bahçe', 'İmza Kokteyllerle Sky Lounge', 'Michelin Yıldızlı Şef ile Fine Dining', 'Her Akşam Canlı DJ ve Eğlence', 'Gün Batımı Yogası ve Wellness Seansları', 'Özel Etkinlik Alanları Mevcut'],
        closingTitle: 'Gökyüzüne Dokunun', closingText: "Çatı katımız bir destinasyondan fazlası — bir deneyim. Sonsuzluk havuzundan günbatımını izleyin, panoramik restoranımızda yıldızların altında yemek yiyin ya da tropik gökyüzü bahçemizde dinlenin. Burası lüksün göklere ulaştığı, manzaraların ve deneyimlerin konaklamanızı unutulmaz bir yolculuğa dönüştürdüğü yerdir."
      },
      b1: {
        heroBadge: 'Kat B1', heroTitle: 'Hizmetler ve Destek Katı', heroDesc: 'Çamaşırhane hizmetleri, depolama, kat hizmetleri merkezi ve ek otopark dahil kapsamlı operasyonel tesisler',
        overviewTitle: 'Operasyon Merkezi',
        stats: ['Günlük Ürün', 'Depolama Birimi', 'Otopark Yeri', 'Personel Üyesi'],
        areasTitle: 'Hizmet Operasyonları',
        areas: [{ name: 'Çamaşırhane Hizmeti', status: 'Operasyonel', capacity: 'Günde 500 ürün' }, { name: 'Depolama Birimleri', status: 'Müsait', capacity: '80 birim' }, { name: 'Kat Hizmetleri Merkezi', status: 'Aktif', capacity: '50 personel' }, { name: 'Ek Otopark', status: 'Müsait', capacity: '80 yer' }],
        mapTitle: 'Kat Planı', mapSubtitle: 'Operasyonel Alanlar',
        zones: [{ name: 'Endüstriyel Çamaşırhane', size: '400 m²' }, { name: 'Kuru Temizleme', size: '150 m²' }, { name: 'Çarşaf Deposu', size: '300 m²' }, { name: 'Ekipman Deposu', size: '200 m²' }, { name: 'Personel Soyunma Odaları', size: '180 m²' }, { name: 'Hizmet Asansörleri', size: '4 birim' }],
        featuresTitle: 'Temel Özellikler',
        features: ['Günde 500+ Ürün için Endüstriyel Çamaşırhane Ekipmanı', 'Premium Kuru Temizleme Hizmetleri', 'İklim Kontrollü Depolama Tesisleri', 'Kat Hizmetleri Komuta Merkezi', 'Soyunma Odası ve Dolaplarla Personel Tesisleri', 'Tüm Katlara Doğrudan Hizmet Asansörü Erişimi']
      },
      b2: {
        heroBadge: 'Kat B2', heroTitle: 'Ana Otopark Katı', heroDesc: '150 araçlık premium yeraltı otoparkı, EV şarj istasyonları ve 7/24 güvenlik izleme',
        storyText: 'Varışın güvenlik, kolaylık ve olağanüstü hizmet vaadiyle başladığı yer.',
        overviewTitle: 'Otopark Genel Bakış',
        stats: ['Toplam Yer', 'EV Şarj', 'Gözetleme', '%100 Güvenli'],
        areasTitle: 'Otopark Bölgeleri',
        zones: [{ id: 'A', slots: 30, type: 'Standart', status: 'Müsait' }, { id: 'B', slots: 30, type: 'Standart', status: 'Müsait' }, { id: 'C', slots: 25, type: 'VIP', status: 'Rezerve' }, { id: 'D', slots: 20, type: 'EV Şarj', status: 'Aktif' }, { id: 'E', slots: 15, type: 'Vale Hizmeti', status: 'Premium' }],
        facilitiesTitle: 'Tesisler ve Hizmetler',
        facilities: [{ name: 'EV Şarj İstasyonları', count: 20 }, { name: 'CCTV Kapsama', count: 50 }, { name: 'Vale Hizmeti Noktaları', count: 4 }, { name: 'Bakım Bölümü', count: 2 }],
        featuresTitle: 'Özellikler',
        features: ['Plaka Tanıma ile Otomatik Giriş/Çıkış Kapıları', 'VIP Misafirler için Premium Vale Hizmeti', 'EV Hızlı Şarj İstasyonları (Tip 2 ve CCS)', 'İklim Kontrollü Ortam', '7/24 CCTV İzleme ve Güvenlik Devriyesi', 'Araç Yıkama ve Detay Hizmeti Mevcut']
      }
    },
    suites: {
      hero: {
        kicker: 'Presidential Lüks Otel — 7–11. Katlar',
        titleLine1: 'Özel', titleLine2: 'Süitler',
        sub: '{{count}} egemen gökyüzü rezidansı, mükemmeliyetten başka bir şey kabul etmeyen misafirler için özenle tasarlanmıştır.',
        stats: { suites: 'Süitler', floors: 'Katlar', butler: 'Butler', rated: 'Puanlandı' }
      },
      filterTabs: {
        all: 'Tüm Süitler', junior: '🌟 Junior', executive: '💼 Executive',
        family: '🏡 Aile', presidential: '👑 Presidential', royal: '🏰 Royal'
      },
      meta: {
        JUNIOR_SUITE:       { label: 'Junior Süit',       tagline: 'Rafine Konfor ve Zarafet' },
        EXECUTIVE_SUITE:    { label: 'Executive Süit',     tagline: 'İş Dünyası Lüksle Buluşuyor' },
        FAMILY_SUITE:       { label: 'Aile Süiti',         tagline: 'Bulutların Üzerinde Özel Bir Ev' },
        PRESIDENTIAL_SUITE: { label: 'Presidential Süit',  tagline: 'Nihai Gökyüzü Rezidansı' },
        ROYAL_SUITE:        { label: 'Royal Süit',         tagline: 'Yeniden Tanımlanmış Egemenlik' }
      },
      card: {
        floor: 'Kat', guests: 'Misafir', bed: 'Yatak', beds: 'Yatak', bath: 'Banyo', baths: 'Banyo',
        exclusiveFeatures: 'Özel Özellikler', more: '+{{count}} daha', perNight: 'gecelik',
        viewDetails: 'Detayları Gör', reserveSuite: 'Süit Rezerve Et', unavailable: 'Müsait Değil'
      },
      status: {
        booked: 'Rezerve', availableSoon: 'Yakında Müsait', maintenance: 'Bakımda',
        currentlyReserved: '🔴 Şu An Rezerve', checkingOut: '🟣 Yakında Çıkış',
        availableFrom: 'Müsaitlik tarihi', freeFrom: 'Boş tarih',
        badgeBooked: '🔴 Rezerve', badgeNearAvail: '🟣 Yakında Müsait', badgeMaintenance: '🔧 Bakım'
      },
      luxuryFeatures: {
        butler: '7/24 Butler', privatePool: 'Özel Havuz', privateChef: 'Özel Şef',
        jacuzzi: 'Jakuzi', sauna: 'Sauna', cinema: 'Sinema Odası', library: 'Kütüphane',
        grandPiano: 'Kuyruklu Piyano', privateElevator: 'Özel Asansör', helipadAccess: 'Helikopter Pisti',
        wineCellar: 'Şarap Mahzeni', rooftopGarden: 'Çatı Bahçesi', livingRoom: 'Oturma Odası', privateOffice: 'Özel Ofis'
      },
      loading: 'Süitler hazırlanıyor…', empty: 'Bu kategoride süit yok.', showAll: 'Tümünü Göster',
      cta: {
        label: 'Özel Rezervasyonlar', title: 'Mükemmel Konaklamanızı Tasarlayın',
        sub: 'Concierge ekibimiz, özel deneyimler ve kişiselleştirilmiş süit hazırlığı için 7/24 hizmetinizdedir.',
        reserve: 'Süit Rezerve Et', browse: 'Tüm Odaları Gör'
      }
    },
    booking: {
      pageTitle: 'Konaklamanızı Rezerve Edin', pageSubtitle: 'Birkaç adımda mükemmel odanızı bulun',
      loginRequired: 'Devam etmek için lütfen giriş yapın', loginToBook: 'Rezervasyon yapmak için lütfen giriş yapın',
      sessionExpired: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
      questions: {
        guestType: 'Aile olarak mı yoksa bireysel olarak mı seyahat ediyorsunuz?',
        hasChildren: 'Grubunuzda çocuk var mı?',
        childrenInfo: 'Çocuklarınız hakkında bilgi verin',
        guests: 'Kaç misafir kalacak?',
        roomType: 'Ne tür bir konaklama tercih edersiniz?',
        viewPreference: 'Hangi manzarayı tercih edersiniz?',
        dates: 'Tercih ettiğiniz tarihleri seçin',
        needsParking: 'Otopark hizmetine ihtiyacınız var mı?',
        parkingType: 'Ne tür bir otopark tercih edersiniz?'
      },
      options: {
        individual: '👤 Bireysel', individualDesc: 'Yalnız gezgin',
        couple: '💑 Çift', coupleDesc: 'Romantik kaçamak',
        family: '👨‍👩‍👧‍👦 Aile', familyDesc: 'Aile bireyleriyle',
        group: '👥 Grup', groupDesc: 'Arkadaşlar veya meslektaşlar',
        hasChildrenYes: '👧 Evet, çocuklar var', hasChildrenYesDesc: 'Çocuklar da geliyor',
        hasChildrenNo: '🚫 Çocuk yok', hasChildrenNoDesc: 'Yalnızca yetişkinler',
        standard: '🛏️ Standart', standardDesc: 'Konforlu ve uygun fiyatlı',
        deluxe: '✨ Deluxe', deluxeDesc: 'Premium konfor',
        suite: '👑 VIP Süit', suiteDesc: 'Nihai lüks',
        presidential: '🏰 Presidential', presidentialDesc: 'En üst düzey deneyim',
        cityView: '🏙️ Şehir Manzarası', cityViewDesc: 'Kentsel silüet',
        gardenView: '🌳 Bahçe Manzarası', gardenViewDesc: 'Huzurlu yeşillik',
        poolView: '🏊 Havuz Manzarası', poolViewDesc: 'Tatil köyü atmosferi',
        noPreference: '✨ Fark Etmez', noPreferenceDesc: 'Sürpriz yapsın',
        parkingYes: '✅ Evet, otoparka ihtiyacım var', parkingYesDesc: 'Yer ayırt',
        parkingNo: '❌ Otopark gerekmiyor', parkingNoDesc: 'Bu adımı atla',
        valet: '🎩 Vale Otopark', valetDesc: 'Aracınızı biz park ederiz',
        self: '🚙 Kendi Kendine Park', selfDesc: 'Standart kapalı otopark',
        vip: '⭐ VIP Rezerve', vipDesc: 'Özel rezerve yer',
        ev: '⚡ EV Şarj', evDesc: 'Elektrikli araç şarjı'
      },
      children: {
        howMany: 'Kaç çocuk var?', agesTitle: 'Çocukların yaşları',
        agesHelper: '(isteğe bağlı — en iyi odayı önermemize yardımcı olur)',
        child: 'Çocuk {{n}}', ageOptional: 'Yaş (isteğe bağlı)',
        underOne: '1 Yaşından Küçük', yearsOld: '{{age}} yaşında'
      },
      nav: { previous: '← Önceki', next: 'Sonraki →', findRooms: '✨ Oda Bul' },
      progress: { step: 'Adım {{current}} / {{total}}' },
      direct: {
        kicker: 'Hızlı Rezervasyon', title: 'Rezervasyonunuzu Tamamlayın',
        subtitle: 'İki hızlı soru, ardından tarihlerinizi onaylayın.',
        parkingQuestion: 'Otoparka ihtiyacınız var mı?',
        parkingSubtitle: 'Tüm misafirler için ücretsiz vale ve kendi kendine park.',
        parkingYesLabel: 'Evet, otoparka ihtiyacım var', parkingYesDesc: 'Yer ayırt',
        parkingNoLabel: 'Otopark gerekmiyor', parkingNoDesc: 'Bu adımı atla',
        parkingPreference: 'Otopark tercihi',
        parkingFree: 'Tüm otopark seçenekleri otel misafirleri için ücretsizdir.',
        selectDates: 'Tarihlerinizi seçin',
        datesSubtitle: 'Giriş ve çıkış tarihlerinizi aşağıdan seçin.',
        checkIn: 'Giriş', checkOut: 'Çıkış',
        total: 'Toplam', totalSuffix: 'toplam',
        confirmBtn: '✦ Rezervasyonu Onayla', processing: 'İşleniyor…',
        floor: 'Kat', upTo: 'Maks.', guests: 'misafir',
        night: 'gece', nights: 'gece', perNight: '/gece'
      },
      results: {
        recommended: 'Önerilen Odalar', available: 'Müsait Odalar',
        newSearch: '← Yeni Arama', basedOn: 'Tercihlerinize göre:',
        loading: 'Odalar yükleniyor...', noResults: 'Kriterlerinize uygun oda bulunamadı',
        tryDifferent: 'Farklı Seçenekleri Dene', topMatch: '⭐ En İyi Eşleşme',
        floorLabel: 'Kat', capacityLabel: 'Kapasite', sizeLabel: 'Boyut', priceLabel: 'Fiyat',
        perNight: '/gece', viewDetails: 'Detayları Gör', bookNow: 'Şimdi Rezervasyon', dismiss: 'Kapat',
        guest: 'misafir', guests: 'misafir', child: 'çocuk', children: 'çocuk'
      },
      success: {
        message: 'Oda başarıyla rezerve edildi. Hoş geldiniz.',
        viewBookings: 'Rezervasyonlarımı Gör', continueBrowsing: 'Aramaya Devam Et'
      },
      guestForm: {
        title: 'Rezervasyonunuzu Tamamlayın',
        subtitle: 'Rezervasyonu onaylamak için bilgilerinizi girin',
        firstName: 'Ad *', lastName: 'Soyad *',
        email: 'E-posta Adresi *', phone: 'Telefon Numarası (İsteğe Bağlı)',
        cancel: 'İptal', confirm: 'Rezervasyonu Onayla', processing: 'İşleniyor...'
      },
      dates: { checkIn: '📅 Giriş', checkOut: '📅 Çıkış' }
    },
    bookingConfirm: {
      pageTitle: 'Rezervasyonunuzu Onaylayın',
      noRoom: 'Oda seçilmedi', noRoomBack: 'Rezervasyona Geri Dön',
      roomDetails: 'Oda Detayları', capacity: 'Kapasite: {{count}} misafir',
      discountMessage: 'Bu rezervasyonda özel bir indirim alıyorsunuz!',
      discountFirst: 'İlk Ziyaret İndirimi (%20)', discountReturning: 'Geri Dönen Misafir İndirimi (%10)',
      bookingInfo: 'Rezervasyon Bilgileri', checkIn: 'Giriş Tarihi', checkOut: 'Çıkış Tarihi',
      numGuests: 'Misafir Sayısı', specialRequests: 'Özel İstekler (İsteğe Bağlı)',
      requestsPlaceholder: 'Özel gereksinimlerinizi veya tercihlerinizi yazın...',
      roomRate: 'Oda Ücreti ({{nights}} gece)', total: 'Toplam',
      back: 'Geri Dön', confirm: 'Rezervasyonu Onayla', processing: 'İşleniyor...',
      errorDates: 'Lütfen giriş ve çıkış tarihlerini seçin',
      errorDateOrder: 'Çıkış tarihi giriş tarihinden sonra olmalıdır'
    },
    bookingSuccess: {
      title: 'Rezervasyon Onaylandı!',
      subtitle: 'Rezervasyonunuz başarıyla onaylandı',
      bookingNumber: 'Rezervasyon Numarası', guestName: 'Misafir Adı',
      room: 'Oda', roomPrefix: 'Oda', roomType: 'Oda Türü',
      checkIn: 'Giriş', checkOut: 'Çıkış', guests: 'Misafirler',
      totalAmount: 'Toplam Tutar', discountApplied: 'Uygulanan İndirim', finalPrice: 'Son Fiyat',
      discountMsg: '{{type}} indirimiyle ${{amount}} tasarruf ettiniz!',
      discountFirst: 'ilk ziyaret', discountReturning: 'geri dönen misafir',
      nextSteps: 'Sırada Ne Var?',
      confirmEmail: 'Onay E-postası',
      confirmEmailText: 'Rezervasyon onayı için e-postanızı kontrol edin',
      stayUpdated: 'Güncel Kalın',
      stayUpdatedText: 'Rezervasyon durumunuzu panonuzdan takip edin',
      checkInStep: 'Otel Girişi', checkInStepText: 'Giriş tarihinizde otele gelin',
      dashboard: 'Panele Git', backHome: 'Ana Sayfaya Dön'
    },
    roomDetail: {
      loading: 'Oda detayları yükleniyor...',
      notFound: 'Oda Bulunamadı', notFoundText: 'İstenen oda bulunamadı.',
      backToRooms: 'Odalara Dön',
      viewPhotos: '🖼️ Tüm Fotoğrafları Gör ({{count}})',
      noImages: 'Görüntü mevcut değil',
      description: 'Açıklama', view: '🌅 Manzara', bed: '🛏️ Yatak',
      bathroom: '🛁 Banyo', services: '✨ Dahil Hizmetler', amenities: '🎯 Olanaklar',
      pricePerNight: 'Gecelik fiyat',
      upToGuests: '{{count}} misafire kadar', roomSize: '{{size}} m² oda',
      available: '✓ Müsait', bookNow: 'Şimdi Rezervasyon',
      freeCancellation: 'Girişten 24 saat öncesine kadar ücretsiz iptal',
      floor: 'Kat', guests: 'Misafir', roomTitle: 'Oda',
      amenityNames: {
        wifi: 'Wi-Fi', tv: 'TV', smart_tv: 'Akıllı TV', air_conditioning: 'Klima',
        minibar: 'Mini Bar', safe: 'Kasa', hairdryer: 'Saç Kurutma Makinesi', iron: 'Ütü',
        desk: 'Çalışma Masası', espresso_machine: 'Espresso Makinesi', nespresso: 'Nespresso',
        bathrobes: 'Bornoz', slippers: 'Terlik', bluetooth_speaker: 'Bluetooth Hoparlör',
        sound_system: 'Ses Sistemi', wine_fridge: 'Şarap Buzdolabı',
        premium_toiletries: 'Premium Tuvalet Malzemeleri', yoga_mat: 'Yoga Matı',
        smart_home: 'Akıllı Ev', home_theater: 'Ev Sineması', full_bar: 'Tam Bar',
        jacuzzi: 'Jakuzi', butler_pantry: 'Butler Servisi', luxury_linens: 'Lüks Nevresim',
        pillow_menu: 'Yastık Menüsü', video_conferencing: 'Video Konferans',
        multi_room_audio: 'Çok Odalı Ses', wine_cellar: 'Şarap Mahzeni',
        massage_chair: 'Masaj Koltuğu', butler_service: 'Butler Hizmeti', printer: 'Yazıcı',
        standing_desk: 'Ayaklı Çalışma Masası', smart_home_automation: 'Akıllı Ev Otomasyonu',
        private_cinema: 'Özel Sinema', chef_kitchen: 'Şef Mutfağı', wine_room: 'Şarap Odası',
        helipad_access: 'Helipad Erişimi', limousine_service: 'Limuzin Hizmeti',
        everything_included: 'Her Şey Dahil', personal_staff: 'Kişisel Personel',
        private_chef: 'Özel Şef', chauffeur: 'Şoför', yacht_access: 'Yat Erişimi',
        helicopter_transfers: 'Helikopter Transferi', concierge_24h: '7/24 Concierge',
        balcony: 'Balkon', private_pool: 'Özel Havuz', separate_living: 'Ayrı Oturma Odası',
        dining_area: 'Yemek Alanı', separate_living_area: 'Ayrı Yaşam Alanı',
      },
      bathroomTypes: {
        standard_bath: 'Standart Banyo', luxury_bath: 'Lüks Banyo',
        marble_bathroom: 'Mermer Banyo', rain_shower: 'Yağmur Duşu',
        steam_shower: 'Buhar Duşu', jacuzzi_bath: 'Jakuzili Banyo',
        double_vanity: 'Çift Lavabo', ensuite: 'Özel Banyo',
      },
      bathroomFeatures: {
        shower: 'Duş', bathtub: 'Küvet', hair_dryer: 'Saç Kurutma Makinesi',
        magnifying_mirror: 'Büyüteçli Ayna', premium_toiletries: 'Premium Tuvalet Malzemeleri',
        heated_floor: 'Isıtmalı Zemin', rain_shower: 'Yağmur Duşu', dual_sink: 'Çift Lavabo',
        soaking_tub: 'Banyolu Küvet', bidet: 'Bide', luxury_toiletries: 'Lüks Tuvalet Malzemeleri',
        towels: 'Havlu', bathrobes: 'Bornoz', slippers: 'Terlik',
        separate_shower: 'Ayrı Duş', steam_room: 'Buhar Odası',
      },
      serviceNames: {
        daily_housekeeping: 'Günlük Oda Temizliği', room_service_24h: '7/24 Oda Servisi',
        room_service: 'Oda Servisi', turndown_service: 'Yataktan Hazırlama Servisi',
        laundry_service: 'Çamaşır Servisi', concierge_service: 'Concierge Hizmeti',
        airport_transfer: 'Havalimanı Transferi', valet_parking: 'Vale Park',
        business_services: 'İş Hizmetleri', wake_up_call: 'Uyandırma Servisi',
        newspaper_delivery: 'Gazete Servisi', welcome_drink: 'Karşılama İçeceği',
        butler_service: 'Kişisel Butler Hizmeti', private_check_in: 'Özel Check-in',
        in_suite_dining: 'Oda İçi Yemek', complimentary_breakfast: 'Ücretsiz Kahvaltı',
        spa_access: 'Spa Girişi', fitness_center: 'Fitness Merkezi Girişi',
        pool_access: 'Havuz Girişi', pressing_service: 'Ütüleme Hizmeti',
      },
      typeDescriptions: {
        STANDARD: 'Modern olanaklara ve şehir manzarasına sahip konforlu standart oda.',
        SINGLE: 'Solo gezginler için kompakt ve şık tek kişilik oda.',
        COUPLE: 'Premium olanaklar ve zarif tasarıma sahip romantik çift kişilik oda.',
        FAMILY: 'Birden fazla yatak ve havuz manzarasıyla geniş aile odası.',
        DELUXE: 'Panoramik manzara ve mermer banyoyla sofistike deluxe oda.',
        JUNIOR_SUITE: 'Ayrı oturma alanı ve premium olanaklar sunan zarif junior süit.',
        EXECUTIVE_SUITE: 'Lüks ve profesyonel işlevselliği bir araya getiren executive süit.',
        FAMILY_SUITE: 'Ailenizin her konforu için geniş ve tam donanımlı aile süiti.',
        PRESIDENTIAL_SUITE: 'Özel hizmetler ve eşsiz konforla başkanlık süiti.',
        ROYAL_SUITE: 'En yüksek standartlarda olağanüstü kraliyet konaklaması.',
      }
    }
  }
};

const getInitialLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && resources[stored]) return stored;

  const browser = (navigator.language || 'en').split('-')[0];
  if (resources[browser]) return browser;
  return 'en';
};

export const setDocumentDirection = (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng);
};

const initialLanguage = getInitialLanguage();
setDocumentDirection(initialLanguage);

// Merge all non-translation namespace keys into the translation namespace so
// every key is accessible via t('key') regardless of where it was placed in
// the resources object.
const mergedResources = Object.fromEntries(
  Object.entries(resources).map(([lang, data]) => {
    const { translation = {}, ...rest } = data;
    return [lang, { translation: { ...translation, ...rest } }];
  })
);

i18n
  .use(initReactI18next)
  .init({
    resources: mergedResources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  setDocumentDirection(lng);
});

export default i18n;
