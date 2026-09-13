# Fly.io idle audit — 2026-09-13

Audited every app visible to the logged-in personal account, comparing deployed configuration and live machine settings. Configuration backups are in the ignored `deploy/audit/` directory. No existing database volumes or user records were deleted.

| App | Findings and action |
| --- | --- |
| `fixture-app` | Two 256 MB web machines already had stop/start enabled and minimum zero, but repeated proxy cordon attempts were abandoned. Redeployed the same application image with explicit HTTP request concurrency (20 soft / 25 hard). Set Prisma database URL options `max_idle_connection_lifetime=60`, `max_connection_lifetime=60`, `connect_timeout=30`, and `pool_timeout=30` to allow idle connections to close and tolerate database wake-up. Database, credentials and other URL parameters are preserved. |
| `lingering-wave-2987` | Fixture's PostgreSQL database. Already uses `FLY_SCALE_TO_ZERO=1h`, automatic start and restart on failure. Events show successful automatic shutdown and proxy wake-up before this audit. No configuration change needed. |
| `pulse-wire` | Both web machines already have stop/start enabled with minimum zero. Temporarily started one to verify its database URL uses `pulse-wire-db.flycast`; it subsequently stopped automatically. No configuration change needed. |
| `pulse-wire-db` | Was running continuously since March with no idle shutdown, autostart disabled, and restart set to always. Deployed `FLY_SCALE_TO_ZERO=1h`, automatic start on ports 5432/5433, and restart on failure. Preserved the exact PostgreSQL image digest, machine size, 1 GB volume and checks. |
| `zbzh` | Expense Tracker. Stop/start enabled with minimum zero; observed stopped with a proxy-initiated stop event. Its SQLite volume is retained. No configuration change needed. |
| `words-coach-app` | New combined React/Django app. One 1 GB web machine, stop/start enabled, minimum zero. Observed automatic stop, public-request wake-up, and another automatic stop after the smoke check. |
| `words-coach-db` | New private PostgreSQL database with a 1 GB volume and 256 MB machine. One-hour idle shutdown, automatic wake-up and restart on failure. Verified a public Words Coach request wakes this database from a stopped state. |
| `fly-builder-holy-surf-6374` | Created by flyctl for the native build. Observed stopped after the build. Future flyctl builds manage its lifecycle. |

## Saved configuration

- Words Coach web: `fly.toml`.
- Words Coach database: `deploy/fly-apps/words-coach-db.toml`.
- Pulse Wire database: `deploy/fly-apps/pulse-wire-db.toml`.
- Fixture web: `deploy/fly-apps/fixture-app.toml`. The HTTP concurrency change is also saved in `/Users/newdisease/Developer/fixture-app/fly.toml` so its next deployment retains it. Other staged work in that repository was left untouched and was not deployed.
- Fixture connection-pool options live in its Fly `DATABASE_URL` secret. Do not replace that secret with an old URL that omits the timeouts.

The existing applications were updated using their exact existing images; no locally staged Fixture application code was deployed. The Pulse Wire database config can be reapplied with `flyctl deploy -c deploy/fly-apps/pulse-wire-db.toml --ha=false --strategy immediate`.

## Rollback

`deploy/audit/*.machines.before.json` contains the original machine configurations, and `*.config.before.json` contains the original app configuration. These files are private and ignored by Git. Review and extract the original machine `config` before using `flyctl machine update MACHINE_ID -a APP --machine-config FILE`. Restore the corresponding app configuration too so future deploys do not reapply the change.

Fixture's original database URL is saved privately in `deploy/audit/fixture-app.database-url.before.env`; restore it with `flyctl secrets import -a fixture-app < deploy/audit/fixture-app.database-url.before.env` if necessary. Never commit or print that file.

## Interpretation

Web autosleep is based on Fly's periodic capacity checks, not a configurable exact idle duration. Internet traffic, including bots, can wake apps. Database shutdown checks occur hourly and require no remaining client connections. Do not apply web-style proxy autostop to PostgreSQL: the database's own idle process shuts it down cleanly. Persistent volumes remain allocated while machines sleep.

References: [Fly autostop/autostart](https://fly.io/docs/launch/autostop-autostart/), [Postgres idle shutdown](https://fly.io/docs/postgres/managing/scale-to-zero/), [Prisma connection-pool timeouts](https://www.prisma.io/docs/orm/v6/prisma-client/setup-and-configuration/databases-connections/connection-pool).
