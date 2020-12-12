# Remove labels Github action

Remove labels from pull requests and issues. This action should be kept simple,
used, for example, to remove a `requested changes` label when a pull is merged.
If the issue or pull request does not contains the label/s, it does nothing.

## Inputs

- **token**: Github token.
- **labels**: Labels to remove.

## Usage

```yaml
name: Remove labels after pull request merge
on:
  pull_request:
    types:
      - closed
jobs:
  remove-label:
    if: github.event.pull_request.merged
    runs-on: ubuntu-latest
    name: Remove labels
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
```
