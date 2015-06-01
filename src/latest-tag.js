import { exec } from 'child-process-promise';
import semver from 'semver';

export function lastSemverTag(tags, excludePreRelease) {
  let versions = tags
    .filter(tag => semver.valid(tag))
    .map(tag => {
      return {
        tag,
        semver: semver.parse(tag),
        toString() {
          return tag;
        }
      };
    })
    .filter(tag => {
      if (tag.semver.prerelease.length === 0) {
        return true;
      }

      return !excludePreRelease;
    })
    .sort((t1, t2) => semver.compare(t1.semver, t2.semver));

  if (versions.length === 0) {
    throw 'No previous semver tag found, tag a commit in the past and try again';
  }

  return versions[versions.length - 1].toString();
}

export default function latestTag(excludePreRelease = false) {
  return exec('git tag')
    .then(({ stdout }) => lastSemverTag(stdout.split('\n'), excludePreRelease));
}
