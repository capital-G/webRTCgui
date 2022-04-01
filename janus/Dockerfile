FROM alpine:3.15

RUN apk add \
    autoconf \
    automake \
    libtool \
    gengetopt \
    lua5.3-dev \
    cmake \
    libsrtp-dev \
	libnice-dev \
    jansson-dev \
    libconfig-dev \
    libusrsctp-dev \
    libmicrohttpd-dev \
	libwebsockets-dev \
    rabbitmq-c-dev \
    curl-dev \
    libogg-dev \
    libopusenc-dev \
	lua \
    duktape-dev \
    npm \
    ffmpeg-dev \
    zlib-dev \
    libogg-dev \
	libuv-dev \
    sofia-sip-dev \
    git \
    g++ \
    alpine-sdk

WORKDIR /root

RUN git clone --depth 1 https://github.com/meetecho/janus-gateway.git && \
    cd janus-gateway && \
    ./autogen.sh && \
    ./configure \
    --prefix=/opt/janus \
    --disable-rabbitmq \
	--disable-mqtt && \
    make && \
    make install && \
    make configs && \
    rm -rf /root/janus-gateway

ENTRYPOINT [ "/opt/janus/bin/janus" ]
