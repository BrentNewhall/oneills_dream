# Deploys app to S3
echo cd build
echo aws s3 sync . s3://oneills_dream/ --recursive
