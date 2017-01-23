import GitRepo from 'git-repository';
import run from './run';
import fetch from './lib/fetch';

// TODO: Update deployment URL
// For more information visit http://gitolite.com/deploy.html
const getRemote = (slot) => ({
  name: slot,
  url: slot === 'production' ? 'ssh://root@178.63.0.12/var/repo/totaldraft.git' : `ssh://root@188.166.14.52/var/repo/${slot}.git`,
  website: `http://${(slot === 'staging') ? 'dev.' : ''}totaldraft.com`
});

/**
 * Deploy the contents of the `/build` folder to a remote
 * server via Git. Example: `npm run deploy -- production`
 */
async function deploy() {
  // By default deploy to the staging deployment slot
  const remote = getRemote(process.argv.includes('production') ? 'production' : 'staging');

  // Initialize a new Git repository inside the `/build` folder
  // if it doesn't exist yet
  const repo = await GitRepo.open('build', { init: true });
  await repo.setRemote(remote.name, remote.url);

  // Fetch the remote repository if it exists
  if ((await repo.hasRef(remote.url, 'master'))) {
    await repo.fetch(remote.name);
    await repo.reset(`${remote.name}/master`, { hard: true });
    await repo.clean({ force: true });
  }

  // Build the project in RELEASE mode which
  // generates optimized and minimized bundles
  process.argv.push('--release');
  await run(require('./build'));

  // Push the contents of the build folder to the remote server via Git
  await repo.add('--all .');
  await repo.commit('Update');
  await repo.push(remote.name, 'master');

  // Check if the site was successfully deployed
  const response = await fetch(remote.website);
  console.log(`${remote.website} -> ${response.statusCode}`);
}

export default deploy;
