FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /app/api
COPY ./requirements ./requirements/
RUN pip install -r requirements/local.txt
COPY . /app/api/
EXPOSE 8000