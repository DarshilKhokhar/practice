FROM nginx
WORKDIR /app

COPY nginx-config.sh .
COPY nginx.conf .

RUN chmod +x ./nginx-config.sh
CMD ["./nginx-config.sh"]