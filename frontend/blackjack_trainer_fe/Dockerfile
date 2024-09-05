# -----------------------------
# STAGE 1
# -----------------------------

FROM node:latest
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
RUN npm install
RUN npm run build

# -----------------------------
# STAGE 2
# -----------------------------

FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
