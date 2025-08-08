export const formateOptions = (data) =>
  data?.map((option) => ({ value: option, label: option })) || [];

export const formateOptionsWithId = (data, nameKey = '',valueKey = 'id') =>
  data?.map((option) => ({ value: option[valueKey], label: option[nameKey] })) || [];

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
