#!/bin/sh
set -eu
python manage.py wait_for_db
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/words-coach.conf
