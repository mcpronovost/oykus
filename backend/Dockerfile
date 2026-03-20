FROM python:3.14-alpine AS builder

RUN apk add --no-cache \
    build-base \
    libjpeg-turbo-dev \
    zlib-dev \
    libwebp-dev \
    musl-dev

WORKDIR /app

COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.14-alpine

RUN apk add --no-cache \
    libjpeg-turbo \
    zlib \
    libwebp \
    libstdc++ \
    bash

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*

COPY . .

EXPOSE 8000

CMD ["gunicorn", "oyk.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]