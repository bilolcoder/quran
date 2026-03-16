import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.quran.com/api/v4',
  headers: {
    'Accept': 'application/json',
  },
});

export const fetchChapters = async () => {
  const response = await api.get('/chapters');
  return response.data.chapters;
};

export const fetchSurahDetails = async (id) => {
  const response = await api.get(`/chapters/${id}`);
  return response.data.chapter;
};

export const fetchVerses = async (id, translationId = 131) => { // 131 is typically a common English translation
  const response = await api.get(`/verses/by_chapter/${id}`, {
    params: {
      language: 'en',
      words: true,
      translations: translationId,
      fields: 'text_uthmani,text_simple',
      per_page: 300,
    },
  });
  return response.data.verses;
};

export const fetchPrayerTimes = async (lat, lng) => {
  const response = await axios.get(`https://api.aladhan.com/v1/timings`, {
    params: {
      latitude: lat,
      longitude: lng,
      method: 3, // Muslim World League as default
    },
  });
  return response.data.data;
};

export default api;
