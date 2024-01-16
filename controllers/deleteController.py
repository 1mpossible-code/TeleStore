from flask import jsonify
from App import App
import asyncio

class del_controller:
    def __init__(self,App:tel_bot):
        self.bot = tel_bot
    def handle_delete(int:uid):
        try:
            asyncio.run(self.bot.delete_file(uid))
            return jsonify({"message": f"File {uid} successfully deleted!"}), 200
        except ValueError:
            return jsonify({'error': f'Upload {uid} not found', 'message': 'invalid resource URI'}), 404