"""Read-only smoke check: python3 deploy/smoke.py https://words-coach-app.fly.dev"""
import json
import re
import sys
from urllib.error import HTTPError
from urllib.request import Request, urlopen

base = sys.argv[1].rstrip('/')


def get(path, status=200, content_type=None):
    req = Request(base + path, headers={'X-Forwarded-Proto': 'https'})
    try:
        response = urlopen(req, timeout=120)
    except HTTPError as error:
        response = error
    with response:
        body = response.read()
        assert response.status == status, (path, response.status, body[:200])
        if content_type:
            assert content_type in response.headers.get('Content-Type', ''), path
        print(f'{path}: {response.status}')
        return body


home = get('/', content_type='text/html')
assert b'<div id="root"></div>' in home
assert get('/dictionary', content_type='text/html') == home
assert get('/quiz', content_type='text/html') == home
assert json.loads(get('/healthz', content_type='application/json')) == {'status': 'ok'}
get('/api/dictionary/', status=401, content_type='application/json')
get('/api/not-a-route/', status=404)
get('/admin/login/', content_type='text/html')
get('/django_static/admin/css/base.css', content_type='text/css')
get('/static/missing.js', status=404)
for asset in re.findall(rb'(?:src|href)="(/static/[^" ]+)"', home):
    get(asset.decode())
print('Smoke checks passed.')
