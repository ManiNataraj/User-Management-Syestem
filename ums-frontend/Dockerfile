# Stage 1: Builder Stage (Compile React application)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies manifest
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build command (creates the 'build' folder)
RUN npx react-scripts build

# Stage 2: Production Stage (Serve static files with Nginx)
# Use a very lightweight image that contains only Nginx
FROM nginx:alpine

# Copy the compiled build output from the builder stage into the Nginx public folder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config (optional, but good practice for SPA routing)
# If you created a custom nginx.conf, copy it here:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx runs on
EXPOSE 80

# The default Nginx command will run, serving the React app
CMD ["nginx", "-g", "daemon off;"]