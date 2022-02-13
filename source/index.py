from crypt import methods
from flask import Flask
from flask import render_template, request
from random import randint, random

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def index():
    return render_template('index.html')

@app.route('/data_server', methods = ['GET'])
def data_server():
    if request.method == 'GET':
        print(request.args)
        if (randint(0,1)==0):
            return {
                'does_exist': True,
                'pin_code': randint(100000,999999)
            }
        else:
            return {'does_exist': False}

app.run(host="0.0.0.0", port=5000)