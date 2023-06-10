FROM debian:stable

WORKDIR /home
RUN apt-get update \
	&& apt-get install -y curl git\
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
	&& apt-get clean -y \
	&& apt-get autoremove -y
ENV LC_ALL=C.UTF-8
COPY .	/home
WORKDIR /home/src
RUN npm i
CMD npm run start
