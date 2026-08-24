const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');
const CategorySetting = require('../models/CategorySetting');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');
const NotificationOutbox = require('../models/NotificationOutbox');
const settingsService = require('../services/settingsService');
const { calculateDueDate } = require('../utils/mathUtils');

async function seedDatabase() {
  console.log('[Seeder] Connecting to database:', config.mongoUri);
  await mongoose.connect(config.mongoUri);
  console.log('[Seeder] Connected successfully. Purging existing dataset...');

  await Promise.all([
    User.deleteMany({}),
    CategorySetting.deleteMany({}),
    Complaint.deleteMany({}),
    Notice.deleteMany({}),
    NotificationOutbox.deleteMany({})
  ]);

  console.log('[Seeder] 1. Initializing Category SLA and Severity weights...');
  await settingsService.seedDefaultSettings();

  console.log('[Seeder] 2. Creating Enterprise User Accounts...');
  const admin = await User.create({
    name: 'Eleanor Vance (Operations Director)',
    email: 'admin@greenwood.com',
    password: 'Password123!',
    role: 'admin',
    unitNumber: 'Management Office - Suite 1',
    phoneNumber: '+1 (555) 019-2834'
  });

  const staff = await User.create({
    name: 'Marcus Brody (Lead Technician)',
    email: 'staff@greenwood.com',
    password: 'Password123!',
    role: 'staff',
    unitNumber: 'Facility Workshop B1',
    phoneNumber: '+1 (555) 014-9821'
  });

  const resident1 = await User.create({
    name: 'Dr. Arthur Pendelton',
    email: 'resident@greenwood.com',
    password: 'Password123!',
    role: 'resident',
    unitNumber: 'Tower A - 402',
    phoneNumber: '+1 (555) 018-4421'
  });

  const resident2 = await User.create({
    name: 'Samantha Ray',
    email: 'john.doe@greenwood.com',
    password: 'Password123!',
    role: 'resident',
    unitNumber: 'Tower B - 101',
    phoneNumber: '+1 (555) 012-7733'
  });

  const resident3 = await User.create({
    name: 'Carlos Mendez',
    email: 'sarah.connor@greenwood.com',
    password: 'Password123!',
    role: 'resident',
    unitNumber: 'Tower C - 304',
    phoneNumber: '+1 (555) 015-6612'
  });

  console.log('[Seeder] 3. Creating Society Announcements & Notices...');
  await Notice.create([
    {
      title: 'Quarterly Infrastructure & Fire Safety Audit Scheduled',
      content: 'Please note that our quarterly fire sprinkler pressure testing and emergency lighting inspection will occur this Thursday from 10:00 AM to 3:00 PM. Technicians will require brief access to common corridors.',
      createdBy: admin._id,
      isPinned: true,
      category: 'Maintenance'
    },
    {
      title: 'Annual General Body Meeting (AGM) - Save the Date',
      content: 'The Annual General Body Meeting for Greenwood Heights Community is scheduled for next Sunday at 6:00 PM in the Grand Clubhouse. Agenda includes capital reserves review and landscape modernization.',
      createdBy: admin._id,
      isPinned: true,
      category: 'General'
    },
    {
      title: 'Underground Water Tank Deep Sanitization',
      content: 'Treated water supply will be paused between 1:00 PM and 4:00 PM on Friday for routine microbial disinfection and tank flushing.',
      createdBy: staff._id,
      isPinned: false,
      category: 'Maintenance'
    }
  ]);

  console.log('[Seeder] 4. Seeding Complaints with Exponential Decay Fixtures...');
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // CLUSTER A: "Tower B - 101" + "Plumbing" (Severe recurring risk cluster - 4 complaints in 14 days)
  const clusterA_complaints = [
    {
      title: 'Main bathroom drainage pipe backing up',
      description: 'Greywater overflowing from the floor trap into the master bathroom after neighbour laundry run.',
      category: 'Plumbing',
      unitNumber: 'Tower B - 101',
      resident: resident2._id,
      currentStatus: 'In Progress',
      createdAt: new Date(now - 2 * dayMs),
      dueDate: new Date(now + 1 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident2._id,
          updatedAt: new Date(now - 2 * dayMs),
          comment: 'Reported by resident.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 1 * dayMs),
          comment: 'Dispatched secondary plumbing contractor to inspect central riser pipe.'
        }
      ]
    },
    {
      title: 'Kitchen sink pipe joint leaking under cabinet',
      description: 'Slow leak dripping continuously under the sink cabinet, warping wooden panel.',
      category: 'Plumbing',
      unitNumber: 'Tower B - 101',
      resident: resident2._id,
      currentStatus: 'Resolved',
      createdAt: new Date(now - 6 * dayMs),
      dueDate: new Date(now - 5 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident2._id,
          updatedAt: new Date(now - 6 * dayMs),
          comment: 'Reported by resident.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 5.5 * dayMs),
          comment: 'Technician on-site.'
        },
        {
          status: 'Resolved',
          updatedBy: staff._id,
          updatedAt: new Date(now - 5 * dayMs),
          comment: 'Replaced rubber gasket and tightened PVC compression coupling.'
        }
      ]
    },
    {
      title: 'Persistent low water pressure on upper taps',
      description: 'Pressure drops to trickle during peak morning hours.',
      category: 'Plumbing',
      unitNumber: 'Tower B - 101',
      resident: resident2._id,
      currentStatus: 'Closed',
      createdAt: new Date(now - 11 * dayMs),
      dueDate: new Date(now - 10 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident2._id,
          updatedAt: new Date(now - 11 * dayMs),
          comment: 'Reported by resident.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 10.5 * dayMs),
          comment: 'Checked booster pump valve.'
        },
        {
          status: 'Resolved',
          updatedBy: staff._id,
          updatedAt: new Date(now - 10 * dayMs),
          comment: 'Cleaned aerators and adjusted pressure regulator.'
        },
        {
          status: 'Closed',
          updatedBy: admin._id,
          updatedAt: new Date(now - 9 * dayMs),
          comment: 'Resident confirmed water flow is adequate.'
        }
      ]
    },
    {
      title: 'Ceiling dampness spot near service shaft',
      description: 'Moisture patches visible on bathroom ceiling slab.',
      category: 'Plumbing',
      unitNumber: 'Tower B - 101',
      resident: resident2._id,
      currentStatus: 'Resolved',
      createdAt: new Date(now - 15 * dayMs),
      dueDate: new Date(now - 14 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident2._id,
          updatedAt: new Date(now - 15 * dayMs),
          comment: 'Reported by resident.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 14.5 * dayMs),
          comment: 'Inspected shaft sleeve.'
        },
        {
          status: 'Resolved',
          updatedBy: staff._id,
          updatedAt: new Date(now - 14 * dayMs),
          comment: 'Applied epoxy waterproofing sealant.'
        }
      ]
    }
  ];

  // CLUSTER B: "Tower A - 402" + "Electrical" (3 complaints in 25 days)
  const clusterB_complaints = [
    {
      title: 'Frequent MCB tripping during appliance startup',
      description: 'Distribution board breaker trips whenever oven and AC run simultaneously.',
      category: 'Electrical',
      unitNumber: 'Tower A - 402',
      resident: resident1._id,
      currentStatus: 'Open',
      createdAt: new Date(now - 1 * dayMs),
      dueDate: new Date(now + 0.5 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident1._id,
          updatedAt: new Date(now - 1 * dayMs),
          comment: 'Initial report submitted.'
        }
      ]
    },
    {
      title: 'Voltage fluctuation causing light flickering',
      description: 'Hallway LEDs pulsating rapidly, suspected neutral wire loose connection.',
      category: 'Electrical',
      unitNumber: 'Tower A - 402',
      resident: resident1._id,
      currentStatus: 'Resolved',
      createdAt: new Date(now - 12 * dayMs),
      dueDate: new Date(now - 11.5 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident1._id,
          updatedAt: new Date(now - 12 * dayMs),
          comment: 'Reported.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 11.8 * dayMs),
          comment: 'Diagnosing feeder pillar.'
        },
        {
          status: 'Resolved',
          updatedBy: staff._id,
          updatedAt: new Date(now - 11.5 * dayMs),
          comment: 'Crimped neutral terminal in main corridor distribution box.'
        }
      ]
    },
    {
      title: 'Intermittent power supply to balcony socket',
      description: 'Balcony 16A weatherproof socket completely dead.',
      category: 'Electrical',
      unitNumber: 'Tower A - 402',
      resident: resident1._id,
      currentStatus: 'Closed',
      createdAt: new Date(now - 22 * dayMs),
      dueDate: new Date(now - 21.5 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident1._id,
          updatedAt: new Date(now - 22 * dayMs),
          comment: 'Reported.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 21.8 * dayMs),
          comment: 'Replacing breaker.'
        },
        {
          status: 'Resolved',
          updatedBy: staff._id,
          updatedAt: new Date(now - 21.5 * dayMs),
          comment: 'Replaced faulty RCBO switch.'
        },
        {
          status: 'Closed',
          updatedBy: admin._id,
          updatedAt: new Date(now - 20 * dayMs),
          comment: 'Verified working.'
        }
      ]
    }
  ];

  // CLUSTER C: "Tower C - 304" + "Carpentry / Civil" (Old complaints > 75 days ago, test mathematical decay)
  const clusterC_complaints = [
    {
      title: 'Entry door frame latch misalignment',
      description: 'Main teak wood door requires excessive force to latch lock.',
      category: 'Carpentry / Civil',
      unitNumber: 'Tower C - 304',
      resident: resident3._id,
      currentStatus: 'Closed',
      createdAt: new Date(now - 75 * dayMs),
      dueDate: new Date(now - 73 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident3._id,
          updatedAt: new Date(now - 75 * dayMs),
          comment: 'Reported.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 74 * dayMs),
          comment: 'Carpentry crew scheduled.'
        },
        {
          status: 'Resolved',
          updatedBy: staff._id,
          updatedAt: new Date(now - 73.5 * dayMs),
          comment: 'Planed edge and reset striker plate.'
        },
        {
          status: 'Closed',
          updatedBy: admin._id,
          updatedAt: new Date(now - 73 * dayMs),
          comment: 'Resolved.'
        }
      ]
    },
    {
      title: 'Balcony railing anchor bolt loose',
      description: 'Corner anchor bolt loose on external glass balcony.',
      category: 'Carpentry / Civil',
      unitNumber: 'Tower C - 304',
      resident: resident3._id,
      currentStatus: 'Closed',
      createdAt: new Date(now - 82 * dayMs),
      dueDate: new Date(now - 80 * dayMs),
      statusHistory: [
        {
          status: 'Open',
          updatedBy: resident3._id,
          updatedAt: new Date(now - 82 * dayMs),
          comment: 'Reported.'
        },
        {
          status: 'In Progress',
          updatedBy: staff._id,
          updatedAt: new Date(now - 81 * dayMs),
          comment: 'Tightened anchor.'
        },
        {
          status: 'Resolved',
          updatedBy: staff._id,
          updatedAt: new Date(now - 80.5 * dayMs),
          comment: 'Anchored with structural chemical grout.'
        },
        {
          status: 'Closed',
          updatedBy: admin._id,
          updatedAt: new Date(now - 80 * dayMs),
          comment: 'Safety verified.'
        }
      ]
    }
  ];

  // OVERDUE COMPLAINT: Elevators / Lift
  const overdue_complaint = {
    title: 'Passenger Lift B2 jerky descent and unusual noise',
    description: 'Lift car vibrates and makes grinding noise when slowing down near 2nd floor.',
    category: 'Elevator / Lift',
    unitNumber: 'Common Area - Tower B',
    resident: resident2._id,
    currentStatus: 'In Progress',
    createdAt: new Date(now - 2 * dayMs), // created 48h ago
    dueDate: new Date(now - 1.7 * dayMs), // SLA was 6 hours -> strongly overdue!
    statusHistory: [
      {
        status: 'Open',
        updatedBy: resident2._id,
        updatedAt: new Date(now - 2 * dayMs),
        comment: 'Emergency ticket filed.'
      },
      {
        status: 'In Progress',
        updatedBy: staff._id,
        updatedAt: new Date(now - 1.9 * dayMs),
        comment: 'OEM service agency (Otis) dispatched.'
      }
    ]
  };

  const allComplaintsToInsert = [
    ...clusterA_complaints,
    ...clusterB_complaints,
    ...clusterC_complaints,
    overdue_complaint
  ];

  for (const c of allComplaintsToInsert) {
    await Complaint.create(c);
  }

  console.log('[Seeder] 5. Creating Sample Outbox Notification Records...');
  await NotificationOutbox.create([
    {
      recipient: 'john.doe@greenwood.com',
      subject: '[Society Ops] Status Update: #PLMB-101 is now In Progress',
      body: 'Dispatched secondary plumbing contractor to inspect central riser pipe.',
      status: 'SENT',
      attempts: 1,
      lastAttempt: new Date(now - 1 * dayMs)
    },
    {
      recipient: 'resident@greenwood.com',
      subject: '[Society Ops] Ticket Registered: #ELEC-402 - MCB Tripping',
      body: 'Your maintenance complaint has been registered. Resolution target: 12 Hours.',
      status: 'SENT',
      attempts: 1,
      lastAttempt: new Date(now - 1 * dayMs)
    },
    {
      recipient: 'admin@greenwood.com',
      subject: '[High Risk Alert] Unit Tower B - 101 has crossed dynamic threshold (Score: 11.2)',
      body: 'Multiple plumbing defects logged in past 14 days. Immediate riser inspection recommended.',
      status: 'PENDING',
      attempts: 0
    }
  ]);

  console.log('================================================================');
  console.log(' SEEDING COMPLETE - Ready for Presentation & Testing');
  console.log('================================================================');
  console.log(' Demo Credentials:');
  console.log(' - Admin:    admin@greenwood.com       | Password123!');
  console.log(' - Staff:    staff@greenwood.com       | Password123!');
  console.log(' - Resident: resident@greenwood.com    | Password123!');
  console.log('================================================================');

  await mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error('[Seeder Error]:', err);
  process.exit(1);
});
