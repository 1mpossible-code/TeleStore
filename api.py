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
def handle_post():
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

@app.route('/uploads/', methods=['GET'])
@app.route('/uploads/<int:uid>', methods=['GET', 'DELETE'])
def handle_uploads(uid=None):

    if request.method == 'GET':
        download = request.args.get('download', default=False, type=bool)
        
        try:
            if uid:
                file_info = bot.get_file_info(uid)

                if download:
                    asyncio.run(bot.download_file(uid))
                    send_from_directory(bot.file_manager.files_dir, file_info[1], as_attachment=True)
                    bot.file_manager.clean_files_directory()
                    return jsonify({"message": f"File {uid} successfully downloaded!"}), 200
                
                return jsonify({'id': file_info[0], 'name': file_info[1], 'message_ids': file_info[2], 'file_ids': file_info[3], 'size': file_info[4]})
            else:
                all_files_info = asyncio.run(bot.get_all_files_info())
                data_dict = [{'id': item[0], 'name': item[1], 'message_ids': item[2], 'file_ids': item[3], 'size': item[4]} for item in all_files_info]
                return jsonify(data_dict)
        except ValueError:
            return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404
    elif request.method == 'DELETE':
        try:
            asyncio.run(bot.delete_file(uid))
            return jsonify({"message": f"File {uid} successfully deleted!"}), 200
        except ValueError:
            return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404




if __name__ == "__main__":
    asyncio.run(app.run(debug=True, port=3000))
    