import firestore from '@react-native-firebase/firestore';
import {createJob} from './jobService';
 
import {createNotification} from './notificationService';

const sampleJobs = [
  {
    title: 'Premium Delivery Driver',
    description:
      'Join a top-tier team delivering express packages in the city. Competitive pay, flexible schedule, and great support.',
    salary: '26000',
    type: 'Full-time',
    location: 'New York, NY',
    employerId: 'demo-employer-1',
    employerName: 'Skyline Logistics',
  },
  {
    title: 'Senior UX Designer',
    description:
      'Lead product design for a fast-growing startup. Build polished user experiences and collaborate with a premium team.',
    salary: '92000',
    type: 'Remote',
    location: 'San Francisco, CA',
    employerId: 'demo-employer-2',
    employerName: 'Luna Studio',
  },
  {
    title: 'Sales Associate',
    description:
      'Drive customer success in a boutique retail environment. Excellent commission structure and brand training included.',
    salary: '38000',
    type: 'Part-time',
    location: 'Chicago, IL',
    employerId: 'demo-employer-3',
    employerName: 'Bright Boutique',
  },
];

export const seedDemoJobsIfEmpty = async () => {
  const snapshot = await firestore().collection('jobs').limit(1).get();
  if (!snapshot.empty) {
    return;
  }

  for (const job of sampleJobs) {
    await createJob(job);
  }
};

export const seedDemoNotificationsForUser = async (userId) => {
  const snapshot = await firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return;
  }

  await createNotification(userId, {
    title: 'Welcome to FairWork',
    body: 'You are all set! Explore premium jobs and connect with top employers.',
    jobId: '',
  });

  await createNotification(userId, {
    title: 'Top match alert',
    body: 'A new job listing just arrived that may match your skills. Check it out now.',
    jobId: '',
  });
};

 