export const useApi = () => {
  const baseURL = 'http://localhost:5555/api';

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const get = async (endpoint: string): Promise<any> => {
    return await $fetch(`${baseURL}${endpoint}`, {
      headers: getHeaders()
    });
  };

  const post = async (
    endpoint: string,
    payload: BodyInit | Record<string, any> | null | undefined
  ): Promise<any> => {
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: payload
    });
  };

  const remove = async (
    endpoint: string,
    payload: BodyInit | Record<string, any> | null | undefined
  ): Promise<any> => {
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: payload
    });
  };

  const put = async (
    endpoint: string,
    payload: BodyInit | Record<string, any> | null | undefined
  ): Promise<any> => {
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: payload
    });
  };

  return { get, post, remove, put };
};
