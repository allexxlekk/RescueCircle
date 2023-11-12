# Indicates that the mysql:8.0.20 image will be used as the base image.
FROM mysql:8.0.20

# Sets the MySQL root password, database, and user, and password.
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=rescue_circle
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password