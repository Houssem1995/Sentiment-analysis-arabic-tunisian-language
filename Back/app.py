import pickle
from flask_cors import CORS, cross_origin
from flask import jsonify , send_file
import os
from flask import Flask, flash, request, redirect, url_for, session, Response
import logging
from werkzeug.utils import secure_filename
import re
import html
import pandas as pd

#You need to use following line [app Flask(__name__]

nb_model = pickle.load(open('nb_model.sav', 'rb'))
bow_model_char = pickle.load(open('bow_model_char.sav', 'rb'))



# nb_model.predict(bow_model_char.transform(["Hello from the other side"]))



AR_BOW_model = pickle.load(open('AR_BOW_SENT', 'rb'))
AR_sent_model = pickle.load(open('AR_SENT', 'rb'))

tun_bow_model = pickle.load(open('tun_bow_model','rb'))
TUN_sent_model =  pickle.load(open('TUN_SENT','rb'))





app = Flask(__name__)
logger = logging.getLogger('HELLO WORLD')


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = '/tmp'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



cors = CORS(app, resources={r"/*": {"origins": "*"}})
def read_text_file(filename):
    print('Reading file ' + filename + "...")
    with open(filename, "r") as textfile:
        L = []
        for line in textfile:
            L.append(line.strip())
        print('File contains ', len(L), "lines.\n")
        return L

def cleanup_text(text):
    # Remove URLs
    two_plus_letters_RE = re.compile(r"(\w)\1{1,}", re.DOTALL)
    three_plus_letters_RE = re.compile(r"(\w)\1{2,}", re.DOTALL)
    two_plus_words_RE = re.compile(r"(\w+\s+)\1{1,}", re.DOTALL)

    text = re.sub('((www\.[^\s]+)|(https?://[^\s]+))', '', text)

    # Remove user mentions of the form @username
    text = re.sub('@[^\s]+', '', text)

    # Replace special html-encoded characters with their ASCII equivalent, for example: &#39 ==> '
    #if re.search("&#",text):
      #  text = html.unescape(text)

    # Remove special useless characters such as _x000D_
    text = re.sub(r'_[xX]000[dD]_', '', text)

    # Replace all non-word characters (such as emoticons, punctuation, end of line characters, etc.) with a space
    text = re.sub('[\W_]', ' ', text)

    # Remove redundant white spaces
    text = text.strip()
    text = re.sub('[\s]+', ' ', text)

    # normalize word elongations (characters repeated more than twice)
    text = two_plus_letters_RE.sub(r"\1\1", text)
    text = two_plus_words_RE.sub(r"\1", text)

    return text

@app.route('/<text>', methods=['GET'])
def login(text):
    if request.method == 'GET':
        a = nb_model.predict_proba(bow_model_char.transform([text]))
        res = str(nb_model.predict(bow_model_char.transform([text])))
        if (res == "['ARA']"):
            res = 'Arabic'
            b = AR_sent_model.predict_proba(AR_BOW_model.transform([text]))
            if (str(a[0][0]) == "0.6388222184124804"):
                a[0][0]  = '0'
                a[0][1]  = '0'
                res = 'Nothing'
                b[0][0] = '0'
                b[0][1] = '0'
        else:
            res = 'Tunisian'
            b = TUN_sent_model.predict_proba(tun_bow_model.transform([text]))
        return jsonify(ARA = str(a[0][0]),  TUN = str(a[0][1]) , res = res , NEG = str(b[0][0]), POS = str(b[0][1]))
        #return jsonify ()

@app.route('/result.csv', methods=['GET'])
def getResult():
    if request.method == 'GET':
        res_sent=[]
        file = '/tmp/test_docs/Test'
        file_name = 'result.csv'
        corpus= read_text_file(file)
        corpus_clean =  [cleanup_text(doc) for doc in corpus]
        MAX_LAT_FRAC = 0.3
        corpus_clean = [doc for doc in corpus_clean if (len(re.findall('[a-zA-Z]',doc)) / (len(doc)+1)) < MAX_LAT_FRAC]
        res_lang = nb_model.predict(bow_model_char.transform(corpus_clean))
        for doc in corpus_clean:
            if ((str(nb_model.predict(bow_model_char.transform([doc])))) == "['ARA']"):
                res_sent.append(AR_sent_model.predict(AR_BOW_model.transform([doc]))[0])
            else:
                res_sent.append(TUN_sent_model.predict(tun_bow_model.transform([doc]))[0])
        df = pd.DataFrame({'Doc':corpus_clean,'Lang':res_lang,'Sent':res_sent})
        csv = df.to_csv(file_name,  index=True)
        return send_file('result.csv',attachment_filename= 'result.csv')

        # res_sent =  AR_sent_model.predict(BOW_SENT_model.transform(corpus_clean))

        #return jsonify(ARA = str(a[0][0]),  TUN = str(a[0][1]) , res = res , NEG = str(b[0][0]), POS = str(b[0][1]))
        #return jsonify ()

@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,'test_docs')
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload`")
    file = request.files['file']
    filename = 'Test'
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    response="Gotcha Text mining Project"
    return response

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(port=5000,debug=True)

flask_cors.CORS(app, expose_headers='Authorization')
