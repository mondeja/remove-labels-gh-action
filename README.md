# Remove labels GitHub action

Remove labels from pull requests and issues.
If the issue or pull request does not contains the label/s, it does nothing.

## Inputs

- **token**: Github token.
- **labels**: Labels to remove.

## Usage

```yaml
name: Remove outdated labels

on:
  pull_request:
    types:
      - closed
  issues:
    types:
      - closed

permissions:
  issues: write
  pull-requests: write

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
    if: github.event_name == 'pull_request' && (! github.event.pull_request.merged)
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
