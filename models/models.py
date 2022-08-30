from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer

from sklearn.dummy import DummyClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC, LinearSVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier


def prepare_data():
    '''
    Prepares data for classification

    :return: CountVectorizer and TifidfTransformer
    :rtype: (str, func), (str, func)
    '''
    return ('vect', CountVectorizer()), ('tfidf', TfidfTransformer()),


def SVC_model(kernel):
    '''
    Prepares SVC classification pipeline

    :param str kernel: Kernel of SVC classifier
    :return: Pipeline of SVC classifier
    :rtype: Pipeline
    '''
    vect, tfidf = prepare_data()
    return Pipeline([vect, tfidf,
                     ('clf', SVC(kernel=kernel))])


def dummy_model():
    '''
    Prepares dummy classification pipeline

    :return: Pipeline of dummy classifier
    :rtype: Pipeline
    '''
    vect, tfidf = prepare_data()
    return Pipeline([vect, tfidf,
                     ('clf', DummyClassifier())])


def KNN_model():
    '''
    Prepares KNN classification pipeline

    :return: Pipeline of K-nearest neighbours classifier
    :rtype: Pipeline
    '''
    vect, tfidf = prepare_data()
    return Pipeline([vect, tfidf,
                     ('clf', KNeighborsClassifier())])


def sigmSVC_model():
    '''
    Prepares sigmoid SVC classification pipeline

    :return: Pipeline of sigmoid SVC classifier
    :rtype: Pipeline
    '''
    return SVC_model('sigmoid')


def polySVC_model():
    '''
    Prepares polynomial SVC classification pipeline

    :return: Pipeline of polynomial SVC classifier
    :rtype: Pipeline
    '''
    return SVC_model('poly')


def rbfSVC_model():
    '''
    Prepares gaussian SVC classification pipeline

    :return: Pipeline of gaussian SVC classifier
    :rtype: Pipeline
    '''
    return SVC_model('rbf')


def linearSVC_model():
    '''
    Prepares linear SVC classification pipeline

    :return: Pipeline of linear SVC classifier
    :rtype: Pipeline
    '''
    vect, tfidf = prepare_data()
    return Pipeline([vect, tfidf,
                     ('clf', LinearSVC())])


def decision_tree_model():
    '''
    Prepares decision tree classification pipeline

    :return: Pipeline of decision tree classifier
    :rtype: Pipeline
    '''
    vect, tfidf = prepare_data()
    return Pipeline([vect, tfidf,
                     ('clf', DecisionTreeClassifier())])


def random_forest_model():
    '''
    Prepares random forest classification pipeline

    :return: Pipeline of random forest classifier
    :rtype: Pipeline
    '''
    vect, tfidf = prepare_data()
    return Pipeline([vect, tfidf,
                     ('clf', RandomForestClassifier())])


def MLP_model():
    '''
    Prepares multi-layer perceptron classification pipeline

    :return: Pipeline of multi-layer perceptron classifier
    :rtype: Pipeline
    '''
    vect, tfidf = prepare_data()
    return Pipeline([vect, tfidf,
                     ('clf', MLPClassifier(max_iter=300))])
