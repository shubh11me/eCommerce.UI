# Use an LTS Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package manifests and install dependencies first (cacheable)
COPY package*.json ./
RUN npm ci --no-fund --no-audit

# optional: install global Angular CLI (not required if you run via npm script)
# RUN npm install -g @angular/cli@17

# Copy the rest of the app (docker-compose will mount host source over this for dev)
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# run the local ng installed in node_modules via npm script (recommended)
CMD ["npm", "run", "start:docker"]
