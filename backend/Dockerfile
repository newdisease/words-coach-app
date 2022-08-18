FROM python:3.9-slim
ENV PYTHONUNBUFFERED 1
WORKDIR /app/api
COPY ./requirements ./requirements/
RUN pip install --upgrade pip
RUN pip install -r requirements/production.txt
COPY . /app/api/
EXPOSE 8000
