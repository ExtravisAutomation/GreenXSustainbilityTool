export const Validator = (_, value) => {
  // const regex = /^[a-zA-Z0-9\s]+$/;
  const regex = /^[a-zA-Z0-9\s,]+$/;
  if (!value || regex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject("Special characters are not allowed");
};

export const integerValidator = (_, value) => {
  const regex = /^\d+$/; // Regular expression to allow only integers
  if (!value || regex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject("Only integers are allowed");
};
