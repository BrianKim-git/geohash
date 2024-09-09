FROM node:20-slim

RUN apt-get update && apt install -fy procps \
    git \
    locales \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP.UTF-8
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9
