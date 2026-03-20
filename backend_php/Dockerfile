FROM php:8.5-apache

RUN apt-get update && \
    apt-get install -y zlib1g-dev libpng-dev libjpeg-dev libwebp-dev

RUN docker-php-ext-install pdo pdo_mysql mysqli
RUN docker-php-ext-configure gd --with-jpeg --with-webp && \
    docker-php-ext-install gd

# Enable Apache rewrite module
RUN a2enmod rewrite

# Allow .htaccess overrides
RUN sed -i "s/AllowOverride None/AllowOverride All/g" /etc/apache2/apache2.conf

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN echo "log_errors=On" > /usr/local/etc/php/conf.d/docker-logs.ini \
 && echo "error_log=/proc/self/fd/2" >> /usr/local/etc/php/conf.d/docker-logs.ini

# Restart Apache
RUN service apache2 restart
