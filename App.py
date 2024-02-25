import logging
import os
from Bot import Bot
from Files import Files
from FileManager import FileManager
from Cryptography import Cryptography
import uuid

# Size is 2048 MB, but encryption increases the file size by about 30%
MAX_FILE_SIZE_MB = 10
MB_TO_BYTES = 1024 * 1024


class App:
    """
    The main application class that handles the bot, database, and file management components.

    Attributes:
        bot (Bot): An instance of the Bot class for interacting with the Telegram bot API.
        files_db (Files): An instance of the Files class for managing the database of files.
        file_manager (FileManager): An instance of the FileManager class for handling file operations.
        cryptography (Cryptography): An instance of the Cryptography class for file encryption and decryption.

    Methods:
        upload_file: Saves a file by either sending it directly or handling it as a large file.
        download_file: Downloads a file based on its unique identifier.
        get_all_files_info: Gets information about all files.
        delete_file: Deletes a file based on its unique identifier.
        __init__: Initializes the application with bot, database, and file management components.
        _handle_large_file: Handles a large file by splitting and sending it in parts.
        _send_multiple_files: Sends multiple files and returns message and file IDs.
        _send_file: Sends a single file.
    """

    def __init__(self) -> None:
        """Initialize the application with bot, database, and file management components."""
        # We get the token and chat ID from environment variables.
        token = os.getenv("TOKEN")
        chat_id = os.getenv("CHAT_ID")

        # Now we optionally get the database name, temp directory, and files directory from environment variables.
        # If they are not set, we use the default values.
        db_name = os.getenv("DB_NAME") or "db.sqlite"
        temp_dir = os.getenv("TEMP_DIR") or "temp"
        files_dir = os.getenv("FILES_DIR") or "files"

        # Create an instance of the bot, database, file manager, and cryptography classes.
        self.bot = Bot(token, chat_id)
        self.file_manager = FileManager(temp_dir, files_dir)
        self.cryptography = Cryptography()

    async def upload_file(self, file_path: str) -> None:
        """Uploads the file by sending it directly to the bot or handling it as a large file.
        Large files are split into parts and sent in parts.

        Args:
            file_path (str): The path of the file to be saved.
        """
        logging.info(f"Sending file: {file_path}")
        size = os.path.getsize(file_path)
        logging.info("Splitting the large file...")
        split_files = self.file_manager.split_file(
            file_path, MAX_FILE_SIZE_MB * MB_TO_BYTES
        )
        msg_ids, file_ids = await self._send_multiple_files(split_files)
        Files.insert_file(os.path.basename(file_path), msg_ids, file_ids, size)
        logging.info("Large file successfully sent and recorded in the database.")
        file_name = os.path.basename(file_path)
        self.file_manager.clean_temp_directory(f"{file_name}*")

    async def _send_multiple_files(self, file_paths):
        """Send multiple files and return message and file IDs.

        Args:
            file_paths (list): List of file paths to be sent.

        Returns:
            tuple: A tuple containing the message IDs and file IDs.
        """
        msg_ids = []
        file_ids = []
        for file in file_paths:
            logging.info(f"Encrypting file part: {file}")
            self.cryptography.encrypt_file(file)
            logging.info(f"Sending file part: {file}")
            msg_id, file_id = await self.bot.send_file(file)
            msg_ids.append(msg_id)
            file_ids.append(file_id)
        return msg_ids, file_ids

    async def download_file(self, uid: int) -> None:
        """Download a file based on its unique identifier. This downloads the file from the bot storage and decrypts it.
        If the file is large, it is downloaded in parts and then joined.

        Args:
            uid (int): The unique identifier of the file to be downloaded.
        """
        logging.info(f"Downloading file with UID: {uid}")
        file_info = Files.get_file(uid)
        if not file_info:
            logging.error(f"File with UID {uid} not found.")
            return

        file_ids = file_info[3].split(",")
        temp_path = os.path.join(self.file_manager.temp_dir, str(uuid.uuid4()))
        file_path = os.path.join(self.file_manager.files_dir, file_info[1])

        # with open(file_path, "wb") as file:
        downloaded = []
        for file_id in file_ids:
            # save file part and decrypt it
            logging.info(f"Downloading file part: {file_id}")
            if not os.path.exists(temp_path):
                os.makedirs(temp_path)
            with open(os.path.join(temp_path, file_id), "wb") as f:
                f.write(await self.bot.get_file(file_id))
                downloaded.append(file_id)
            logging.info(f"Decrypting file part: {file_id}")
            self.cryptography.decrypt_file(os.path.join(temp_path, file_id))

        # join file parts
        logging.info("Joining file parts...")
        # if windows, use copy /b command
        path = os.path.join(temp_path, '*')
        if os.name == "nt":
            os.system(
                f"copy /b \"{path}\" \"{file_path}\""
            )
        else:
            # if linux, use cat command
            os.system(
                f"cat {path} > \"{file_path}\""
            )
        logging.info("File parts joined.")

        logging.info(f"File downloaded: {file_path}")
        # clean up
        for file_id in downloaded:
            os.remove(os.path.join(temp_path, file_id))
        os.rmdir(temp_path)

    async def get_all_files_info(self) -> list:
        """Get information about all files from the database.

        Returns:
            list: A list of file information. Each file is represented as a tuple containing the following information:
                id (int): The ID of the file.
                name (str): The name of the file.
                message_ids (str): The IDs of the messages associated with the file.
                file_ids (str): The IDs of the files associated with the file.
                size (int): The size of the file in bytes.
        """
        logging.info("Fetching information for all files.")
        return Files.get_all_files()

    def get_file_info(self, uid: int) -> tuple:
        """Get information about a file from the database.

        Args:
            uid (int): The unique identifier of the file.

        Returns:
            tuple: A tuple containing the following information:
                id (int): The ID of the file.
                name (str): The name of the file.
                message_ids (str): The IDs of the messages associated with the file.
                file_ids (str): The IDs of the files associated with the file.
                size (int): The size of the file in bytes.
        """
        logging.info(f"Fetching information for file with UID: {uid}")
        return Files.get_file(uid)


    async def delete_file(self, uid: int) -> None:
        """Delete a file based on its unique identifier. This deletes the file from the database and bot storage.
        It finds all messages associated with the file and deletes them.

        Args:
            uid (int): The unique identifier of the file to be deleted.
        """
        logging.info(f"Deleting file with UID: {uid}")
        # The telegram bot cannot delete messages that were sent more than 48 hours ago.
        # file_info = Files.get_file(uid)
        # if not file_info:
        #     logging.error(f"File with UID {uid} not found.")
        #     raise ValueError(f"File with UID {uid} not found.")
        # msg_ids = file_info[2].split(",") if "," in file_info[2] else [file_info[2]]
        # for msg_id in msg_ids:
        #     await self.bot.delete_file(msg_id)
        Files.remove_file(uid)
        logging.info(f"File with UID {uid} deleted from database and bot storage.")
