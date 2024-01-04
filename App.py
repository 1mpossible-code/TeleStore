import logging
import os
from Bot import Bot
from Files import Files


class App:
    def __init__(self) -> None:
        self.bot = Bot()
        self.files = Files("db.sqlite")

    async def send_file(self, file_path: str) -> None:
        msg_id, file_id = await self.bot.send_file(file_path)
        self.files.insert_file(file_path, msg_id, file_id, os.path.getsize(file_path))
        logging.info("File sent and recorded")

    async def get_file_content(self, uid: int) -> str:
        f = self.files.get_file(uid)
        file_id = f[3]
        content = await self.bot.get_file(file_id)
        logging.info("File content received")
        return content

    async def save_file(self, uid: int, dir: str = "./temp") -> None:
        content = await self.get_file_content(uid)
        f = self.files.get_file(uid)
        file_name = f[1]
        file_path = os.path.join(dir, file_name)
        # check if directory exists
        if not os.path.exists(dir):
            os.makedirs(dir)
        with open(file_path, "wb") as file:
            file.write(content)
        logging.info("File saved")

    async def get_all_files(self) -> list:
        return self.files.get_all_files()

    async def delete_file(self, uid: str) -> None:
        f = self.files.get_file(uid)
        message_id = int(f[2])
        await self.bot.delete_file(message_id)
        self.files.remove_file(uid)
        logging.info("File deleted and removed from db")
