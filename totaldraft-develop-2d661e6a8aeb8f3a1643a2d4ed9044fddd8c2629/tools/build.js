import run from './run';
import clean from './clean';
import extractMessages from './extractMessages';
import copy from './copy';
import bundle from './bundle';
import render from './render';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build() {
  await run(clean);
  await run(extractMessages);
  await run(copy);
  await run(bundle);

  if (process.argv.includes('--static')) {
    await run(render);
  }
}

export default build;
