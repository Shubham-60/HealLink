const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong", response.status);
  }
  
  return data;
};

export const authApi = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

export const tokenManager = {
  set: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("heallink_token", token);
    }
  },
  
  get: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("heallink_token");
    }
    return null;
  },
  
  remove: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("heallink_token");
    }
  },
};
