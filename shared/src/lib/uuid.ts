export { v7 as uuidv7 } from 'uuid';

import { randomUUID } from 'expo-crypto';

export const uuidv7WithExpo = () => {
  const timestamp = Date.now();
  const randomPart = randomUUID().replace(/-/g, '').substring(8);

  return `${timestamp.toString(16).padStart(12, '0')}-${randomPart.substring(
    0,
    4
  )}-7${randomPart.substring(4, 7)}-${randomPart.substring(7, 11)}-${randomPart.substring(11, 23)}`;
};
