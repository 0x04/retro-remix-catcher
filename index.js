#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs');

const program = require('commander');
const info = require('./package');


program
  .version(info.version, '-v, --version')
  .usage('[options] <output-file>')
  .requiredOption('-h, --host <host>', 'host without protocol')
  .requiredOption('-p, --path <path>', 'path - `${page}` is the placeholder of current page')
  .option('-s, --start <n>', 'start page', '1')
  .option('-e, --end <n>', 'end page')
  .option('-x, --exclude <exclude>', 'regex to exclude specific links')
  .option('-t, --types <types>', 'comma separated list of file types', 'mp3')
  .option('--ssl', 'use ssl', true)
  .option('--no-ssl', 'don\'t use ssl')
  .parse(process.argv);

const defaults = {
  host: program.host,
  path: program.path
};

/**
 * Search for MP3s in `href` attributes.
 * @param {string} content
 * @return {string[]}
 */
function findMP3Links(content)
{
  let result = [];
  let types = program.types.split(/,/).map(type => type.trim());
  let regExp = new RegExp(`href="([^"]+\.(?:${types.join('|')}))"`, 'gi');
  let matches = null;
  let exclude = (program.exclude)
    ? new RegExp(program.exclude)
    : null;

  while ((matches = regExp.exec(content)))
  {
    let match = decodeURIComponent(matches[1]);

    if (exclude && exclude.test(match))
    {
      continue;
    }

    result.push(match);
  }

  return result;
}

/**
 * Request content and search for MP3s.
 * @param {number} number
 * @return {Promise<string[]>}
 */
function getMP3OfPage(number)
{
  return new Promise((resolve, reject) =>
  {
    const options = {
      ...defaults,
      path: defaults.path.replace(/\${page}/g, number)
    };

    const client = (program.ssl) ? https : http;

    client.get(options, (response) =>
    {
      if (response.statusCode !== 200)
      {
        console.error(`error: http status code \`${response.statusCode}\``);
        process.exit(1);
      }

      let content = '';

      response.on('data', chunk => content += chunk);
      response.on('end', () => resolve(findMP3Links(content)));
      response.on('error', error => reject(error));
    });
  });
}

/**
 * Get all MP3s of given pages.
 * @param {number} pageStart
 * @param {number} pageEnd
 * @return {Promise<string[]>}
 */
async function getMP3OfPages(pageStart, pageEnd = pageStart)
{
  let result = [];

  for (let i = pageStart; i <= pageEnd; i++)
  {
    result = result.concat(await getMP3OfPage(i));
  }

  return result;
}

/**
 * Create a M3U file from the given link array.
 * @param {string[]} links
 * @return {string}
 */
function createM3U(links)
{
  let result = '#EXTM3U\n';

  links.forEach(track =>
  {
    let title = track.slice(track.lastIndexOf('/') + 1, -4);
    let url = `http${(program.ssl) ? 's' : ''}://`
      + defaults.host
      + (/\/$/.test(track) ? '' : '/')
      + track.replace(/ /g, '%20');

    result += `#EXTINF:-1,${title}\n#EXTVLCOPT:network-caching=1000\n${url}\n`;
  });

  return result;
}


getMP3OfPages(parseInt(program.start), parseInt(program.end || program.start))
  .then(
    result =>
    {
      const m3u = createM3U(result);

      if (program.args.length === 1)
      {
        const filename = program.args[0];

        fs.writeFile(filename, m3u, (error) =>
        {
          if (error)
          {
            console.error(`error: can\'t write file "${error.message}"`);
            process.exit(1);
          }

          console.log(`File '${filename}' with ${result.length} links written.`);
        });
      }
      else console.log(m3u);
    }
  );
