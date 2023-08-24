# Set Multiplayer IO Server

### Description
This IO server, powered by Socket.io, TypeScript, and Node.js, provides the real-time backend functionality for the [Set Multiplayer Card Game](https://github.com/R15NTL/set-multiplayer-next). It ensures seamless room mechanics and real-time interactions for players engaged in the game.

### Tech Stack
- **Real-time Communication**: Socket.io
- **Language**: TypeScript
- **Runtime Environment**: Node.js

### Installation & Running

1. **Setup**:
    - Clone this repository:
        ```bash
        git clone https://github.com/R15NTL/set-multiplayer-server.git
        ```
    - Set up a `.env` file using the provided `.env.example` as a reference.

2. **Scripts**:
    ```bash
    # Development
    npm run dev

    # Build
    npm run build

    # Test
    npm run test

    # Start
    npm run start
    ```

### Docker Deployment
This repository includes a Dockerfile for containerized deployment. To build and run the server using Docker:

```bash
docker build --platform linux/amd64 -t set-multiplayer-server:latest .

docker run --env-file .env -p 8000:80 --name my-set-multiplayer-instance set-multiplayer-server:latest
```
