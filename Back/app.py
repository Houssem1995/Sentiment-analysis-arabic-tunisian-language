import pickle
from flask_cors import CORS, cross_origin
from flask import jsonify
import os
from flask import Flask, flash, request, redirect, url_for, session
import logging
from werkzeug.utils import secure_filename


#You need to use following line [app Flask(__name__]

nb_model = pickle.load(open('nb_model.sav', 'rb'))
bow_model_char = pickle.load(open('bow_model_char.sav', 'rb'))
nb_model.predict(bow_model_char.transform(["Hello from the other side"]))

app = Flask(__name__)
logger = logging.getLogger('HELLO WORLD')   


APP_ROOT = os.path.dirname(os.path.abspath(__file__))  
UPLOAD_FOLDER = '/home/houssem/files'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']) 
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



cors = CORS(app, resources={r"/*": {"origins": "*"}})



@app.route('/<text>', methods=['GET'])
def login(text):
    if request.method == 'GET':
        a = nb_model.predict_proba(bow_model_char.transform([text]))
        res = str(nb_model.predict(bow_model_char.transform([text])))
        if (res == "['ARA']"):
            res = 'Arabic'
        else:
            res = 'Tunisian'
        return jsonify(ARA = str(a[0][0]),  TUN = str(a[0][1]) , res = res)
        #return jsonify ()


@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,'test_docs')
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload`")
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    response="Gotcha Text mining Project"
    return response

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(port=5000,debug=True)

flask_cors.CORS(app, expose_headers='Authorization')
