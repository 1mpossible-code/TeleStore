import os
import logging
import requests

from typing import Tuple

from telegram.ext import Application

class Bot:
    def __init__(self) -> None:
        self.application = Application.builder().token(os.getenv("TOKEN")).build()
        self.chat_id = os.getenv("CHAT_ID")

    async def send_file(self, file_path: str) -> Tuple[int, str]:
        data = await self.application.bot.send_document(
            self.chat_id,
            open(file_path, "rb"),
        )
        message_id = data["message_id"]
        file_id = data["document"]["file_id"]
        logging.info(f"File sent: {file_path}, file_id: {file_id}, msg_id: {message_id}")
        return message_id, file_id
    
    async def get_file(self, file_id: str) -> str:
        f = await self.application.bot.get_file(file_id)
        link = f.file_path
        content = requests.get(link).content
        logging.info(f"File received: {file_id}")
        return content
        
    
    async def delete_file(self, message_id: int) -> None:
        await self.application.bot.delete_message(self.chat_id, message_id)
        logging.info(f"File deleted: {message_id}")

    