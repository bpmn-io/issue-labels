const fs = require('fs');

const yaml = require('js-yaml');
const labelSync = require('github-label-sync');

const issues = parseIssues('./issues.json');

const defaultLabels = parseLabels('./labels-default.yml');
const additionalLabels = parseLabels('./labels-additional.yml');

const repositories = extractRepositories(issues);

console.log(`found ${repositories.length} active repositories`);
console.log(`found ${defaultLabels.length} labels`);

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DRY_RUN = process.env.DRY_RUN;


/**
 * @param {string[]} repositories
 * @param {any[]} labels
 *
 * @return Promise<any>
 */
async function synchronizeLabels(repositories, labels) {
  if (!ACCESS_TOKEN) {
    console.warn('skipping label sync: no env.ACCESS_TOKEN provided');
    return false;
  }

  for (const repo of repositories) {
    await synchronizeRepositoryLabels(repo, labels);
  }

  return true;
}

class ColorDefs {

  constructor() {
    this.c = {};
  }

  getColorName(label) {
    let suffix = 0;

    do {
      const name = label.group + (suffix ? `-${suffix}` : '');

      const color = this.c[name];

      if (!color) {
        this.c[name] = label.color;

        return name;
      }

      if (color === label.color) {
        return name;
      }

      suffix++;
    } while (true);
  }

  getColors() {
    return Object.entries(this.c).map(([ name, color ]) => {
      return { name, color };
    });
  }
}

/**
 * @param {string} repo
 * @param {any[]} labels
 *
 * @return Promise<any>
 */
function synchronizeRepositoryLabels(repo, labels) {

  console.log(`synchronizing ${ repo }`);

  return labelSync({
    allowAddedLabels: true,
    accessToken: ACCESS_TOKEN,
    dryRun: DRY_RUN,
    repo,
    labels: labels.map(label => {

      const {
        group,
        ...rest
      } = label;

      return rest;
    })
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

function generatePreview(defaultLabels, additionalLabels) {
  const previewTemplate = fs.readFileSync('./icons/_preview.html', 'utf8');

  const colorDefs = new ColorDefs();

  const preview = previewTemplate
    .replace('{{ DEFAULT_ICONS }}', labelsToHtml(defaultLabels, colorDefs))
    .replace('{{ ADDITIONAL_ICONS }}', labelsToHtml(additionalLabels, colorDefs))
    .replace('{{ COLOR_DEFINITIONS }}', colorsToHtml(colorDefs));

  console.log('generating label preview to ./icons/preview.html');

  fs.writeFileSync('./icons/preview.html', preview, 'utf8');
}

function labelsToHtml(labels, colorDefs) {

  const grouped = Object.entries(labels.reduce((groups, label) => {
    const group = groups[label.group || '_'] = groups[label.group || '_'] || [];

    group.push(label);

    return groups;
  }, {}));

  return grouped.map(
    ([ groupName, labels ]) => `
      <p>${ labels.map(label => {
        const name = colorDefs.getColorName(label);

        return `
          <span class="tag"
                title="${ label.description || label.name }"
                style="background-color: var(--color-${name}-bg); color: var(--color-${name}-fg)">
            ${ label.name }
          </span>
        `;
      }).join(' ') }</p>
    `
  ).join(' ');
}

function isLight(color) {
  /* eslint no-bitwise: "off" */
  color = +('0x' + color.replace(color.length < 5 && /./g, '$&$&'));
  const r = color >> 16,
        g = (color >> 8) & 255,
        b = color & 255;
  const hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  return hsp > 145;
}

function colorsToHtml(colorDefs) {

  const colors = colorDefs.getColors();

  return `
    <style>
      :root {
        ${ colors.map(color => `
          --color-${ color.name }-bg: #${ color.color };
          --color-${ color.name }-fg: var(${ isLight(color.color) ? '--color-light-fg' : '--color-dark-fg' });
        `).join('') }
      }
    </style>
  `;
}


generatePreview(defaultLabels, additionalLabels);

synchronizeLabels(repositories, defaultLabels).then(success => {
  if (!success) {
    process.exit(1);
  }
}).catch(error => {
  console.error(error);

  process.exit(1);
});