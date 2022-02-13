from flask import Flask
from flask import render_template, request

app = Flask(__name__)

@app.route('/', methods = ['POST', 'GET'])
def index():
    if request.method == 'POST':
        print(request.data)
        return render_template('index.html')
    else:    
        return render_template('index.html')

app.run(host="0.0.0.0", port=5000)