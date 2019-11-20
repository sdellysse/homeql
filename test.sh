#!/bin/sh

echo '{"_id": "foo1", "command": "autodetect", "event_id": "autodetected"}' | ./src/drivers/kasa/kasa.sh
