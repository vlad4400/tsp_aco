#!/bin/bash

# Setting variables
NETWORK_NAME="student-message-portal_app-network"
BACKUP_DIR="$(pwd)/backup"
CONTAINER_IMAGE="mongo:7.0.12"
MONGO_URI="mongodb://mongo:27017/msg-store"

# Checking if the backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Backup directory $BACKUP_DIR does not exist. Exiting..."
  exit 1
fi

# Setting permissions for the backup directory
echo "Setting permissions for the directory $BACKUP_DIR"
chmod 777 "$BACKUP_DIR"

# Running the import command with --drop option to drop existing collections before restoring
docker run --rm --user $(id -u):$(id -g) --network=$NETWORK_NAME -v $BACKUP_DIR:/backup $CONTAINER_IMAGE mongorestore --uri="$MONGO_URI" --drop /backup/msg-store

# Checking if the import was successful
if [ $? -eq 0 ]; then
  echo "Import completed successfully."
else
  echo "Error occurred during data import."
fi
