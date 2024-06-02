# Telegram Storage

An awesome project to leverage the Telegram Bot API for storing and retrieving files easily.

[Report Bug](https://github.com/1mpossible-code/telegram-storage/issues) · [Request Feature](https://github.com/1mpossible-code/telegram-storage/issues)

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About The Project

![ScreenRecording2024-06-01at8 24 39PM-ezgif com-video-to-gif-converter](https://github.com/1mpossible-code/telegram-storage/assets/109933928/6bf007f4-e813-4562-b2ca-7fc8cef585e6)

Telegram Storage leverages the Telegram Bot API to store and retrieve files easily. It allows users to upload, store, and manage files directly through a Telegram bot, making it convenient to access your files from anywhere.

Here's why this project stands out:
- **Convenience:** Easily upload and retrieve files through Telegram.
- **Accessibility:** Access your files from anywhere with Telegram.
- **Simplicity:** Easy setup and usage instructions.

[back to top](#table-of-contents)

## Built With

This section lists any major frameworks/libraries used to bootstrap the project.

- Python
- Telegram Bot API
- Docker
- Node.js

[back to top](#table-of-contents)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed:
- Docker
- Python
- Node.js
- npm
- pnpm

### Installation

1. **Start Docker containers:**
    ```bash
    docker-compose up
    ```

2. **Create a virtual environment and install Python dependencies:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3. **Create a `.env` file:**
    - Use the `.env.example` file as a template to create your `.env` file.
    ```bash
    cp .env.example .env
    ```
    - Fill in your environment variables in the `.env` file.

4. **Navigate to the frontend directory and install dependencies:**
    ```bash
    cd frontend
    npm install
    pnpm install
    ```

[back to top](#table-of-contents)

## Usage

1. Start the API server:
    ```bash
    python3 api.py
    ```

2. Follow the directions in the user interface to interact with the bot, upload files, and retrieve files.



[back to top](#table-of-contents)

See the [open issues](https://github.com/1mpossible-code/telegram-storage/issues) for a full list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

[back to top](#table-of-contents)

## License

Distributed under the MIT License. See `LICENSE` for more information.

[back to top](#table-of-contents)
