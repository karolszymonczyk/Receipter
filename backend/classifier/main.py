from joblib import load

MODEL_PATH = 'classifier/model.pkl'

MODEL = load(MODEL_PATH)
CATEGORIES = [
    'grocery',
    'retail',
    'travel',
    'home',
    'health',
    'clothes',
    'services',
    'restaurants',
    'miscellaneous'
]


def classify_receipt(text):
    '''
    Predicts category of a receipt

    :param str text: Text from a receipt
    :return: Predicted category of a receipt
    :rtype: str
    '''
    [predicted] = MODEL.predict([text])
    return CATEGORIES[predicted]
