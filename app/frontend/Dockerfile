FROM debian:stable

WORKDIR /home
RUN apt-get update \
	&& apt-get install -y curl git vim\
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
	&& apt-get clean -y \
	&& apt-get autoremove -y
ENV LC_ALL=C.UTF-8
COPY .	/home
WORKDIR /home/src
RUN npm i
EXPOSE 3000
HEALTHCHECK --interval=3m --timeout=3s --retries=3 CMD curl -f http://localhost || exit 1
CMD npm run build && npm run preview -- --port 3000 --host 0.0.0.0
# CMD npm run dev -- --port 3000 --host 0.0.0.0
