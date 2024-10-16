# Debugging GitHub Actions

While it might be tempting to make sample PRs to test your new changes under `.github` on this repo or forks of it, it is better to test with a tool called [act]()

## How would you use it here?

1. [Install Docker](https://docs.docker.com/engine/install)
2. [Install act](https://github.com/nektos/act?tab=readme-ov-file#manually-building-from-source)
  > Requires go 1.20+ to build
3. [Authenticate to act](https://nektosact.com/usage/index.html#github_token)
3. Start Docker's service:
   ```sh
   sudo systemctl start docker
   ```
   > This command is for SystemD and sudo and may be different if your OS uses a different init system, so adjust accordingly
4. Test the workflows:
  ```sh
  sudo act -s GITHUB_TOKEN="$(gh auth token)" pull_request
  ```
  > The `-s` flag is to log-in automatically with the token given by the GitHub CLI. Read [here](https://nektosact.com/usage/index.html#github_token) if you do not have `gh` installed or are not authenticated in it already.
  > Replace `pull_request` with workflow you want to test
  > This example assumes you have `sudo` installed
