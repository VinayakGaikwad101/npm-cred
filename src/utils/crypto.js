import { scryptSync, createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const AUTH_TAG_LENGTH = 16;

// Generate encryption key from password using salt
const getKey = (password, salt) => {
  return scryptSync(password, salt, KEY_LENGTH);
};

// Encrypt data with password
const encrypt = (data, password) => {
  // Generate random salt and IV
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);

  // Generate key from password and salt
  const key = getKey(password, salt);

  // Create cipher
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH
  });

  // Encrypt data
  const encryptedData = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final()
  ]);

  // Get auth tag
  const authTag = cipher.getAuthTag();

  // Combine all components
  return Buffer.concat([
    salt,           // First 16 bytes: salt
    iv,             // Next 12 bytes: IV
    authTag,        // Next 16 bytes: auth tag
    encryptedData   // Rest: encrypted data
  ]).toString('base64');
};

// Decrypt data with password
const decrypt = (encryptedData, password) => {
  try {
    // Convert from base64
    const buffer = Buffer.from(encryptedData, 'base64');

    // Extract components using subarray
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    const data = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

    // Generate key from password and salt
    const key = getKey(password, salt);

    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH
    });
    decipher.setAuthTag(authTag);

    // Decrypt data
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    throw new Error('Failed to decrypt data. Invalid password or corrupted data.');
  }
};

export {
  encrypt,
  decrypt
};
