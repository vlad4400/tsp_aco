# Prepare for local development

## Prepare Frontend

Run `cd frontend`,
then run `npm i`,
then run `cd ..`.

# Run the Project

To start the project, use the following command: `docker compose up`

# Export Data

If you need to export data from the MongoDB database, follow these steps:

## Ensure Proper Permissions (Unix)

Before running the export script, make sure that the export_mongo.sh script has the correct execution permissions. You can set the necessary permissions by running the following command: `chmod +x ./database/export_mongo.sh`

## Run the Export Script

Once the permissions are set, you can export the data by executing the following script: `./database/export_mongo.sh`

# Import Data

If you need to import data into the MongoDB database from a backup, follow these steps:

## Ensure Proper Permissions (Unix)

Before running the import script, make sure that the import_mongo.sh script has the correct execution permissions. You can set the necessary permissions by running the following command: `chmod +x ./database/import_mongo.sh`

## Run the Import Script

Once the permissions are set, you can import the data by executing the following script: `./database/import_mongo.sh`

## Delete Backup (Unix)

If you need to delete old backups on a Linux or Unix-based system, you can use the following command: `rm -rf ./backup/*`
