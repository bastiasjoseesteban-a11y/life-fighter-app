FROM openjdk:17-jdk-slim
RUN apt-get update && apt-get install -y git wget unzip
WORKDIR /app
COPY . .
RUN cd android && ./gradlew :app:bundleRelease
