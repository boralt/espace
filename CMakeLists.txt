cmake_minimum_required(VERSION 3.15)
project(espace)

set(CMAKE_CXX_STANDARD 14)

include_directories(Espace)
include_directories(json/json)
include_directories(sandbird/src)

configure_file(Espace/config.json ${CMAKE_CURRENT_BINARY_DIR})

add_executable(espace
        Espace/asearch.cpp
        Espace/Espace.cpp
        Espace/run_config.cpp
        Espace/run_config.h
        Espace/Mutex.h
        Espace/WorkerQueue.h
        Espace/WorkerQueue.cpp
        Espace/Thread.h
        Espace/Thread.cpp
        Espace/web.h
        Espace/web.cpp
        sandbird/src/sandbird.c
        sandbird/src/sandbird.h
        json/json/json-forwards.h
        json/json/json.h
        json/jsoncpp.cpp)
