import os
import logging
import requests

from typing import Tuple

from telegram.ext import Application

class Bot:
    def __init__(self, token, chat_id) -> None:
        # Creating an Application instance for the bot using the provided token
        self.application = Application.builder().token(token).build()
        self.chat_id = chat_id

    async def send_file(self, file_path: str) -> Tuple[int, str]:
        # Sending the document to the specified chat ID and getting the response
        data = await self.application.bot.send_document(
            self.chat_id,
            open(file_path, "rb"),  # Opens the file in binary read mode
        )
        # Extracting the message ID and file ID from the response
        message_id = data["message_id"]
        file_id = data["document"]["file_id"]
        logging.info(f"File sent: {file_path}, file_id: {file_id}, msg_id: {message_id}")
        # Returning the message ID and file ID
        return message_id, file_id
    
    async def get_file(self, file_id: str) -> str:
        # Get file details from Telegram
        file_data = await self.application.bot.get_file(file_id)
        file_path = file_data.file_path

        # Download the file content
        response = requests.get(file_path)
        response.raise_for_status()  # Ensure that a valid response is received

        # Log the action
        logging.info(f"File received: {file_id}")

        return response.content
        
    
    async def delete_file(self, message_id: int) -> None:
        # Deleting the message with the specified message ID from the chat
        await self.application.bot.delete_message(self.chat_id, message_id)
        logging.info(f"File deleted: {message_id}")

    