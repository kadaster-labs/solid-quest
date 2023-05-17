#!/bin/bash

cli_command='docker compose'
build_flag=''

function podman_safety_check() {
    if ! command -v docker &> /dev/null
    then
        echo ".. docker could not be found"
        # exit
    fi
    if command -v podman &> /dev/null
    then
        echo ".. using podman instead"
        cli_command=podman-compose
    fi
}

podman_safety_check

OPTION_BUILD=$1
if [[ "$OPTION_BUILD" == "-b" ]] 
then
    echo "Building images before starting them ..."
    echo
    echo "Setting the build flag [--build]"
    build_flag='--build'
fi

echo "Starting backing services for development ..."
echo
$cli_command up solid-pod-provider mock-overheid-server $build_flag
