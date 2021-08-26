const data = require('../data.json');

const sections = {
  info: data => `
## Basic Info
${data.info.map(d => `* **${d.name}**: ${d.value}`).join('\n')}
  `,
  text: data => `
## ${data.title}

${data.content}
  `,
  skills: data => `
## ${data.title}

${data.description}

${data.skills.map(d => `* **${d.title}**: ${d.level} `).join('\n')}
  `,
  experiences: data => `
## ${data.title}

${data.positions.map(d => `
### [${d.company.name}](${d.company.webpage})
**${d.title}** _(${d.startDate} - ${d.endDate})_

${d.description}

`).join('')}
  `,
  projects: data => `
## ${data.title}

${data.description}

${data.projects.map(d => `
**[${d.name}](https://${d.url})**
_${d.tagline}_

${d.description}

`).join('\n')}
  `,
};

let document = `

# Curriculum Vitae

**[Download the latest version](https://github.com/morten-olsen/curriculum-vitae/releases/latest)**

${data.map(d => sections[d.type](d.data)).join('\n------\n')}
`;

console.log(document);
