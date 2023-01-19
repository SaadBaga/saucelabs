import axios  from 'axios';

export const quizAPI = async () => {
  try {
    const response = await axios.get(`https://eok9ha49itquif.m.pipedream.net`);
    return response?.data?.questions || [];
  } catch (err) {
    return err;
  }
};