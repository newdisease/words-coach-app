# Fly.io deployment

The public app is https://words-coach-app.fly.dev. React is built into the same image as Django; nginx serves the frontend and forwards `/api/`, `/admin/`, and `/healthz` to Gunicorn. Fly handles HTTPS. PostgreSQL lives in `words-coach-db` in Frankfurt, on a persistent 1 GB volume. There is one web machine and one database machine. An empty database is provisioned; no old user data has been imported.

## Deploy an update

From the repository root:

```sh
flyctl deploy --remote-only --ha=false
```

`deploy/release.sh` waits for the database and applies committed Django migrations before updating the app. It never generates migrations or seeds demo accounts. Static assets are built into the image. Database data is independent of web deployments.

The GitHub workflow deploys on tags or manual dispatch. Add an app-scoped deploy token as the repository secret `FLY_API_TOKEN` before using it. The old SSH/DigitalOcean secrets are no longer used. The legacy Docker Compose and certbot files are retained only as references.

## Integrations and administration

Set `DEEPL_AUTH_KEY` as a Fly secret to enable translation. To avoid putting the value in shell history, run this and type `DEEPL_AUTH_KEY=your-key`, followed by Ctrl-D:

```sh
flyctl secrets import -a words-coach-app
```

Google sign-in is hidden until a client ID is supplied at build time. Add `https://words-coach-app.fly.dev` to the OAuth client's authorized JavaScript origins in Google Cloud, set up the Google social application for the current site in Django admin, then deploy with:

```sh
flyctl deploy --remote-only --ha=false --build-arg REACT_APP_GOOGLE_CLIENT_ID=your-public-client-id
```

For GitHub deployments, set the repository variable `GOOGLE_CLIENT_ID` too. The client ID is public; the Google client secret belongs only in the backend social-app configuration. Email/password registration and login do not need Google. Translation needs a working DeepL key. Email delivery/password resets need a separately configured mail backend.

Create your own administrator interactively:

```sh
flyctl ssh console -a words-coach-app
python manage.py createsuperuser
```

The deployed Django Sites record uses `words-coach-app.fly.dev`. For a fresh installation, update the initial `example.com` site in Django admin. Do not run the legacy `initadmin` command: it uses a fixed demo password.

## Sleep and wake-up

The web app has `auto_stop_machines = 'stop'`, `auto_start_machines = true`, and `min_machines_running = 0`. Fly checks for spare capacity every few minutes; this is not an exact inactivity timer. Incoming traffic, including bots, can keep it awake or wake it again. The health check deliberately does not query the database.

The database uses `FLY_SCALE_TO_ZERO = '1h'`, automatic wake-up on both PostgreSQL services, and an `on-failure` restart policy. The database checks for open client connections every hour and shuts down only when idle. Django closes database connections after requests, uses a 30-second connection timeout, and waits up to roughly two minutes for the database on startup. `DATABASE_URL` must use `words-coach-db.flycast`, not `.internal`, for wake-up routing.

The persistent volume still costs money while the machine sleeps. Stopped machines do not incur CPU/RAM charges. This single-machine PostgreSQL setup follows the existing personal apps; it is unmanaged and has no replica/failover.

Database configuration is saved in `deploy/fly-apps/words-coach-db.toml` and pins the image digest. Apply changes separately:

```sh
flyctl deploy -c deploy/fly-apps/words-coach-db.toml --ha=false --strategy immediate
```

Do not scale the database by cloning without setting up replication. Check volume snapshots and make PostgreSQL logical backups before restoring or making database changes:

```sh
flyctl volumes list -a words-coach-db
flyctl volumes snapshots list VOLUME_ID -a words-coach-db
```

Restore any old backup into a separate database first, verify it, then change `DATABASE_URL`. Keep the new database until the restored data is verified.

## Validation and maintenance

The runtime retains the legacy Django/auth dependency versions and uses compatible Python 3.10; this migration is not a dependency/security upgrade. Plan a supported Django/Python upgrade separately. The user's pre-existing edits to `backend/requirements/base.txt` are preserved.

Verified the built image with all 12 API tests, clean migrations, local signup/login/dictionary writes, local HTTP smoke checks, and the same HTTP smoke checks over the public Fly URL. Observed the web machine stop automatically and wake for a request. Also stopped the new database and verified that a public request woke both the app and database.

The API tests mock the external translation call and cover a database-free health probe and missing translation credentials. Run tests against a disposable PostgreSQL database, never production:

```sh
docker build --platform linux/amd64 -t words-coach-fly:test .
# Supply SECRET_KEY, ALLOWED_HOSTS=localhost,testserver and a disposable DATABASE_URL.
docker run --rm --env-file /path/to/test.env words-coach-fly:test python manage.py test tests --noinput
```

References: [Fly autostop/autostart](https://fly.io/docs/launch/autostop-autostart/) and [PostgreSQL scale to zero](https://fly.io/docs/postgres/managing/scale-to-zero/).
