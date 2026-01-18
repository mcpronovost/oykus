import { API_URL, API_HEADERS, oykEncode, oykDecode } from "./utils";
import { KEY_USER, KEY_RAT } from "@/services/store/constants";
import { storeGet, storeRemove } from "@/services/store/utils";

class OykApi {
  get lang() {
    return window.document.documentElement.lang;
  }

  get token() {
    return storeGet(KEY_RAT);
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      ...API_HEADERS,
      ...options.headers,
      "Accept-Language": this.lang,
    };

    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    if (this.token) {
      headers.Authorization = `Oyk ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (
          (url.endsWith("logout/") || url.endsWith("logoutall/"))
        ) {
          return {
            success: true,
          };
        }
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error === "42S02") {
            errorMsg = "An internal error occurred, please contact an administrator";
          } else {
            errorMsg = errorData.error || JSON.stringify(errorData);
          }
        } catch (err) {
          errorMsg = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      if (response.status === 204) {
        return {
          success: true,
        };
      }

      const data = await response.json();
      return {
        success: true,
        ...data,
      };
    } catch (err) {
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: "GET",
      ...options,
    });
  }

  post(endpoint, data, options = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      method: "POST",
      body,
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  patch(endpoint, data, options = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      method: "PATCH",
      body,
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  async login(data) {
    const result = await this.post("/auth/login/", data);
    return result;
  }

  async logout() {
    const result = await this.post("/auth/logout/");
    storeRemove(KEY_USER);
    storeRemove(KEY_RAT);
    return result;
  }

  async getCurrentUser() {
    const result = await this.get("/auth/me/");
    return result;
  }
}

export const api = new OykApi();
export { oykEncode, oykDecode };
