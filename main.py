import logging
from dotenv import load_dotenv
import os
import asyncio
import requests

from telegram.ext import Application

load_dotenv()

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


async def main() -> None:
    """Start the bot."""
    application = Application.builder().token(os.getenv("TOKEN")).build()
    bot = application.bot
    chat_id = os.getenv("CHAT_ID")

    # print(await application.bot.send_document(
    #     chat_id,
    #     open("test.txt", "rb"),
    # ))

    # f = await application.bot.get_file(file_id)
    # link = f.file_path
    # with open("test2.txt", "wb") as file:
    #     file.write(requests.get(link).content)
    
    # await bot.delete_message(chat_id, message_id)

if __name__ == "__main__":
    asyncio.run(main())
