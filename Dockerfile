# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Copy TypeScript configuration and source files
COPY tsconfig*.json ./
COPY src/ ./src/

# Build the TypeScript application
RUN npm run build

# Expose the port the app runs on (assuming your app runs on port 3000)
EXPOSE 3000

# Command to run the application
CMD [ "node", "dist/index.js" ]
