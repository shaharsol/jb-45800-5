# start with an existing image that contains an os named alpine and
# has node 24 installed
FROM node:24-alpine

# install fifa
# RUN apt-get install fifa

# at some stage i want to start copying files into the image
# when i start copying files, i usually want to copy them to 
# a specific location on the image
# this is like creating a folder (mkdir) and then changing
# the diretory to work on it (cd)
WORKDIR /app

# now i want to copy all my src files to the workdir
# it will copy all the files in the source (except the Dockerfile itself)
# and i can also exclude files using a .dockerignore
COPY ./ ./

# the last command in a dockerfile will be a command that runs my 
# software once the container is started
CMD [ "node",  "/app/app.js" ]





