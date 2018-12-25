from flask import request
from flask import Flask
import pickle
from flask_cors import CORS
from flask import jsonify
#You need to use following line [app Flask(__name__]
nb_model = pickle.load(open('nb_model.sav', 'rb'))
bow_model_char = pickle.load(open('bow_model_char.sav', 'rb'))
nb_model.predict(bow_model_char.transform(["Hello from the other side"]))
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
@app.route('/<text>', methods=['GET'])
def login(text):
    if request.method == 'GET':
        a = nb_model.predict_proba(bow_model_char.transform([text]))
        res = str(nb_model.predict(bow_model_char.transform([text])))
        return jsonify(ARA = str(a[0][0]),  TUN = str(a[0][1]) , res = res)
        #return jsonify ()

if __name__ == '__main__':
    app.run(port=5000,debug=True)
