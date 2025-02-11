
    FROM node:20-alpine AS builder

    WORKDIR /app
    

    WORKDIR /app/backend
    COPY backend/package*.json ./
    COPY backend/package-lock.json ./
    RUN npm install
    
    COPY backend ./
    RUN npm run build
    
  
    WORKDIR /app/frontend/chapter-one
    COPY frontend/chapter-one/package*.json ./
    COPY frontend/chapter-one/package-lock.json ./
    RUN npm install
    
    COPY frontend/chapter-one ./
    

    RUN npm run build 
    

    FROM node:20-alpine AS production
    
    WORKDIR /app
    

    COPY --from=builder /app/backend/package*.json ./
    COPY --from=builder /app/backend/package-lock.json ./
    RUN npm ci --omit=dev  # Changed npm install to npm ci
    

    COPY --from=builder /app/backend/dist ./
    

    COPY --from=builder /app/frontend/chapter-one/dist/browser  ./public
    

    CMD ["npm", "start"]