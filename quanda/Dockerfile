FROM python:3.11.4-slim-buster

WORKDIR /quanda

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# System Sependencies
RUN apt-get update && apt-get install -y netcat

# Dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Entrypoint
COPY ./entrypoint.sh .
RUN chmod +x /quanda/entrypoint.sh

# Source
COPY . .

# Run
ENTRYPOINT ["/quanda/entrypoint.sh"]