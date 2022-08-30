import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

from models import linearSVC_model


DATA_PATH = 'data/dataset.xlsx'
TEXT_FILES_PATH = 'data/text_data'
MODEL_PATH = 'model.pkl'
test_size = 0.3


def export_model(model):
    '''
    Exports model to file

    :param Pipeline model: Trained model
    '''
    joblib.dump(model, MODEL_PATH)


def read_data():
    '''
    Reads data from xlsx files

    :return: whole data and categories
    :rtype: DataFrame, DataFrame
    '''
    data = pd.read_excel(DATA_PATH)
    categories = pd.DataFrame(
        data, columns=['categories']).dropna().values.ravel()

    return data, categories


def get_sets(data):
    '''
    Prepares sets for training model

    :param DataFrame data: Whole data
    :return: data and labels sets
    :rtype: DataFrame, DataFrame
    '''
    X = pd.DataFrame(columns=['text'])
    y = pd.DataFrame(data, columns=['category_id'])

    ids = pd.DataFrame(data, columns=['id'])
    # getting texts from txt files saved by id
    for idx, row in ids.iterrows():
        id = row['id']
        with open(f'{TEXT_FILES_PATH}/{id}.txt', 'r') as f:
            X.loc[idx] = f.read()

    return X, y


def train_model():
    '''
    Trains and dump model

    :return: classification report of trained model
    :rtype: str
    '''

    data, categories = read_data()

    X, y = get_sets(data)

    # spliting sets for training and learning
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size)

    # flatten sets for fitting model
    y_train, y_test = y_train.values.ravel(), y_test.values.ravel()
    X_train, X_test = X_train.values.ravel(), X_test.values.ravel()

    # preparing labels
    labels = LabelEncoder()
    labels.fit_transform(y_train)

    model = linearSVC_model()
    model.fit(X_train, y_train)

    export_model(model)

    predicted = model.predict(X_test)

    return classification_report(y_test, predicted,
                                 target_names=[categories[i] for i in labels.classes_])


if __name__ == "__main__":
    score = train_model()
    print(score)
