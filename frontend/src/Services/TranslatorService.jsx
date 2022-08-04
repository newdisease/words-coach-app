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

        let obj = {};
        if (['en', 'uk', 'ru'].includes(data.detectedLanguage.language) && data.translations[0].text.length > 0) {
            obj = {
                language: data.detectedLanguage.language,
                ukWord: data.translations[0].text.toLowerCase(),
                enWord: data.translations[1].text.toLowerCase()
            }
        } else {
            obj = {
                language: 'This language is not supported'
            }
        }
        return obj;
    } catch (error) {
        throw error;
    }
}

export default getTranslate;
