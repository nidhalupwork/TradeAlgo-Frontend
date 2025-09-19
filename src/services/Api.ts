import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor if needed (e.g., add auth token)
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // For example, add authorization header here if exists
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor if needed (e.g., handle errors globally)
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle error (e.g., log out user on 401)
        return Promise.reject(error);
      }
    );
  }

  // Example: GET request
  async get(path, config = {}) {
    try {
      const response = await this.axiosInstance.get(path, config);

      return response.data;
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('isSignedIn');
        window.location.href = '/auth';
      }
    }
  }

  // Example: POST request
  async post(path, data = {}, config = {}) {
    try {
      const response = await this.axiosInstance.post(path, data, config);
      console.log('response:', response);

      return response.data;
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('isSignedIn');
        window.location.href = '/auth';
      }

      throw error;
    }
  }
}

export default new ApiClient('http://localhost:3000/api/v1');
