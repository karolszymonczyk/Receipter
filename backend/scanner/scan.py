from cv2 import cv2
import pytesseract
import imutils
import os
import numpy as np


def get_corners_in_order(corners):
    '''
    Orders corners in order: top-left, top-right, bottom-right, bottom-left

    :param [[float, float]] corners: Corners of a receipt
    :return: Corners in correct order
    :rtype: [[float, float]]
    '''
    # sorting array by y coordinate and splitting to top and bottom corners
    top, bottom = np.split(corners[corners[:, 1].argsort()], 2)
    # getting top-left and top-right by x coordinate
    tl, tr = top[top[:, 0].argsort()]
    # getting bottom-left and bottom-right by x coordinate
    bl, br = bottom[bottom[:, 0].argsort()]

    return [tl, tr, br, bl]


def transform_img(original, corners):
    '''
    Transforms image with perspective

    :param Image original: Photo of a receipt
    :param [[float, float]] corners: Corners of a receipt
    :return: Transformed photo of a receipt
    :rtype: Image
    '''
    img = original.copy()
    # getting original height and width of the image
    height, width = img.shape[0], img.shape[1]
    ordered_corners = get_corners_in_order(corners.reshape(4, 2))
    src = np.float32(ordered_corners)
    dst = np.float32([
        [0, 0],
        [width - 1, 0],
        [width - 1, height - 1],
        [0, height - 1]])

    # calculating matrix of transformation
    matrix = cv2.getPerspectiveTransform(src, dst)
    transformed_image = cv2.warpPerspective(
        img, matrix, (width, height))

    return transformed_image


def get_receipt_corners(img, thr):
    '''
    Finds corners of a receipt

    :param Image img: Photo of a receipt
    :param Image thr: Thresholded photo of a receipt
    :return: Corners of a receipt
    :rtype: [[float, float]]
    '''
    # find all contours in the image
    contours = imutils.grab_contours(cv2.findContours(
        thr, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE))

    # get 3 biggest contours and removing frame contour
    biggest_contours = sorted(contours, key=cv2.contourArea, reverse=True)[1:4]

    # finding 4-corners shape from biggest contours
    for contours in biggest_contours:
        # length of perimieter of the contour
        perimeter = cv2.arcLength(contours, True)
        # approximation with polygon (eps maximum distance from contour to approximated contour)
        corners = cv2.approxPolyDP(contours, 0.03 * perimeter, True)
        # checking if approximation has 4 corners
        if len(corners) == 4:
            return corners

    return None


def preprocess_img(original):
    '''
    Preprocess photo of a receipt

    :param Image original: Photo of a receipt
    :return: Binarized photo of a receipt
    :rtype: Image
    '''
    img = original.copy()
    # turining photo to gray
    grayscaled = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # removing noises
    blured = cv2.medianBlur(grayscaled, 5)
    sharpen_kernel = np.array([[-1, -1, -1],
                               [-1, 9, -1],
                               [-1, -1, -1]])
    # sharpen image to make finding borders easier
    sharpened = cv2.filter2D(blured, -1, sharpen_kernel)
    inverted = cv2.bitwise_not(sharpened)
    _, thresholded = cv2.threshold(inverted, 160, 255, cv2.THRESH_BINARY)

    corners = get_receipt_corners(img, thresholded)

    transformed = grayscaled if corners is None else transform_img(
        grayscaled, corners)

    binarized = cv2.adaptiveThreshold(
        transformed, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 81, 20)

    return binarized
