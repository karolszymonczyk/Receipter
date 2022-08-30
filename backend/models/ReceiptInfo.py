from pydantic import BaseModel
from typing import Optional

from models.Category import Category


class ReceiptInfo(BaseModel):
    '''
    Class to represent a receipt

    Attributes
    ----------
    date : str
        date of purchase
    time : str
        time of purchase
    category : Category
        category of a receipt
    total : float
        total value of a receipt
    '''
    date: str
    time: str
    category: Category
    total: Optional[float] = None
