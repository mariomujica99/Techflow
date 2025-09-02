export const getInitials = (name = "") => {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  if (parts.length === 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // For 3+ names, take first, middle, and last
  return (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
};