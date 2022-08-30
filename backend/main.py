from typing import Optional
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from cv2 import cv2


from utils.temp_save import save_upload_file_tmp
from scanner.main import get_text_from_img, get_data_from_text
from classifier.main import classify_receipt
from models.ReceiptInfo import ReceiptInfo
from models.Category import Category


app = FastAPI()


@app.post("/classify")
async def photo(photo: UploadFile = File(...)):
    '''
    Preprocess and classify photo

    :param File photo: Photo of receipt
    :return: Info about receipt from photo
    :rtype: ReceiptInfo
    '''
    tmp_path = save_upload_file_tmp(photo)
    try:
        img = cv2.imread(str(tmp_path))
        text = get_text_from_img(img)
        data = get_data_from_text(text)
        category = classify_receipt(text)
    except:
        # default category is grocery because it is the most frequent one
        return ReceiptInfo(date="", time="", total=None, category=Category.grocery)
    finally:
        tmp_path.unlink()
    return ReceiptInfo(**data, category=category)
