export default {
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/physics/**/*.js',
    '!lib/physics/arcade/events/**',
    '!lib/physics/arcade/tilemap/**',
    '!**/typedefs/**'
  ],
  maxConcurrency: 1
}
