
from flask import  request, jsonify,send_from_directory
import asyncio
import os

class UploadsController:
    def __init__(self, upload_bot):
        self.bot = upload_bot
        
    def handle_download(self,uid,file_info):
        asyncio.run(self.bot.download_file(uid))
        res = send_from_directory(self.bot.file_manager.files_dir, file_info[1], as_attachment=True)
        self.bot.file_manager.clean_files_directory()
        return res
    
    def handle_read(self,uid=None):    
        if request.method == 'GET':
            download = request.args.get('download')
            try:
                if uid:
                    file_info = self.bot.get_file_info(uid)

                    if download:
                        self.handle_download(uid,file_info)
                       
                    return jsonify({'id': file_info[0], 'name': file_info[1], 'message_ids': file_info[2], 'file_ids': file_info[3], 'size': file_info[4]})
                else:
                    all_files_info = asyncio.run(self.bot.get_all_files_info())
                    data_dict = [{'id': item[0], 'name': item[1], 'message_ids': item[2], 'file_ids': item[3], 'size': item[4]} for item in all_files_info]
                    return jsonify(data_dict)
            except ValueError:
                return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404
    
    def handle_create(self):
        if 'file' not in request.files:
            return jsonify({"message": "No file part in the request"}), 400
        
        user_file = request.files['file']

        if user_file.filename == '':
            return jsonify({"message": "No selected file"}), 400
        else:
            user_file.save(os.path.join(self.bot.file_manager.temp_dir, user_file.filename))
            asyncio.run(self.bot.upload_file(os.path.join(self.bot.file_manager.temp_dir, user_file.filename)))
            self.bot.file_manager.clean_temp_directory()
            return jsonify({"message": "File successfully uploaded"}), 200  
    
    def handle_delete(self,uid):
        try:
            asyncio.run(self.bot.delete_file(uid))
            return jsonify({"message": f"File {uid} successfully deleted!"}), 200
        except ValueError:
            return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404


    





