const core = require('@actions/core');
const github = require('@actions/github');

const multilineStringToArray = (value) => {
  return value.split("\n")
              .map(line => line.trim())
              .filter(line => line)
              .sort();
}

const getLabelsToRemove = () => {
  return multilineStringToArray(core.getInput("labels"));
}

const run = async function() {
  const payload = github.context.payload;
  const token = core.getInput("token");
  const client = new github.getOctokit(token);

  const labelsToRemove = getLabelsToRemove();

  const isIssue = Object.prototype.hasOwnProperty.call(payload, "issue");
  const issueOrPullNumber = payload[isIssue ? "issue" : "pull_request"].number,
        issueOrPullReadable = isIssue ? "issue" : "pull request";

  try {
    const {data: labelsData} = await client.issues.listLabelsOnIssue({
      ...github.context.repo,
      issue_number: issueOrPullNumber
    });
  } catch (err) {
    const errorMessage = `\u001b[91mError listing labels`
                       + ` of ${issueOrPullReadable} #${issueOrPullNumber}:`
                       + ` ${err.message}`;
    core.setFailed(errorMessage);
    process.exit(1)
  }

  const filteredLabelsToRemove =
    labelsData.map(l => l.name)
              .filter(labelName => labelsToRemove.includes(labelName))
              .sort();

  filteredLabelsToRemove.forEach((labelName) => {
    const foundLabelMessage = `Found label "${labelName}" in`
                            + ` ${issueOrPullReadable} #${issueOrPullNumber}.`;
    core.info(foundLabelMessage);

    client.issues.removeLabel({
      ...github.context.repo,
      issue_number: issueOrPullNumber,
      name: labelName,
    }).then((response) => {
      if (response.status === 200) {
        const successMessage = `\u001b[92mLabel "${labelName}" successfully`
                             + ` removed from ${issueOrPullReadable}`
                             + ` #${issueOrPullNumber}.`;
        core.info(successMessage);
      } else {
        const warningMessage = `\u001b[93mUnexpected response status code`
                           + ` "${response.status}" in remove label request`
                           + ` response. DETAILS:\n${response}`;
        core.warning(warningMessage);
      }
    }).catch((err) => {
      const errorMessage = `\u001b[91mError removing label "${labelName}"`
                         + ` from ${issueOrPullReadable}`
                         + ` #${issueOrPullNumber}: ${err.message}`;
      core.setFailed(errorMessage);
    });
  });
}

if (require.main === module) {
    run();
}

module.exports = {
  getLabelsToRemove,
  run
}
