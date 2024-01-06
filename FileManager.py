import logging
import os


class FileManager:
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
        """Check if a file exceeds the maximum size."""
        return os.path.getsize(file_path) > max_size

    def split_file(self, file_path, chunk_size):
        """Split a file into smaller parts if it's too large."""
        file_name = os.path.basename(file_path)
        split_command = (
            f"split -b {chunk_size} {file_path} {self.temp_dir}/{file_name}_"
        )
        os.system(split_command)
        logging.info(f"File split using command: {split_command}")
        return [
            os.path.join(self.temp_dir, f) for f in sorted(os.listdir(self.temp_dir))
        ]

    def clean_directory(self):
        """Clean up the temporary directory."""
        cleanup_command = f"rm -rf {self.temp_dir}/*"
        os.system(cleanup_command)
        logging.info(f"Temporary directory cleaned with command: {cleanup_command}")
