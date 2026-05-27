FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy application files to Apache document root
COPY src/ /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html

# Configure Apache to listen on Railway's PORT
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

EXPOSE 80
