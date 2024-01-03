import logging
from dotenv import load_dotenv
import os
import asyncio
import requests

from telegram.ext import Application, Update, ContextTypes

load_dotenv()

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    await update.message.reply_html(
        rf"Hi {user.mention_html()}!, your chat_id is `{update.effective_chat.id}`",
    )

async def delete_messages(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Delete user messages."""
    await update.message.reply_text(update.message.text)

async def main() -> None:
    """Start the bot."""
    application = Application.builder().token(os.getenv("TOKEN")).build()
    chat_id = os.getenv("CHAT_ID")
    bot = application.bot

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
