/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main', 'master'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'patch', release: 'patch' },
        ],
      },
    ],
    '@semantic-release/github',
  ],
};
