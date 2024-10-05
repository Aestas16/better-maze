FROM ubuntu:20.04

COPY interactor.cpp /sandbox/
COPY judger.cpp /sandbox/

WORKDIR /sandbox/

RUN apt-get update \
 && apt-get install gcc -y \
 && apt-get install g++ -y \
 && g++ interactor.cpp -o interactor \
 && g++ judger.cpp -o judger