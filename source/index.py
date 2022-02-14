from crypt import methods
from flask import Flask
from flask import render_template, request
from random import randint, random

app = Flask(__name__)

session_pins = {}

@app.route('/', methods = ['GET'])
def index():
    return render_template('index.html')

@app.route('/tel_validation', methods = ['GET'])
def tel_validation():
    if (randint(0,1)==0):
        pin_code = randint(100000,999999)
        session_id = len(session_pins.keys())
        session_pins.update({session_id: pin_code})
        return {
            'does_exist': True,
            'session_id': session_id,
            'pin_code': pin_code
        }
    else:
        return {
            'does_exist': False
        }

@app.route('/pin_validation', methods = ['GET'])
def pin_validation():
    if session_pins[int(request.args['session_id'])] == int(request.args['pin_code']):
        return(
            {
                'action': 'pin_validation',
                'status': 'pass'
            })
    else: 
        return(
            {
                'action': 'pin_validation',
                'status': 'fail'

            })

app.run(host="0.0.0.0", port=5000)