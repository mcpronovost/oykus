export const validateUsername = (username) => {
  if (!username.trim()) {
    return "Username is required";
  } else if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
    return "Username must be 3-32 characters, alphanumeric and underscores only";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:;.,])[a-zA-Z\d@$!%*?&:;.,]{8,}$/.test(
      password
    )
  ) {
    return "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validateName = (name) => {
  if (!name.trim()) {
    return "Name is required";
  } else if (!/^[\p{L}\p{N}\s\-']{2,50}$/u.test(name)) {
    return "Name must be 2-50 characters, letters, numbers, spaces, hyphens, apostrophes only";
  }
  return null;
};