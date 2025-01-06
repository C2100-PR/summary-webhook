#!/bin/bash

# Deploy to us-west1
gcloud functions deploy summary-webhook \
  --region=us-west1 \
  --runtime=nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --memory=256MB \
  --timeout=60s \
  --max-instances=10 \
  --min-instances=0 \
  --concurrency=80 \
  --entry-point=summary-webhook

echo "Deployment to us-west1 completed"
echo "New webhook URL: https://us-west1-api-for-warp-drive.cloudfunctions.net/summary-webhook"