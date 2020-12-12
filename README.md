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
  pull_request:
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
      - name: removelabel
        uses: mondeja/remove-labels-gh-action@v1
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

  remove-closed-issue-labels:
    name: Remove closed issue labels
    if: github.event.issue.state == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: removelabel
        uses: mondeja/remove-labels-gh-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: |
            awaiting reply
            changes requested
            in discussion
            pending
```
