# Deploys app to S3
cd build
aws s3 sync . s3://oneills-dream/
