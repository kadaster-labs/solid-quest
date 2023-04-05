#!/bin/bash

cli_command=docker

function podman_safety_check() {
    if ! command -v docker &> /dev/null
    then
        echo ".. docker could not be found"
        # exit
    fi
    if command -v podman &> /dev/null
    then
        echo ".. using podman instead"
        cli_command=podman
    fi
}

podman_safety_check

echo "Building mock-overheid-server ..."
echo
$cli_command build -t solid-quest_mock-overheid-server mock-overheid-server

echo "Building vc-api ..."
echo
$cli_command build -t solid-quest_vc-api vc-api

