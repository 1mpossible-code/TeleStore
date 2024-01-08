import sqlite3


import sqlite3

class Files:
    """
    A class that represents a file storage system using SQLite database.

    Attributes:
        conn (sqlite3.Connection): The connection to the SQLite database.
        cursor (sqlite3.Cursor): The cursor object to execute SQL statements.

    Methods:
        __init__(self, db_path): Initializes the Files object.
        create_table(self): Creates the 'files' table if it doesn't exist.
        insert_file(self, name, message_ids, file_ids, size): Inserts a file into the database.
        get_all_files(self): Retrieves all files from the database.
        get_file(self, uid): Retrieves a specific file from the database.
        remove_file(self, file_id): Removes a file from the database.
        clean(self): Removes all files from the database.
        close(self): Closes the cursor and the database connection.
    """

    def __init__(self, db_path):
        """
        Initializes the Files object.

        Args:
            db_path (str): The path to the SQLite database file.
        """
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.create_table()

    def create_table(self):
        """
        Creates the 'files' table if it doesn't exist.
        """
        self.cursor.execute(
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
        self.conn.commit()

    def insert_file(self, name, message_ids, file_ids, size):
        """
        Inserts a file into the database.

        Args:
            name (str): The name of the file.
            message_ids (list or str): The IDs of the messages associated with the file.
            file_ids (list or str): The IDs of the files associated with the file.
            size (int): The size of the file in bytes.
        """
        if isinstance(message_ids, list):
            message_ids = ",".join(map(str, message_ids))
        if isinstance(file_ids, list):
            file_ids = ",".join(map(str, file_ids))
        self.cursor.execute(
            """
            INSERT INTO files (name, message_ids, file_ids, size)
            VALUES (?, ?, ?, ?)
            """,
            (name, message_ids, file_ids, size),
        )
        self.conn.commit()

    def get_all_files(self):
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
        self.cursor.execute("SELECT * FROM files")
        return self.cursor.fetchall()

    def get_file(self, uid):
        """
        Retrieves a specific file from the database.

        Args:
            uid (int): The ID of the file.

        Returns:
            tuple: A tuple representing the file.
        """
        self.cursor.execute("SELECT * FROM files WHERE id = ?", (uid,))
        return self.cursor.fetchone()

    def remove_file(self, file_id):
        """
        Removes a file from the database.

        Args:
            file_id (int): The ID of the file.
        """
        self.cursor.execute("DELETE FROM files WHERE id = ?", (file_id,))
        self.conn.commit()

    def clean(self):
        """
        Removes all files from the database.
        """
        self.cursor.execute("DELETE FROM files")
        self.conn.commit()

    def close(self):
        """
        Closes the cursor and the database connection.
        """
        self.cursor.close()
        self.conn.close()
    
    def __del__(self):
        """
        Closes the cursor and the database connection.
        """
        self.close()


if __name__ == "__main__":
    # Usage example:
    db = Files("db.sqlite")  # Create an instance of the Files class with the path to the SQLite database
    db.insert_file("file1", [1, 2, 3, 4], "file1_id", 100)  # Insert a file into the database
    db.insert_file("file2", [1, 2, 3, 4], "file2_id", 200)  # Insert another file into the database
    files = db.get_all_files()  # Retrieve all files from the database
    for file in files:
        print(file)  # Print each file
    db.remove_file(1)  # Remove file with id 1
    files = db.get_all_files()  # Retrieve all files from the database again
    for file in files:
        print(file)  # Print each file
    db.clean()  # Remove all files from the database
    db.close()  # Close the database connection
