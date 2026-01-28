import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 15000 // 15 seconds timeout
});

// Retry logic for failed requests
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = 0;
    }
    
    config.retry += 1;
    
    // Retry up to 2 times for network errors or 5xx errors
    if (config.retry <= 2 && (
      !error.response || 
      (error.response.status >= 500 && error.response.status < 600)
    )) {
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retry));
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

export default api;