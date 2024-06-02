import json
import os


class Secret:
    def __init__(self) -> None:
        if not os.path.exists('secret.json'):
            with open('secret.json', 'w') as f:
                json.dump({"token": "", "chat_id": ""}, f)

        with open('secret.json', 'r') as f:
            __secret = json.load(f)
        self.__secret = __secret
    
    def __getitem__(self, key):
        if key not in self.__secret:
            raise KeyError(f"{key} not found in secret.json")
        return self.__secret[key]
    
    def __setitem__(self, key, value):
        self.__secret[key] = value
        with open('secret.json', 'w') as f:
            json.dump(self.__secret, f)
    
    def toJSON(self):
        return self.__secret