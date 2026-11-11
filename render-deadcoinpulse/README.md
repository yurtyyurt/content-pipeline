# Private collector bootstrap

This directory is deployment plumbing only. The application package, credentials, configuration and collected data remain private.

The background worker downloads a private package with a service credential, verifies its pinned SHA-256 digest before extraction, installs locked dependencies and starts its supervisor. Runtime data is stored on one persistent disk. HTTP redirects are rejected and credentials are never logged or passed in command-line arguments.

The proposed plan uses 1 CPU / 2 GB RAM and 10 GB persistent storage: approximately $27.50/month before additional usage charges. Applying the Render plan requires the owner's approval. Automatic deploys are disabled. Review a new package digest before intentionally rebuilding for an update.
