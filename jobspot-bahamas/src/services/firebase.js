import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Error handling wrapper
const handleFirebaseError = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error('Firebase operation failed:', error);
    throw new Error(error.message);
  }
};

export const FirebaseService = {
  // User Operations
  async createUser(uid, userData) {
    // ...existing user operations...
  },

  // Job Operations
  async searchJobs(params) {
    return handleFirebaseError(async () => {
      let q = collection(db, 'jobs');
      const constraints = [];

      // ...existing constraints...

      if (params.maxSalary) constraints.push(where('salary.max', '<=', params.maxSalary));
      if (params.skills.length > 0) {
        constraints.push(where('skills', 'array-contains-any', params.skills));
      }
      if (params.experience) {
        constraints.push(where('experience.min', '<=', params.experience));
      }

      // ...rest of existing search implementation...
    });
  },

  // Application Operations
  async getUserApplications(userId) {
    return handleFirebaseError(async () => {
      const applications = [];
      const jobsSnapshot = await getDocs(collection(db, 'jobs'));
      
      for (const jobDoc of jobsSnapshot.docs) {
        const q = query(
          collection(db, `jobs/${jobDoc.id}/applications`),
          where('userId', '==', userId)
        );
        const applicationSnapshot = await getDocs(q);
        
        applications.push(...applicationSnapshot.docs.map(doc => ({
          id: doc.id,
          jobId: jobDoc.id,
          jobTitle: jobDoc.data().title,
          companyName: jobDoc.data().company,
          companyLogo: jobDoc.data().companyLogo,
          location: jobDoc.data().location,
          salary: jobDoc.data().salary,
          ...doc.data()
        })));
      }
      
      return applications.sort((a, b) => b.createdAt - a.createdAt);
    });
  },

  // Analytics Operations
  async trackJobView(jobId, userId) {
    return handleFirebaseError(async () => {
      const jobRef = doc(db, 'jobs', jobId);
      const analyticsRef = doc(db, `jobs/${jobId}/analytics/views`);
      
      const batch = writeBatch(db);
      
      batch.update(jobRef, {
        views: increment(1)
      });
      
      batch.set(analyticsRef, {
        [`${Timestamp.now().toMillis()}`]: {
          userId,
          timestamp: Timestamp.now()
        }
      }, { merge: true });

      await batch.commit();
    });
  }
};

// Add error handling to all operations
Object.keys(FirebaseService).forEach(key => {
  const originalMethod = FirebaseService[key];
  FirebaseService[key] = (...args) => handleFirebaseError(() => 
    originalMethod.apply(FirebaseService, args)
  );
});

export default FirebaseService;
