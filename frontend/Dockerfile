# Use the Node.js base image

FROM node:16.16.0
 
# Set the working directory

WORKDIR /frontend-app
 
# Copy package files into the container

COPY package.json package-lock.json /frontend-app/
 
# Install dependencies with legacy peer dependency resolution

RUN npm ci --legacy-peer-deps
 
# Copy the rest of the application code into the container

COPY . .
 
# Expose the port React will use

EXPOSE 3000
 
# Command to run the React development server

CMD ["npm", "start"]
 