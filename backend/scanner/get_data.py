from datetime import datetime
import dateutil.parser
import re

DATE_FORMATS = ['%d-%m-%Y', '%d.%m.%Y', '%Y.%m.%d',
                '%d/%m/%Y', '%Y/%m/%d', 'dn.%yr%m.%d']


def try_parsing_date(date):
    '''
    Tries to parse extracted date to YYYY-mm-dd format

    :param str date: Date extracted from a receipt
    :return: Date in YYYY-mm-dd format
    :rtype: str
    :raises ValueError: if no valid date format is found
    '''
    for date_format in DATE_FORMATS:
        try:
            return datetime.strptime(date, date_format)
        except ValueError:
            pass
    raise ValueError('no valid date format found')


def format_date(date):
    '''
    Extracts data from text of a receipt

    :param str date: Date extracted from a receipt
    :return: Date in YYYY-mm-dd format
    :rtype: str
    '''
    try:
        return try_parsing_date(date).strftime('%Y-%m-%d')
    except ValueError:
        return date


def get_data(text):
    '''
    Extracts data from text of a receipt

    :param str text: Text from a receipt
    :return: Data extracted from a receipt text
    :rtype: Object
    '''
    total = re.findall(r'\b\d+[,.][ \t]?\d{2}\b', text)
    date = re.search(
        r'(\d{2}[-.,/]\d{2}[-.,/]\d{4})|(\d{4}[-.,/]\d{2}[-.,/]\d{2})|dn[.,]\d{2}r\d{2}[.,]\d{2}', text)
    time = re.search(r'\d{2}:\d{2}(:\d{2})*', text)
    return {
        'total': max(float(num.replace(',', '.').replace(' ', '')) for num in total) if total else None,
        'date': format_date(date.group().replace(',', '.')) if date else '',
        'time': (time.group() if len(time.group()) == 5 else time.group()[:-3]) if time else ''
    }
