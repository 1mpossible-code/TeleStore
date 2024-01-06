import os
from cryptography.fernet import Fernet

class Cryptography:
    def __init__(self):
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
        return self.cipher_suite.encrypt(content)

    def decrypt(self, content: bytes) -> bytes:
        return self.cipher_suite.decrypt(content)
    
    def encrypt_file(self, file_path: str) -> None:
        with open(file_path, "rb") as f:
            content = f.read()
        content = self.encrypt(content)
        with open(file_path, "wb") as f:
            f.write(content)
            
    def decrypt_file(self, file_path: str) -> None:
        with open(file_path, "rb") as f:
            content = f.read()
        content = self.decrypt(content)
        with open(file_path, "wb") as f:
            f.write(content)