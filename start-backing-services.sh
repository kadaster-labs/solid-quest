#!/bin/bash

cli_command='docker compose'

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

echo "Starting backing services for development ..."
echo
$cli_command up solid-pod-provider mock-overheid-server vc-api
