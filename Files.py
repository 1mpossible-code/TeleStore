import sqlite3


class Files:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.create_table()

    def create_table(self):
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
        self.cursor.execute("SELECT * FROM files")
        return self.cursor.fetchall()

    def remove_file(self, file_id):
        self.cursor.execute("DELETE FROM files WHERE id = ?", (file_id,))
        self.conn.commit()

    def clean(self):
        self.cursor.execute("DELETE FROM files")
        self.conn.commit()

    def close(self):
        self.cursor.close()
        self.conn.close()


if __name__ == "__main__":
    # Usage example:
    db = Files("db.sqlite")
    db.insert_file("file1", [1, 2, 3, 4], "file1_id", 100)
    db.insert_file("file2", [1, 2, 3, 4], "file2_id", 200)
    files = db.get_all_files()
    for file in files:
        print(file)
    db.remove_file(1)  # Remove file with id 1
    files = db.get_all_files()
    for file in files:
        print(file)
    db.clean()
    db.close()
