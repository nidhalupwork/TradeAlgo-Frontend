import axios, { AxiosInstance } from 'axios';
import { toast } from '@/hooks/use-toast';
import { BACKEND_ENDPOINT } from '@/config/config';

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

    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.status === 429) {
          toast({
            variant: 'warn',
            title: 'Too many request',
            description: error?.response?.data?.message ?? 'Too many request',
          });
          return Promise.resolve(error?.response);
        } else if (error.status === 403) {
          toast({
            variant: 'warn',
            title: 'Forbidden',
            description: error?.response?.data?.message ?? 'Permission denied',
          });
          return Promise.resolve(error?.response);
        }
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
      throw error;
    }
  }

  // Example: POST request
  async post(path, data = {}, config = {}) {
    try {
      const response = await this.axiosInstance.post(path, data, config);
      console.log('response:', response);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        localStorage.removeItem('isSignedIn');
        window.location.href = '/auth';
      } else {
        throw error;
      }
    }
  }

  // Example: POST request
  async delete(path, config = {}) {
    try {
      const response = await this.axiosInstance.delete(path, config);
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

export default new ApiClient(BACKEND_ENDPOINT + '/api/v1'); // AWS
