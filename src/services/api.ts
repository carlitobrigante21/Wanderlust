import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import type { Destination } from '../types';

interface JsonPlaceholderPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const API_TIMEOUT = 10000;
const baseURL = 'https://jsonplaceholder.typicode.com';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message ?? 'Request failed';
    return Promise.reject(new Error(message));
  },
);

const travelTags = ['Culture', 'Food', 'Adventure', 'Scenic', 'Relaxation'];

const mapPostToDestination = (post: JsonPlaceholderPost, index: number): Destination => ({
  id: post.id,
  title: post.title
    .split(' ')
    .map((word, wordIndex) => (wordIndex === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' '),
  description: post.body.slice(0, 120).replace(/\s+/g, ' ').trim(),
  country: ['Georgia', 'Portugal', 'Japan', 'Canada', 'Morocco'][index % 5] ?? 'Unknown',
  region: ['Caucasus', 'Europe', 'Asia', 'North America', 'Africa'][index % 5] ?? 'World',
  duration: ['3 days', '5 days', '7 days', '10 days', '14 days'][index % 5] ?? '4 days',
  rating: Number((4.2 + (index % 4) * 0.4).toFixed(1)),
  image: `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80`,
  tags: travelTags.slice(index % 3, index % 3 + 2),
  article: post.body,
  featured: index === 0,
  isPopular: index % 2 === 0,
});

const apiService = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(url, config).then((response) => response.data);
  },

  post<T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.post<T>(url, data, config).then((response) => response.data);
  },

  async getDestinations(limit = 10): Promise<Destination[]> {
    const posts = await this.get<JsonPlaceholderPost[]>('/posts', {
      params: { _limit: limit },
    });

    return posts.map((post, index) => mapPostToDestination(post, index));
  },
};

export { apiService };
export default apiService;
