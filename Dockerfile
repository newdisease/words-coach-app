FROM node:22-bookworm-slim AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
ARG REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_BASE_URL=/api/
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
RUN npm run build

# Python 3.10 is compatible with the project's existing dependency pins.
FROM python:3.10-slim-bookworm
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=config.settings.production
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends nginx supervisor \
    && rm -rf /var/lib/apt/lists/* /etc/nginx/sites-enabled/default
COPY backend/requirements/ ./requirements/
RUN pip install --no-cache-dir -r requirements/production.txt
COPY backend/ ./
RUN SECRET_KEY=build-only-not-a-runtime-secret DATABASE_URL=postgres://build:build@localhost/build \
    python manage.py collectstatic --noinput
COPY --from=frontend /frontend/build /app/frontend
COPY deploy/nginx.conf /etc/nginx/conf.d/words-coach.conf
COPY deploy/supervisord.conf /etc/supervisor/conf.d/words-coach.conf
COPY deploy/start.sh deploy/release.sh /app/deploy/
EXPOSE 8080
CMD ["sh", "/app/deploy/start.sh"]
