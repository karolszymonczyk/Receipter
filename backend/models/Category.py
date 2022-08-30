from enum import Enum


class Category(str, Enum):
    '''
    Enum class to represent a category
    '''
    grocery = 'grocery'
    retail = 'retail'
    travel = 'travel'
    home = 'home'
    health = 'health'
    clothes = 'clothes'
    services = 'services'
    restaurants = 'restaurants'
    miscellaneous = 'miscellaneous'
