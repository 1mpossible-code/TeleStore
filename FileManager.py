import logging
import os


class FileManager:
    """
    Class to manage file operations, such as splitting files into smaller parts.
    Basically it is a wrapper around os module. Editing this class may be DANGEROUS.
    Since we use os.system() to execute commands, it is possible to execute arbitrary commands.

    Attributes:
        temp_dir (str): The path to the temporary directory where files will be stored during operations.
        files_dir (str): The path to the directory where the original files will be stored.

    Methods:
        __init__(temp_dir, files_dir): Initializes the FileManager object and ensures that the necessary directories exist.
        _create_directory_if_not_exists(directory): Creates a directory if it does not already exist.
        is_file_large(file_path, max_size): Checks if a file exceeds the maximum size.
        split_file(file_path, chunk_size): Splits a file into smaller parts if it's too large.
        clean_temp_directory(): Cleans up the temporary directory.
        clean_file_directory(): Cleans up the temporary directory.
    """

    def __init__(self, temp_dir, files_dir):
        """Manage file operations, ensuring directories are set up correctly."""
        self.temp_dir = temp_dir
        self.files_dir = files_dir
        self._create_directory_if_not_exists(self.files_dir)
        self._create_directory_if_not_exists(self.temp_dir)

    def _create_directory_if_not_exists(self, directory):
        """Create a directory if it does not exist."""
        if not os.path.exists(directory):
            os.makedirs(directory)
            logging.info(f"Created directory: {directory}")

    def is_file_large(self, file_path, max_size):
        """Check if a file exceeds the maximum size.

        Args:
            file_path (str): The path to the file.
            max_size (int): The maximum size in bytes.

        Returns:
            bool: True if the file exceeds the maximum size, False otherwise.
        """
        return os.path.getsize(file_path) > max_size

    def split_file(self, file_path, chunk_size):
        """Split a file into smaller parts if it's too large.

        Args:
            file_path (str): The path to the file.
            chunk_size (int): The size of each chunk in bytes.

        Returns:
            list: A list of paths to the split files.
        """
        file_name = os.path.basename(file_path)
        split_command = (
            f'split -b {chunk_size} "{file_path}" "{self.temp_dir}/{file_name}_"'
        )
        os.system(split_command)
        logging.info(f"File split using command: {split_command}")
        return [
            os.path.join(self.temp_dir, f) for f in sorted(os.listdir(self.temp_dir))
        ]

    def clean_temp_directory(self, path="*"):
        """Clean up the temporary directory."""
        fp = os.path.join(self.temp_dir, path)
        cleanup_command = f"rm -rf \"{fp}\""
        os.system(cleanup_command)
        logging.info(f"Temporary directory cleaned with command: {cleanup_command}")

    def clean_files_directory(self, path="*"):
        """Clean up the file directory."""
        fp = os.path.join(self.files_dir, path)
        cleanup_command = f"rm -rf \"{fp}\""
        os.system(cleanup_command)
        logging.info(f"Files directory cleaned with command: {cleanup_command}")
