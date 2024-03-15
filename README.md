# Remove labels Github action

Remove labels from pull requests and issues. This action should be kept simple,
used, for example, to remove a `requested changes` label when a pull is merged.
If the issue or pull request does not contains the label/s, it does nothing.

## Inputs

- **token**: Github token.
- **labels**: Labels to remove.

## Usage

```yaml
name: Remove outdated labels
on:
  # https://github.community/t/github-actions-are-severely-limited-on-prs/18179/15
  pull_request_target:
    types:
      - closed
  issues:
    types:
      - closed
jobs:
  remove-merged-pr-labels:
    name: Remove merged pull request labels
    if: github.event.pull_request.merged
    runs-on: ubuntu-latest
    steps:
      - uses: mondeja/remove-labels-gh-action@v2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: |
            awaiting reply
            changes requested
            duplicate
            in discussion
            invalid
            out of scope
            pending
            won't add

  remove-closed-pr-labels:
    name: Remove closed pull request labels
    if: github.event_name == 'pull_request_target' && (! github.event.pull_request.merged)
    runs-on: ubuntu-latest
    steps:
      - uses: mondeja/remove-labels-gh-action@v2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: in discussion

  remove-closed-issue-labels:
    name: Remove closed issue labels
    if: github.event.issue.state == 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: mondeja/remove-labels-gh-action@v2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: |
            in discussion
            pending
```
