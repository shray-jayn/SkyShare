# Use lightweight Node.js Alpine image
FROM node:18-alpine

# Install OpenSSL (latest version available in Alpine)
RUN apk add openssl

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Ensure Prisma Client is generated
RUN npx prisma generate

# Build the application
RUN npm run build

# Start the application
CMD ["node", "dist/src/main.js"]
