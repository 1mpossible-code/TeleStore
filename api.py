from flask import Flask, request, jsonify,render_template,send_from_directory
from dotenv import load_dotenv
from App import App
import asyncio
import os

load_dotenv()

app = Flask(__name__)
bot = App()


@app.route('/')
def home():
    return render_template('home.html')
    
#CREATE
@app.route('/upload',methods=['POST'])
def handle_Post():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"message": "No file part in the request"}), 400
        
        user_file = request.files['file']

        if user_file.filename == '':
            return jsonify({"message": "No selected file"}), 400
        else:
            user_file.save(os.path.join(bot.file_manager.temp_dir, user_file.filename))
            asyncio.run(bot.upload_file(user_file.filename))
            bot.file_manager.clean_directory()
            return jsonify({"message": "File successfully uploaded"}), 200    

#  READ 
@app.route('/uploads/', methods=['GET'])
@app.route('/uploads/<int:Uid>',methods=['GET'])
def handle_GetbyID(Uid=None):
    if request.method == 'GET':
        try:
            if Uid: #if Uid is specified show one
                data_tup = asyncio.run(bot.get_single_file(Uid))
                return jsonify({'id': data_tup[0], 'name': data_tup[1], 'message_ids':data_tup[2],'file_ids':data_tup[3],'size':data_tup[4],})
            else: # If no Uid is specified show all
                data = asyncio.run(bot.get_all_files_info())
                data_dict = [{'id': item[0], 'name': item[1], 'message_ids':item[2],'file_ids':item[3],'size':item[4],} for item in data]
                return jsonify(data_dict)
        except ValueError:
            return jsonify({'error':f'Upload {Uid} not found',
                        'message': 'invalid resource URI'}),404
        
#DELETE 
@app.route('/uploads/<int:Uid>',methods=['DELETE'])
def handle_Delete(Uid):
    if request.method == 'DELETE':
        try:
            asyncio.run(bot.delete_file(Uid))
            return jsonify({"message": f"File {Uid} successfully deleted!"}), 200    
        except ValueError:
            return jsonify({'error': f'Upload {Uid} not found',
                        'message': 'invalid resource URI'}),404

#DOWNLOAD
@app.route('/download/<int:Uid>',methods=['GET'])
def handle_Download(Uid):
    if request.method == 'GET':
        try:
            file_info = asyncio.run(bot.get_single_file(Uid))
            
            asyncio.run(bot.download_file(Uid))
            send_from_directory( bot.file_manager.files_dir,file_info[1],as_attachment=True)
            
            bot.file_manager.clean_files_directory()
            return jsonify({"message": f"File {Uid} successfully downloaded!"}), 200    
        except ValueError:
            return jsonify({'error': f'Upload {Uid} not found',
                        'message': 'invalid resource URI'}),404



if __name__ == "__main__":
    asyncio.run(app.run(debug=True, port=3000))
    