# Standard Library Imports
import asyncio
import os

# Third Party Import
from flask import request, jsonify, send_from_directory

# Local Application Import
from App import App


class UploadsController:
    def __init__(self):
        '''Initialize the App instance to access its functionalities'''
        self.app = App()

    def __download(self, uid: int, file_info):
        '''
        Handles file download: fetches the file asynchronously and sends it to the client

        Args:
            uid (int): File id.
            file_info (tuple): Tuple containing file attributes.

        Returns:
            res (file): downloaded file uid
        '''

        asyncio.run(self.app.download_file(uid))
        res = send_from_directory(
            self.app.file_manager.files_dir, file_info[1], as_attachment=True)
        self.app.file_manager.clean_files_directory()
        return res

    def __read_all(self):
        '''
        Retrieves info for all files and returns it in JSON format

        Returns:
            uploads_dict (JSON): 
        '''

        all_files_info = asyncio.run(self.app.get_all_files_info())
        uploads_dict = [{'id': item[0], 'name': item[1], 'message_ids': item[2],
                         'file_ids': item[3], 'size': item[4]} for item in all_files_info]
        return jsonify(uploads_dict)

    def __read_one(self, file_info):
        '''
        Formats a single file's info into JSON

        Arg: 
            file_info (tuple): Tuple containing file attributes.

        Returns:
            upload_dict (JSON): A dictionary object containing a specific
            file's attributes
        '''
        upload_dict = {'id': file_info[0], 'name': file_info[1],
                       'message_ids': file_info[2], 'file_ids': file_info[3],
                       'size': file_info[4]}
        return jsonify(upload_dict)

    def check_arg(self, arg: int) -> bool:
        return int(arg) == 1

    def read(self, uid: int = None):
        '''
        Handles all requests associated with GET such as, read file(s), and download

        Arg: 
            uid (int): File id.            

        Returns:
            upload_dict (JSON): A dictionary object containing a specific
            file's attributes
        '''

        try:
            if uid:
                file_info = self.app.get_file_info(uid)
                if request.args.get('download', default=False, type=self.check_arg):
                    return self.__download(uid, file_info)
                return self.__read_one(file_info)
            return self.__read_all()
        except ValueError:
            return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404

    def create(self):
        '''Handles uploading files '''

        if 'file' not in request.files:
            return jsonify({"message": "No file part in the request"}), 400

        user_file = request.files['file']

        if user_file.filename == '':
            return jsonify({"message": "No selected file"}), 400

        # Create the file path and use app upload_file method
        user_file_path = os.path.join(
            self.app.file_manager.temp_dir, user_file.filename)
        user_file.save(user_file_path)
        asyncio.run(self.app.upload_file(user_file_path))
        self.app.file_manager.clean_temp_directory()
        return jsonify({"message": "File successfully uploaded"}), 200

    def delete(self, uid):
        '''Handles the deletion of a file, returning a confirmation response'''
        try:
            asyncio.run(self.app.delete_file(uid))
            return jsonify({"message": f"File {uid} successfully deleted!"}), 200
        except ValueError:
            return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404
