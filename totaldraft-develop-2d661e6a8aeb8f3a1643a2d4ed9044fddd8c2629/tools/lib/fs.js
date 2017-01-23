import fs from 'fs';
import mkdirp from 'mkdirp';
import globPkg from 'glob';

const readFile = (file) => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, content) => (err ? reject(err) : resolve(content)));
});

const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()));
});

const makeDir = (name) => new Promise((resolve, reject) => {
  mkdirp(name, err => (err ? reject(err) : resolve()));
});

const glob = (pattern) => new Promise((resolve, reject) => {
  globPkg(pattern, (err, val) => (err ? reject(err) : resolve(val)));
});

export default { readFile, writeFile, makeDir, glob };
