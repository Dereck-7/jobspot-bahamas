import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - The folder path in storage (default: 'resumes')
 * @returns {Promise<string>} The download URL of the uploaded file
 */
export const uploadFile = async (file, folder = 'resumes') => {
  if (!file) throw new Error('No file provided');
  if (!validateFile(file)) throw new Error('Invalid file');

  const storage = getStorage();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);

  try {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error initiating upload:', error);
    throw error;
  }
};

/**
 * Validates a file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the file is valid
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  } = options;

  if (!file) return false;
  if (file.size > maxSize) return false;
  if (!allowedTypes.includes(file.type)) return false;

  return true;
};
