export const storeGet = (key) => {
  const encodedAppStore = localStorage.getItem(`oyk-${key}`);
  return encodedAppStore ? JSON.parse(encodedAppStore) : null;
};

export const storeSet = (key, value) => {
  if (value !== undefined && value !== null) {
    localStorage.setItem(`oyk-${key}`, JSON.stringify(value));
  } else {
    storeRemove(key);
  }
};

export const storeRemove = (key) => {
  localStorage.removeItem(`oyk-${key}`);
};

export const storeClear = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("oyk-")) {
        localStorage.removeItem(key);
    }
  });
};
