import sqlite3

class Files:
    """
    A class that represents a file storage system using SQLite database.

    Methods:
        create_table(): Creates the 'files' table if it doesn't exist.
        insert_file(name, message_ids, file_ids, size): Inserts a file into the database.
        get_all_files(): Retrieves all files from the database.
        get_file(uid): Retrieves a specific file from the database.
        remove_file(file_id): Removes a file from the database.
        clean(): Removes all files from the database.
    """

    @staticmethod
    def create_table():
        """
        Creates the 'files' table if it doesn't exist.
        """
        conn = sqlite3.connect("db.sqlite")
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                message_ids TEXT,
                file_ids TEXT,
                size INTEGER
            )
            """
        )
        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def insert_file(name, message_ids, file_ids, size):
        """
        Inserts a file into the database.

        Args:
            name (str): The name of the file.
            message_ids (list or str): The IDs of the messages associated with the file.
            file_ids (list or str): The IDs of the files associated with the file.
            size (int): The size of the file in bytes.
        """
        conn = sqlite3.connect("db.sqlite")
        cursor = conn.cursor()
        if isinstance(message_ids, list):
            message_ids = ",".join(map(str, message_ids))
        if isinstance(file_ids, list):
            file_ids = ",".join(map(str, file_ids))
        cursor.execute(
            """
            INSERT INTO files (name, message_ids, file_ids, size)
            VALUES (?, ?, ?, ?)
            """,
            (name, message_ids, file_ids, size),
        )
        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def get_all_files():
        """
        Retrieves all files from the database.

        Returns:
            list: A list of tuples representing the files. Each tuple contains the following values:
                id (int): The ID of the file.
                name (str): The name of the file.
                message_ids (str): The IDs of the messages associated with the file.
                file_ids (str): The IDs of the files associated with the file.
                size (int): The size of the file in bytes.

                For example:
                [(1, 'file1', '1,2,3', '1,2,3', 100), (2, 'file2', '4,5,6', '4,5,6', 200)]
        """
        conn = sqlite3.connect("db.sqlite")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM files")
        files = cursor.fetchall()
        cursor.close()
        conn.close()
        return files

    @staticmethod
    def get_file(uid):
        """
        Retrieves a specific file from the database.

        Args:
            uid (int): The ID of the file.

        Returns:
            tuple: A tuple representing the file.
        """
        conn = sqlite3.connect("db.sqlite")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM files WHERE id = ?", (uid,))
        file = cursor.fetchone()
        cursor.close()
        conn.close()
        return file

    @staticmethod
    def remove_file(file_id):
        """
        Removes a file from the database.

        Args:
            file_id (int): The ID of the file.
        """
        conn = sqlite3.connect("db.sqlite")
        cursor = conn.cursor()
        cursor.execute("DELETE FROM files WHERE id = ?", (file_id,))
        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def clean():
        """
        Removes all files from the database.
        """
        conn = sqlite3.connect("db.sqlite")
        cursor = conn.cursor()
        cursor.execute("DELETE FROM files")
        conn.commit()
        cursor.close()
        conn.close()

if __name__ == "__main__":
    # Usage example:
    Files.create_table()  # Create the 'files' table if it doesn't exist
    Files.insert_file("file1", [1, 2, 3, 4], "file1_id", 100)  # Insert a file into the database
    Files.insert_file("file2", [1, 2, 3, 4], "file2_id", 200)  # Insert another file into the database
    files = Files.get_all_files()  # Retrieve all files from the database
    for file in files:
        print(file)  # Print each file
    Files.remove_file(1)  # Remove file with id 1
    files = Files.get_all_files()  # Retrieve all files from the database again
    for file in files:
        print(file)  # Print each file
    Files.clean()  # Remove all files from the database
