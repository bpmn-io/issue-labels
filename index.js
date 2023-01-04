const fs = require('fs');

const yaml = require('js-yaml');
const labelSync = require('github-label-sync');

const issues = parseIssues('./issues.json');
const labels = parseLabels('./labels.yml');

const repositories = extractRepositories(issues);

console.log(`found ${repositories.length} active repositories`);
console.log(`found ${labels.length} labels`);

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DRY_RUN = process.env.DRY_RUN;



synchronizeLabels(repositories, labels).catch(error => {
  console.error(error);

  process.exit(1);
});


/**
 * @param {string[]} repositories
 * @param {any[]} labels
 *
 * @return Promise<any>
 */
async function synchronizeLabels(repositories, labels) {
  for (const repo of repositories) {
    await synchronizeRepositoryLabels(repo, labels);
  }
}

/**
 * @param {string} repo
 * @param {any[]} labels
 *
 * @return Promise<any>
 */
function synchronizeRepositoryLabels(repo, labels) {

  if (!ACCESS_TOKEN) {
    throw new Error('no env.ACCESS_TOKEN provided');
  }

  console.log(`synchronizing ${ repo }`);

  return labelSync({
    allowAddedLabels: true,
    accessToken: ACCESS_TOKEN,
    dryRun: DRY_RUN,
    repo,
    labels
  });
}

function parseIssues(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(error);

    throw new Error(`failed to parse issues from <${path}>`);
  }
}

function parseLabels(path) {
  try {
    return yaml.load(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(error);

    throw new Error(`failed to parse labels from <${path}>`);
  }
}

function extractRepositories(issues) {
  return Object.keys(
    Object.values(issues.items).flat().filter(
      (issue) => issue.state === 'open'
    ).reduce(
      (repositories, issue) => {
        repositories[`${ issue.repository.owner.login }/${ issue.repository.name }`] = 1;

        return repositories;
      }, {}
    )
  );

}