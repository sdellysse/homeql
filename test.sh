#!/bin/sh

echo '{"command": "discovery_enable", "reply_id": "r01", "event_id": "discovery_event"}' | exec ./src/drivers/kasa/kasa.sh
