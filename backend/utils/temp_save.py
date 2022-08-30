from fastapi import UploadFile
from tempfile import NamedTemporaryFile
from pathlib import Path
import shutil


def save_upload_file_tmp(file: UploadFile):
    '''
    Creates temporary file for photo

    :param File file: Photo to save
    :return: path to temporary file
    :rtype: str
    '''
    try:
        suffix = Path(file.filename).suffix
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = Path(tmp.name)
    except:
        return None
    finally:
        file.file.close()
    return tmp_path
