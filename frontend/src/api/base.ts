const BASE_URL = '/api';

const request = async (url: string, method: string, data?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'FRONTEND_URL': window.location.origin,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  return responseData;
};

export const get = (url: string) => request(url, 'GET');
export const post = (url: string, data: any) => request(url, 'POST', data);