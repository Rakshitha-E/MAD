import firestore from '@react-native-firebase/firestore';

export const createJob = async (jobData) => {
  try {
    await firestore().collection('jobs').add({
      ...jobData,
      applicants: [],
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const applyToJob = async (jobId, userId, userName) => {
  const jobRef = firestore().collection('jobs').doc(jobId);

  await firestore().runTransaction(async transaction => {
    const snap = await transaction.get(jobRef);
    if (!snap.exists) {
      throw new Error('Job not found');
    }

    const data = snap.data() || {};
    const applicants = Array.isArray(data.applicants) ? data.applicants : [];

    const alreadyApplied = applicants.some(a => a?.userId === userId);
    if (alreadyApplied) return;

    const nextApplicants = [
      ...applicants,
      {
        userId,
        userName,
        appliedAt: firestore.FieldValue.serverTimestamp(),
      },
    ];

    transaction.update(jobRef, {applicants: nextApplicants});
  });
};

export const deleteJob = async jobId => {
  await firestore().collection('jobs').doc(jobId).delete();
};

export const getJobsRealtime = (
  callback,
  errorCallback = () => {},
) => {
  return firestore()
    .collection('jobs')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const jobs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(jobs);
      },
      error => {
        console.log('getJobsRealtime error:', error);
        errorCallback(error);
      },
    );
};

export const getEmployerJobsRealtime = (
  userId,
  callback,
  errorCallback = () => {},
) => {
  return firestore()
    .collection('jobs')
    .where('employerId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const jobs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(jobs);
      },
      error => {
        console.log('getEmployerJobsRealtime error:', error);
        errorCallback(error);
      },
    );
};