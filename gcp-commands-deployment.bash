 gcloud compute ssh sensor-app-vm --zone=us-central1-c --command "rm -rf ~/SensorApp/*"
# make sure rsync is installed in the VM. -- sudo apt update; sudo apt install rsync -y

rsync -avz \
  --exclude 'node_modules' \
  --exclude 'bin' \
  --exclude 'obj' \
  --exclude '.git' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  -e "ssh -i ~/.ssh/google_compute_engine" \
  /Users/harshasanam/AI/SensorApp/ \
  harshasanam@35.222.164.202:/home/harshasanam/SensorApp
  # Stop and remove all containers.  docker rm -f $(docker ps -aq)

# Remove all images.  docker rmi -f $(docker images -aq)

# Remove unused volumes. docker volume prune -f

# Remove unused build cache (important!). docker builder prune -a -f

gcloud compute ssh sensor-app-vm --zone=us-central1-c --command "docker rm -f $(docker ps -aq);docker rmi -f $(docker images -aq);docker builder prune -a -f;cd SensorApp; docker-compose down; docker-compose build --no-cache;docker-compose up -d;"

