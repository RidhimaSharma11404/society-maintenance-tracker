const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');
const CategorySetting = require('../models/CategorySetting');
const Billing = require('../models/Billing');
const Technician = require('../models/Technician');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seeder] Database already populated. Skipping initial seed.');
      return;
    }

    console.log('[Seeder] Initializing seed fixtures...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    // 1. Seed Users
    const users = await User.insertMany([
      {
        name: 'Secretary Elena Vance',
        email: 'admin@greenwood.com',
        password: passwordHash,
        role: 'admin',
        unitNumber: 'Tower A - 101',
        phoneNumber: '+1 (555) 019-2831'
      },
      {
        name: 'Technician Marcus Cole',
        email: 'staff@greenwood.com',
        password: passwordHash,
        role: 'staff',
        unitNumber: 'Tower B - Maintenance HQ',
        phoneNumber: '+1 (555) 014-9922'
      },
      {
        name: 'Dr. Arthur Pendelton',
        email: 'resident@greenwood.com',
        password: passwordHash,
        role: 'resident',
        unitNumber: 'Tower A - 402',
        phoneNumber: '+1 (555) 018-4421'
      },
      {
        name: 'Sarah Jenkins',
        email: 'resident2@greenwood.com',
        password: passwordHash,
        role: 'resident',
        unitNumber: 'Tower B - 101',
        phoneNumber: '+1 (555) 017-3310'
      }
    ]);

    const admin = users[0];
    const staff = users[1];
    const resident1 = users[2];
    const resident2 = users[3];

    // 2. Seed Technicians & Contractors
    await Technician.insertMany([
      {
        name: 'Ramesh Sharma',
        specialty: 'Plumbing',
        company: 'Apex Hydro Services',
        phone: '+1 (555) 019-1122',
        rating: 4.9,
        status: 'Available',
        currentLocation: 'Tower A Ground Floor'
      },
      {
        name: 'Vikram Joshi',
        specialty: 'Electrical',
        company: 'Volta Power Solutions',
        phone: '+1 (555) 019-3344',
        rating: 4.8,
        status: 'On Job',
        activeJobsCount: 1,
        currentLocation: 'Tower B - 402'
      },
      {
        name: 'Otis Certified Engineer',
        specialty: 'Elevator AMC',
        company: 'Otis Elevator India',
        phone: '+1 (555) 019-5566',
        rating: 5.0,
        status: 'Available',
        currentLocation: 'Clubhouse Maintenance Bay'
      },
      {
        name: 'Anand Kulkarni',
        specialty: 'Civil & Carpentry',
        company: 'BuildSafe Society Care',
        phone: '+1 (555) 019-7788',
        rating: 4.7,
        status: 'Available',
        currentLocation: 'Society Office'
      }
    ]);

    // 3. Seed Category Settings
    await CategorySetting.insertMany([
      { category: 'Plumbing', severityWeight: 4, slaHours: 24, description: 'Water leakages, pipe bursts, and fixture repairs' },
      { category: 'Electrical', severityWeight: 5, slaHours: 12, description: 'Power failures, wiring hazards, and switchboard faults' },
      { category: 'Elevator', severityWeight: 5, slaHours: 6, description: 'Lift malfunctions, entrapments, and safety shutdowns' },
      { category: 'Carpentry', severityWeight: 2, slaHours: 48, description: 'Door, window, and cabinet maintenance' },
      { category: 'Security', severityWeight: 4, slaHours: 8, description: 'CCTV, boom barrier, and access gate incidents' },
      { category: 'Sanitation', severityWeight: 3, slaHours: 24, description: 'Garbage disposal, pest control, and common area cleaning' },
      { category: 'Civil', severityWeight: 3, slaHours: 72, description: 'Seepage, plaster cracks, and structural touchups' }
    ]);

    // 4. Seed Resident Maintenance Billing Invoices
    await Billing.insertMany([
      {
        unitNumber: 'Tower A - 402',
        residentName: 'Dr. Arthur Pendelton',
        month: 'August 2026',
        invoiceNumber: 'INV-2026-08-A402',
        breakdown: { maintenanceCharge: 3500, sinkingFund: 500, waterCharges: 450, commonElectricity: 650, parkingFee: 400 },
        totalAmount: 5500,
        status: 'DUE',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        unitNumber: 'Tower A - 402',
        residentName: 'Dr. Arthur Pendelton',
        month: 'July 2026',
        invoiceNumber: 'INV-2026-07-A402',
        breakdown: { maintenanceCharge: 3500, sinkingFund: 500, waterCharges: 450, commonElectricity: 650, parkingFee: 400 },
        totalAmount: 5500,
        status: 'PAID',
        dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        paymentMethod: 'UPI',
        transactionRef: 'TXN-UPI98273641'
      },
      {
        unitNumber: 'Tower B - 101',
        residentName: 'Sarah Jenkins',
        month: 'August 2026',
        invoiceNumber: 'INV-2026-08-B101',
        breakdown: { maintenanceCharge: 3500, sinkingFund: 500, waterCharges: 450, commonElectricity: 650, parkingFee: 400 },
        totalAmount: 5500,
        status: 'OVERDUE',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        unitNumber: 'Tower A - 101',
        residentName: 'Secretary Elena Vance',
        month: 'August 2026',
        invoiceNumber: 'INV-2026-08-A101',
        breakdown: { maintenanceCharge: 3500, sinkingFund: 500, waterCharges: 450, commonElectricity: 650, parkingFee: 400 },
        totalAmount: 5500,
        status: 'PAID',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        paidDate: new Date(),
        paymentMethod: 'NetBanking',
        transactionRef: 'TXN-NB77482910'
      }
    ]);

    // 5. Seed Complaints
    const now = new Date();
    await Complaint.insertMany([
      {
        title: 'Frequent MCB tripping during appliance startup',
        description: 'Frequent electrical breaker tripping when multiple high-load appliances are operated in the flat.',
        category: 'Electrical',
        priority: 'Medium',
        unitNumber: 'Tower A - 402',
        resident: resident1._id,
        currentStatus: 'Open',
        dueDate: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        statusHistory: [{ status: 'Open', changedBy: resident1._id, comment: 'Logged breaker issue.' }]
      },
      {
        title: 'Main bathroom drainage pipe backing up',
        description: 'Water pooling in main bathroom floor trap causing dampness and slow drainage.',
        category: 'Plumbing',
        priority: 'Medium',
        unitNumber: 'Tower B - 101',
        resident: resident2._id,
        currentStatus: 'In Progress',
        assignedStaff: staff._id,
        dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Open', changedBy: resident2._id, comment: 'Reported wet floor.' },
          { status: 'In Progress', changedBy: staff._id, comment: 'Technician inspecting pipe trap.' }
        ]
      },
      {
        title: 'Passenger Lift B2 jerky descent and unusual noise',
        description: 'Lift cabin vibrations and grinding noises during descent between 2nd and Ground floor.',
        category: 'Elevator',
        priority: 'Medium',
        unitNumber: 'Common Area - Tower B',
        resident: resident2._id,
        currentStatus: 'In Progress',
        assignedStaff: staff._id,
        dueDate: new Date(now.getTime() - 14 * 60 * 60 * 1000), // Overdue SLA
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Open', changedBy: resident2._id, comment: 'Reported jerky lift descent.' },
          { status: 'In Progress', changedBy: staff._id, comment: 'Otis elevator engineer notified.' }
        ]
      },
      {
        title: 'Kitchen sink pipe joint leaking under cabinet',
        description: 'P-trap joint dripping under modular sink counter.',
        category: 'Plumbing',
        priority: 'Medium',
        unitNumber: 'Tower B - 101',
        resident: resident2._id,
        currentStatus: 'Resolved',
        assignedStaff: staff._id,
        dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Open', changedBy: resident2._id, comment: 'Reported leak.' },
          { status: 'Resolved', changedBy: staff._id, comment: 'Joint washer replaced.' }
        ]
      },
      {
        title: 'Persistent low water pressure on upper taps',
        description: 'Low shower head water flow during morning peak hours.',
        category: 'Plumbing',
        priority: 'Medium',
        unitNumber: 'Tower B - 101',
        resident: resident2._id,
        currentStatus: 'Closed',
        assignedStaff: staff._id,
        dueDate: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Open', changedBy: resident2._id, comment: 'Low pressure reported.' },
          { status: 'Closed', changedBy: staff._id, comment: 'Pressure booster valve calibrated.' }
        ]
      },
      {
        title: 'Voltage fluctuation causing light flickering',
        description: 'Living room LED panels flickering during AC compressor load.',
        category: 'Electrical',
        priority: 'Medium',
        unitNumber: 'Tower A - 402',
        resident: resident1._id,
        currentStatus: 'Resolved',
        assignedStaff: staff._id,
        dueDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Open', changedBy: resident1._id, comment: 'Flickering lights.' },
          { status: 'Resolved', changedBy: staff._id, comment: 'Neutral wire tightened at DB.' }
        ]
      },
      {
        title: 'Bathroom exhaust motor burned out',
        description: 'Exhaust fan stopped spinning with burning smell.',
        category: 'Plumbing',
        priority: 'Low',
        unitNumber: 'Tower B - 101',
        resident: resident2._id,
        currentStatus: 'Resolved',
        assignedStaff: staff._id,
        dueDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Open', changedBy: resident2._id, comment: 'Motor burned.' },
          { status: 'Resolved', changedBy: staff._id, comment: 'Motor coil replaced.' }
        ]
      }
    ]);

    // 6. Seed Notices
    await Notice.insertMany([
      {
        title: 'Annual General Body Meeting (AGM) & Infrastructure Review',
        content: 'The 2026 Annual General Meeting will convene this Sunday at 10:30 AM in the Community Clubhouse. Agenda includes preventive plumbing riser overhaul and monsoon readiness.',
        category: 'General',
        isPinned: true,
        createdBy: admin._id
      },
      {
        title: 'Scheduled Water Tank Cleaning — Tower A & B',
        content: 'Underground and overhead water tanks will undergo deep pressure cleaning on Wednesday from 10:00 AM to 03:00 PM. Water supply will remain paused during this window.',
        category: 'Maintenance',
        isPinned: true,
        createdBy: admin._id
      }
    ]);

    console.log('[Seeder] Fixtures loaded successfully with billing & technician rosters.');
  } catch (err) {
    console.error('[Seeder Error] Failed to seed fixtures:', err);
  }
};

module.exports = seedData;
