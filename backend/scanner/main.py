import pytesseract

from scanner.scan import preprocess_img
from scanner.get_data import get_data


def get_data_from_text(text):
    '''
    Links to function get_data

    :param str text: Text from a receipt
    :return: Data extracted from a receipt text
    :rtype: {
        total: float,
        date: str,
        time: str
    }
    '''
    return get_data(text)


def remove_blank(text):
    '''
    Removes unnecessary white space

    :param str text: Text from a receipt
    :return: Clear text without unnecessary white space
    :rtype: str
    '''
    return " ".join(text.split())


def get_text_from_img(img):
    '''
    Reads text from image

    :param Image img: Text from a receipt
    :return: Text read by OCR from a receipt
    :rtype: str
    '''
    scan = preprocess_img(img)
    # changing segmenatation to automatic page segmentation with OSD
    # OSD - Orientation and Script Detection
    conf = r'--psm 1'
    # setting polish language nad configs
    text = pytesseract.image_to_string(scan, config=conf, lang='pol')
    clean_text = remove_blank(text)

    return clean_text
