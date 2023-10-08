FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y curl vim

WORKDIR /quanda
COPY ./quanda/ .

RUN pip install --upgrade pip && pip install -r requirements.txt

# CMD ["gunicorn", "kovax.wsgi:application", "--bind", "0.0.0.0:8000"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]