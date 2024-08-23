#!/bin/bash

# Setting variables
NETWORK_NAME="student-message-portal_app-network"
BACKUP_DIR="$(pwd)/backup"
CONTAINER_IMAGE="mongo:7.0.12"
MONGO_URI="mongodb://mongo:27017/msg-store"

# Removing old backups
echo "Removing old backups in $BACKUP_DIR"
rm -rf "$BACKUP_DIR"/*

# Creating the backup directory
echo "Creating backup directory $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Setting permissions for the backup directory
echo "Setting permissions for the directory $BACKUP_DIR"
chmod 777 "$BACKUP_DIR"

# Running the export command
docker run --rm --user $(id -u):$(id -g) --network=$NETWORK_NAME -v $BACKUP_DIR:/backup $CONTAINER_IMAGE mongodump --uri="$MONGO_URI" --out /backup

# Checking if the export was successful
if [ $? -eq 0 ]; then
  echo "Export completed successfully. Backup saved in $BACKUP_DIR"
else
  echo "Error occurred during data export."
fi
