FROM php:8.2-apache

# Enable Apache rewrite module
RUN a2enmod rewrite

# Allow .htaccess overrides
RUN sed -i "s/AllowOverride None/AllowOverride All/g" /etc/apache2/apache2.conf

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Restart Apache
RUN service apache2 restart
