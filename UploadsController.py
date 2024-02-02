# Standard Library Imports
import asyncio
import os

# Third Party Import
from flask import request, jsonify, send_from_directory

# Local Application Import
from App import App


class UploadsController:
    def __init__(self):
        """
        Initializes the UploadsController with an instance of the App class.
        This setup allows access to the App's functionalities such as file management.
        """
        self.app = App()

    def __download(self, uid: int, file_info: tuple):
        """
        Handles the downloading of a file. It fetches the file identified by the uid
        asynchronously and then sends it to the client as an attachment.

        Args:
            uid (int): Unique identifier of the file to be downloaded.
            file_info (tuple): Tuple containing details of the file, like name and size.

        Returns:
            werkzeug.wrappers.Response: A Flask response object that represents 
            the downloaded file, triggering the file download on the client's side.
        """

        asyncio.run(self.app.download_file(uid))
        res = send_from_directory(
            self.app.file_manager.files_dir, file_info[1], as_attachment=True)
        self.app.file_manager.clean_files_directory()
        return res

    def __read_all(self):
        """
        Retrieves information for all available files in JSON format, suitable for API responses.

        Returns:
            flask.Response: JSON response containing details of all files.
        """

        all_files_info = asyncio.run(self.app.get_all_files_info())
        uploads_dict = [{'id': item[0], 'name': item[1], 'message_ids': item[2],
                         'file_ids': item[3], 'size': item[4]} for item in all_files_info]
        return jsonify(uploads_dict)

    def __read_one(self, file_info: tuple):
        """
        Formats information of a single file into JSON.

        Args:
            file_info (tuple): Tuple containing details of the file, like name and size.

        Returns:
            flask.Response: JSON response containing details of the specific file.
        """
        upload_dict = {'id': file_info[0], 'name': file_info[1],
                       'message_ids': file_info[2], 'file_ids': file_info[3],
                       'size': file_info[4]}
        return jsonify(upload_dict)

    def check_arg(self, arg: int) -> bool:
        """
        Validates if the provided argument is equal to 1. This method is primarily
        used for parsing and validating query parameters.

        Args:
            arg (int): The argument to be validated.

        Returns:
            bool: True if arg is 1, False otherwise.
        """
        return int(arg) == 1

    def read(self, uid: int = None):
        """
        Handles GET requests to read file information. If a UID is provided, 
        it returns information for the specified file; otherwise, it returns 
        information for all files. Additionally, handles file download requests.

        Args:
            uid (int, optional): Unique identifier of the file. Defaults to None.

        Returns:
            flask.Response: JSON response containing file information or 
            a response triggering a file download. Returns an error response
            if the file is not found.
        """

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
        """
        Handles the file upload process. Validates the presence of a file in the request
        and saves the uploaded file using the App's file management capabilities.

        Returns:
            flask.Response: JSON response of the new file that was uploaded.
        """
        if 'file' not in request.files:
            return jsonify({"message": "No file part in the request"}), 400

        user_file = request.files['file']

        if user_file.filename == '':
            return jsonify({"message": "No selected file"}), 400

        # Create the file path and use app upload_file method
        user_file_path = os.path.join(
            self.app.file_manager.files_dir, user_file.filename)
        user_file.save(user_file_path)
        asyncio.run(self.app.upload_file(user_file_path))
        
        # Get last item in array and format in JSON        
        arr_len = len(asyncio.run(self.app.get_all_files_info()))
        new_file = asyncio.run(self.app.get_all_files_info())[arr_len - 1]
        file_dict = {'id': new_file[0], 'name': new_file[1],
                     'message_ids': new_file[2], 'file_ids': new_file[3],
                     'size': new_file[4]}
        self.app.file_manager.clean_files_directory()
        return jsonify(file_dict), 200

    def delete(self, uid: int):
        """
        Handles the deletion of a file specified uid
        """
        try:
            asyncio.run(self.app.delete_file(uid))
            return jsonify({"message": f"File {uid} successfully deleted!"}), 200
        except ValueError:
            return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404
