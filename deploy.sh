set -o allexport
source .env
set +o allexport

echo "Deploying to $REMOTE_HOST"

rm -rf ./build
pnpm run build
# Create the remote directory if it doesn't exist
ssh root@${REMOTE_HOST} "mkdir -p /var/www/${DOMAIN}/${NAME}"
# Copy the build directory to the remote server
rsync -av ./build/ root@${REMOTE_HOST}:/var/www/${DOMAIN}/${NAME}

echo "Deployed to $REMOTE_HOST"
