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
  await firestore().collection('jobs').doc(jobId).update({
    applicants: firestore.FieldValue.arrayUnion({
      userId,
      userName,
      appliedAt: firestore.FieldValue.serverTimestamp(),
    }),
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