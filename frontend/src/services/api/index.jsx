import { API_URL, API_HEADERS, oykEncode, oykDecode } from "./utils";
import { KEY_USER } from "@/services/store/constants";
import { storeRemove } from "@/services/store/utils";

class OykApi {
  get lang() {
    return window.document.documentElement.lang;
  }

  get rat() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("oyk-rat="))
      ?.split("=")[1];
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

    if (this.rat) {
      // headers.Authorization = `Oyk ${this.rat}`;
      headers["X-CSRFToken"] = this.rat;
    }

    const fetchOptions = {
      ...options,
      headers,
      credentials: "include",
    };

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        if (url.endsWith("logout/") || url.endsWith("logoutall/")) {
          return {
            ok: true,
          };
        }
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          return errorData;
        } catch {
          if (response.status === 404) errorMsg = `Not found`;
        }
        throw new Error(errorMsg, { cause: response.status });
      }

      if (response.status === 204) {
        return {
          ok: true,
        };
      }

      const data = await response.json();
      return {
        ok: true,
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
    const r = await this.post("/auth/login/", data, { withCredentials: true });
    return r;
  }

  async logout() {
    try {
      await this.post("/auth/logout/", {}, { withCredentials: true });
    } finally {
      storeRemove(KEY_USER);
      return;
    }
  }
}

export const api = new OykApi();
export { oykEncode, oykDecode };
