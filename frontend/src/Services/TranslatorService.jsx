import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const getTranslate = async (word) => {
    const subscriptionKey = process.env.REACT_APP_TRANSLATOR_API_KEY;
    const endpoint = process.env.REACT_APP_TRANSLATOR_API_ENDPOINT;
    const location = "westeurope";
    try {
        const response = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: "post",
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Ocp-Apim-Subscription-Region': location,
                'Content-Type': 'application/json',
                'X-ClientTraceId': uuidv4().toString(),
            },
            params: {
                'api-version': '3.0',
                'to': ['uk', 'en'],
            },
            data: [{
                'text': word,
            }],
            responseType: 'json',
        });
        const data = response.data[0];

        if ((data.detectedLanguage.language === 'en' || data.detectedLanguage.language === 'uk' || data.detectedLanguage.language === 'ru') && data.translations[0].text.length > 0) {
            const obj = {
                language: data.detectedLanguage.language,
                ukWord: data.translations[0].text.toLowerCase(),
                enWord: data.translations[1].text.toLowerCase()
            }
            return obj;
        } else {
            console.log('Language not supported');
        }
    } catch (error) {
        console.error(error);
    }
}

export default getTranslate;
