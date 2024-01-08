import os
from cryptography.fernet import Fernet

class Cryptography:
    def __init__(self):
        """
        Initializes the Cryptography class by generating or loading the encryption key.

        If the 'secret.key' file does not exist, a new key is generated and saved to the file.
        If the file exists, the key is loaded from the file.

        The loaded key is used to create a Fernet cipher suite for encryption and decryption.
        """
        # check if key exists
        if not os.path.exists('secret.key'):
            # generate key
            key = Fernet.generate_key()
            # write key to file
            with open('secret.key', 'wb') as key_file:
                key_file.write(key)
        # load key
        with open('secret.key', 'rb') as key_file:
            key = key_file.read()
        
        self.cipher_suite = Fernet(key)
        
    def encrypt(self, content: bytes) -> bytes:
        """
        Encrypts the given content using the cipher suite.

        Args:
            content (bytes): The content to be encrypted.

        Returns:
            bytes: The encrypted content.
        """
        # encrypt content using the cipher suite
        return self.cipher_suite.encrypt(content)

    def decrypt(self, content: bytes) -> bytes:
        """
        Decrypts the given content using the cipher suite.

        Args:
            content (bytes): The content to be decrypted.

        Returns:
            bytes: The decrypted content.
        """
        return self.cipher_suite.decrypt(content)
    
    def encrypt_file(self, file_path: str) -> None:
        """
        Encrypts the content of the file at the given file path.

        Args:
            file_path (str): The path of the file to be encrypted.
        """
        # read file content
        with open(file_path, "rb") as f:
            content = f.read()
        # encrypt content
        content = self.encrypt(content)
        # write encrypted content back to file
        with open(file_path, "wb") as f:
            f.write(content)
            
    def decrypt_file(self, file_path: str) -> None:
        """
        Decrypts the content of the file at the given file path.

        Args:
            file_path (str): The path of the file to be decrypted.
        """
        # read file content
        with open(file_path, "rb") as f:
            content = f.read()
        # decrypt content
        content = self.decrypt(content)
        # write decrypted content back to file
        with open(file_path, "wb") as f:
            f.write(content)