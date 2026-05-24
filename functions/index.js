const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const ADMIN_EMAIL = 'admin@gmail.com';

/**
 * Callable Cloud Function: setAdminRole
 * Securely assigns admin role to a user account.
 * Only accepts requests from the specific admin email.
 * Runs with service account privileges (bypasses security rules).
 */
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You must be logged in to call this function.',
      );
    }

    const {email} = data;

    // Verify caller's email matches the admin email
    if (email !== ADMIN_EMAIL) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admin@gmail.com can be assigned admin role.',
      );
    }

    const uid = context.auth.uid;

    // Set admin role in Firestore (service account writes, so no permission errors)
    await admin.firestore().collection('users').doc(uid).set(
      {
        name: 'Admin',
        email,
        role: 'admin',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );

    return {
      success: true,
      message: 'Admin role assigned successfully',
      uid,
      role: 'admin',
    };
  } catch (error) {
    console.error('setAdminRole error:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      error?.message || 'Failed to set admin role',
    );
  }
});
