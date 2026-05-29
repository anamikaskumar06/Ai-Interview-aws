#!/bin/bash

DATE=$(date +%F)

mysqldump -u aiuser -pai123 ai_interview > backup_$DATE.sql

aws s3 cp backup_$DATE.sql s3://ai-project-uploads-1/

rm backup_$DATE.sql



