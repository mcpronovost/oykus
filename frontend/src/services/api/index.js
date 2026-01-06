import { authStore } from "../store/stores/auth";
import { ApiModuleLoader } from "./moduleLoader";
import health from "./health";
import tasks from "./tasks";
import auth from "./auth";

class ApiService {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.baseURL = baseURL;
    this.authStore = authStore; // Make authStore accessible to modules

    // Initialize module loader
    this.moduleLoader = new ApiModuleLoader(this);

    // Load API modules
    this.moduleLoader.loadModules({
      health,
      tasks,
      auth,
    });
  }

  // Utility method to bind any module's methods to this instance
  bindModule(module) {
    Object.keys(module).forEach((methodName) => {
      this[methodName] = async (...args) => {
        return await module[methodName](this, ...args);
      };
    });
  }

  async request(endpoint, options = {}) {
    // In development, use relative URLs for proxy
    const url = import.meta.env.DEV
      ? `${this.baseURL}/api${endpoint}`
      : `${this.baseURL}${endpoint}`;

    // Get auth token if available
    const token = authStore.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle specific HTTP status codes
      if (response.status === 204) {
        return { status: 204 };
      }

      if (response.status === 401) {
        // authStore.logout();
        throw response;
      }

      if (response.status === 403) {
        throw response;
      }

      if (response.status === 404) {
        throw response;
      }

      if (response.status === 422) {
        throw response;
      }

      if (response.status >= 500) {
        throw response;
      }

      if (!response.ok) {
        throw response;
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      const contentType = error.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        throw {
          status: error.status,
          error: await error.json(),
        };
      } else {
        throw error;
      }
    }
  }

  async get(url, options = {}) {
    try {
      const response = await this.request(url, options);
      return response;
    } catch (e) {
      throw e;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return authStore.isAuthenticated();
  }

  // Get current user
  getCurrentUser() {
    return authStore.getUser();
  }
}

export const api = new ApiService();
