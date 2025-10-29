// Format phone number as user types
export const formatPhoneNumber = (value) => {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};

// Check if input is a valid phone number (only digits)
export const isPhoneNumber = (value) => {
  return /^\d+$/.test(value.replace(/\D/g, ''));
};

// Format on display (for showing existing numbers)
export const displayPhoneNumber = (value) => {
  if (!value) return '';
  
  // Check if it's already formatted or contains letters
  if (value.includes('(') || /[a-zA-Z]/.test(value)) {
    return value;
  }
  
  return formatPhoneNumber(value);
};