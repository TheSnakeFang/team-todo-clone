# Vikunja Backend Setup Instructions

This document provides step-by-step instructions for setting up the Vikunja backend using Docker. Follow these steps to set up Vikunja on your local machine.

## Prerequisites

- Docker installed on your system
- Terminal or command prompt access

## Setup Steps

1. Create directories for Vikunja data:
   ```
   mkdir -p vikunja/files vikunja/db
   ```

2. Pull the Vikunja Docker image:
   ```
   docker pull vikunja/vikunja
   ```

3. Run the Vikunja container:
   ```
   docker run -d \
     --name vikunja \
     -p 3456:3456 \
     -v $PWD/vikunja/files:/app/vikunja/files \
     -v $PWD/vikunja/db:/db \
     vikunja/vikunja
   ```

4. Verify that the container is running:
   ```
   docker ps | grep vikunja
   ```

5. Access Vikunja:
   Open a web browser and navigate to `http://localhost:3456`

## Notes

- The Vikunja instance will be accessible on port 3456.
- Data will be persisted in the `vikunja/files` and `vikunja/db` directories.
- There is no default user or password. You'll need to register a new account when you first access Vikunja.

## Troubleshooting

- If you encounter permission issues, ensure that the user running Docker has the necessary permissions for the `vikunja/files` and `vikunja/db` directories.
- If the port 3456 is already in use, you can change it in the `docker run` command (e.g., `-p 3457:3456`).

## Stopping and Removing the Container

To stop the Vikunja container:
```
docker stop vikunja
```

To remove the container (this will not delete your data):
```
docker rm vikunja
```

For more advanced configuration options, refer to the official Vikunja documentation.
