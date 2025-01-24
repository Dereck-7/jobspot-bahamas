import { Timestamp } from 'firebase/firestore';

export const USER_SCHEMA = {
  uid: String,             // Firebase Auth UID
  email: String,           // Email address
  displayName: String,     // Full name
  photoURL: String,        // Profile picture URL
  phoneNumber: String,     // Contact number
  location: String,        // Current location
  title: String,          // Professional title
  bio: String,            // Short biography
  skills: Array,          // Array of skills
  experience: String,     // Work experience
  resume: String,         // Resume URL
  social: {
    linkedin: String,
    github: String,
    website: String
  },
  notifications: {
    email: Boolean,
    push: Boolean,
    jobAlerts: Boolean,
    applicationUpdates: Boolean
  },
  preferences: {
    jobTypes: Array,      // ['Full-time', 'Part-time', etc.]
    locations: Array,     // Preferred work locations
    salary: {
      min: Number,
      max: Number,
      currency: String
    },
    remote: Boolean       // Interested in remote work
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
};

export const JOB_SCHEMA = {
  // ...existing job schema...
};

export const COMPANY_SCHEMA = {
  // ...existing company schema...
};

export const APPLICATION_SCHEMA = {
  // ...existing application schema...
};

export const SAVED_JOBS_SCHEMA = {
  // ...existing saved jobs schema...
};

export function validateSchema(data, schema) {
  const errors = [];
  
  Object.keys(schema).forEach(key => {
    const expectedType = schema[key];
    const value = data[key];
    
    if (value !== undefined && value !== null) {
      if (expectedType === Array && !Array.isArray(value)) {
        errors.push(`${key} must be an array`);
      } else if (expectedType !== Array && typeof value !== typeof expectedType()) {
        errors.push(`${key} must be type ${typeof expectedType()}`);
      }
    }
  });
  
  return errors;
}
