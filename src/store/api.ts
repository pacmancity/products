import axios, {AxiosInstance} from "axios";

export const dummyApi = axios.create({
  baseURL: 'https://dummyjson.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AIRTABLE_BASE_ID = 'appqzUpSKoEruFhlG';
const AIRTABLE_API_KEY = 'pat3uH32MvhkWZEO4.b1ea0fd8d34a23e497b188926efe6f2e7e8ce6585b8fd8b2744509ad91168cca';

const createAirtableApi = (tableName: string): AxiosInstance => {
  return axios.create({
    baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}/`,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
};

export const favoriteApi = createAirtableApi('favorite');
export const deletedApi = createAirtableApi('deleted');
export const productApi = createAirtableApi('product');

export const uploadThumbnail = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'default');

  const response = await fetch('https://api.cloudinary.com/v1_1/dlpxnd6yc/image/upload', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error();
  const responseData = await response.json();
  return responseData.secure_url;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'default');

    return fetch('https://api.cloudinary.com/v1_1/dlpxnd6yc/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(responseData => responseData.secure_url);
  });
  return await Promise.all(uploadPromises);
};
