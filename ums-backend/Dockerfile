# ums-backend/Dockerfile

FROM node:20-slim

WORKDIR /app

# Step 1: Copy package files and install dependencies
COPY package*.json ./
RUN npm install
# (The correct bcrypt binary is installed here)

# Step 2: Copy the rest of the source code. 
# Crucially, we skip copying node_modules from the host using .dockerignore
# The clean binaries are already in place from the npm install step above.
COPY . .

# Expose the port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]