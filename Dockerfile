# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory inside the container
WORKDIR /Pastebin

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables for MongoDB and Memcached
ENV MONGO_URL=mongodb://mongo:27017
ENV MEMCACHED_URL=memcached:11211

# Start the application
CMD ["node", "server.js"]
