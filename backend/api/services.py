from lingua import Language, LanguageDetectorBuilder
import deepl

from config.settings.base import DEEPL_AUTH_KEY


def detect_language(text):
    languages = [
        Language.ENGLISH,
        Language.UKRAINIAN,
        Language.ITALIAN,
        Language.RUSSIAN,
        Language.GERMAN,
        Language.SPANISH,
        Language.FRENCH,
    ]
    detector = LanguageDetectorBuilder.from_languages(*languages).build()
    confidence_values = detector.compute_language_confidence_values(text)
    detected_lang = [
        language.name for language, value in confidence_values if value > 0.8
    ]

    if 'ENGLISH' in detected_lang:
        return 'EN'
    elif 'UKRAINIAN' in detected_lang:
        return 'UK'
    else:
        raise ValueError('Language is not supported.')


def translate_text(word, language):
    auth_key = DEEPL_AUTH_KEY
    translator = deepl.Translator(auth_key)

    if language == 'EN':
        result = translator.translate_text(word, target_lang='UK')
        return {'ukWord': result.text, 'enWord': word}
    elif language == 'UK':
        result = translator.translate_text(word, target_lang='EN-US')
        return {'ukWord': word, 'enWord': result.text}
