import { v4 as uuidv4 } from 'uuid';

export default function generateNoDashUUID(length: number | undefined) {
  const uuid = uuidv4().replace(/-/g, '');
  if (length) {
    return uuid.substring(0, length);
  } else {
    return uuid;
  }
}
