const core = require('@actions/core');
const github = require('@actions/github');

const run = async function() {
  const payload = github.context.payload;
  const githubToken = core.getInput("token");
  const client = new github.getOctokit(githubToken);

  let labelsToRemove = core.getInput("labels")
                           .split("\n")
                           .map(line => line.trim())
                           .filter(line => line);

  const isIssue = payload.hasOwnProperty("issue");
  const issueOrPullNumber = payload[isIssue ? "issue" : "pull_request"].number;

  const {data: labelsData} = await client.issues.listLabelsOnIssue({
    ...github.context.repo,
    issue_number: issueOrPullNumber
  });

  labelsData.map(l => l.name).forEach((labelName) => {
    if (!labelsToRemove.includes(labelName)) {
      return;
    }
    const foundLabelMessage = `Found label "${labelName}" in`
                            + ` ${isIssue ? "issue" : "pull request"}`
                            + ` #${issueOrPullNumber}.`;
    console.debug(foundLabelMessage);
    core.info(foundLabelMessage);

    client.issues.removeLabel({
      ...github.context.repo,
      issue_number: issueOrPullNumber,
      name: labelName,
    }).then((response) => {
      if (response.status === 200) {
        const successMessage = `\u001b[92mLabel "${labelName}" successfully`
                             + ` removed from`
                             + ` ${isIssue ? "issue" : "pull request"}`
                             + ` #${issueOrPullNumber}.`
        console.log(successMessage);
        core.info(foundLabelMessage);
      } else {
        const warningMessage = `\u001b[93mUnexpected response status code`
                           + ` "${response.status}" in remove label request`
                           + ` response. DETAILS:\n${response}`
        console.warn(warningMessage);
        core.warning(warningMessage);
      }
    }).catch((err) => {
      const errorMessage = `\u001b[91mError removing label "${labelName}"`
                         + ` from ${isIssue ? "issue" : "pull request"}`
                         + ` #${issueOrPullNumber}: ${err.message}`;
      console.error(errorMessage);
      core.setFailed(errorMessage);
    });
  });
}

module.exports = run();
