export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Onbekende datum";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
  }).format(date);
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Onbekende tijd";
  return `${date.getHours()}.${String(date.getMinutes()).padStart(2, "0")}`;
};

export const getCategoryNames = (categoryIds = [], categories = []) => {
  return categoryIds
    .map((id) => categories.find((cat) => cat.id === id))
    .filter(Boolean)
    .map((cat) => cat.name);
};
