import logging
from dotenv import load_dotenv
import os
import asyncio
import requests
from App import App
from flask import jsonify

from telegram import Update
from telegram.ext import ContextTypes, filters, CommandHandler, MessageHandler

load_dotenv()

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)
def j(obj):
    return jsonify(
        id=obj[0],
        name=obj[1],
        encryption_key=obj[2],
        size=obj[3]
    )

async def main() -> None:
    """Start the bot."""
    app = App()
    tup_list = await app.get_all_files_info()
    for tup in tup_list:
        print(tup[0])
    


if __name__ == "__main__":
    asyncio.run(main())
    
    
