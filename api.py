from flask import Flask, request, jsonify,render_template
from dotenv import load_dotenv
from App import App
import asyncio
import os


load_dotenv()

app = Flask(__name__)
bot = App()


UPLOAD_FOLDER = os.getcwd()
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = str(os.urandom(12))


@app.route('/')
def home():
    return render_template('home.html')
    
#CREATE
@app.route('/',methods=['POST'])
def handle_Post():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"message": "No file part in the request"}), 400
        
        file = request.files['file']

        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400
        else:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            asyncio.run(bot.upload_file(file.filename))
            return jsonify({"message": "File successfully uploaded"}), 200    

#  READ ALL   
@app.route('/request',methods=['GET'])
def handle_Get():
    if request.method == 'GET':
        data = asyncio.run(bot.get_all_files_info())
        data_dict = [{'id': item[0], 'name': item[1], 'message_ids':item[2],'file_ids':item[3],'size':item[4],} for item in data]
        return jsonify(data_dict)
#  READ BY ID
@app.route('/request/<int:id>',methods=['GET'])
def handle_GetbyID(id):
    if request.method == 'GET':
        try:
            data_tup = asyncio.run(bot.get_single_file(id))
            return jsonify({'id': data_tup[0], 'name': data_tup[1], 'message_ids':data_tup[2],'file_ids':data_tup[3],'size':data_tup[4],})
        except ValueError:
            return jsonify({'error': 'not found',
                        'message': 'invalid resource URI'}),404
        
#DELETE 
@app.route('/request/<int:id>',methods=['DELETE'])
def handle_Delete():
    if request.method == 'DELETE':
        try:
            asyncio.run(bot.delete_file(id))
            return f'Item {id} was successfully deleted'
        except ValueError:
            return jsonify({'error': 'not found',
                        'message': 'invalid resource URI'}),404


if __name__ == "__main__":
    asyncio.run(app.run(debug=True, port=3000))
    