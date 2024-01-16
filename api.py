from flask import Flask, request,render_template
from dotenv import load_dotenv
from UploadsController import UploadsController
import asyncio


load_dotenv()

app = Flask(__name__)

bot = UploadsController()

@app.route('/')
def home():
    return render_template('home.html')
    
@app.route('/uploads/', methods=['GET','POST'])
@app.route('/uploads/<int:uid>', methods=['GET', 'DELETE'])
def handle_uploads(uid=None):

    if request.method == 'GET':
        return bot.handle_read(uid)
        
    elif request.method == 'POST':
        return bot.handle_create()
        
    elif request.method == 'DELETE':
        return bot.handle_delete(uid)

if __name__ == "__main__":
    asyncio.run(app.run(debug=True, port=3000))
    