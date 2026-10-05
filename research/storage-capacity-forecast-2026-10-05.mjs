// Research model only. Does not contact providers or modify production data.
// Decimal MB/GB; input values are planning assumptions unless marked measured.
import { writeFile } from 'node:fs/promises';

const bytesPerSecond = kbps => kbps * 1000 / 8;
const mb = bytes => bytes / 1e6;
const round = value => Number(value.toFixed(3));
const audioMB = (minutes, kbps) => mb(minutes * 60 * bytesPerSecond(kbps));
const wavMB = minutes => mb(minutes * 60 * 16000 * 2);
const course = (name, roots, examples, exampleSeconds, storySentences, storySeconds,
  wordFamilySeconds, kbps, retainedRevisionFraction, otherGB) => {
  const seconds = roots * (examples * exampleSeconds + storySentences * storySeconds + wordFamilySeconds);
  const audioGB = seconds * bytesPerSecond(kbps) / 1e9;
  return { name, roots, examplesPerRoot: examples, exampleSeconds,
    uniqueStorySentencesPerRoot: storySentences, storySeconds, wordFamilySeconds, kbps,
    audioGB: round(audioGB), retainedRevisionFraction, otherGB,
    totalGB: round(audioGB * (1 + retainedRevisionFraction) + otherGB),
    audioAssets: roots * (examples + storySentences + 2) };
};

const setsPerWeek = 1.5;
const attemptsPerSet = 1.5;
const setsPerYear = setsPerWeek * 52;
const questionMB = [
  audioMB(30, 128) + audioMB(20, 64) + audioMB(3, 64) + 1,
  audioMB(30, 128) + audioMB(26, 64) + audioMB(5, 64) + 3
];
const answerMB = [
  audioMB(7, 64) + wavMB(7) + 2,
  audioMB(10, 192) + wavMB(10) + 8
];
const fullSetMB = questionMB.map((q, i) => q + attemptsPerSet * answerMB[i]);
const retainedVariationFactor = 1.20;
const annualGB = fullSetMB.map(value => value * setsPerYear * retainedVariationFactor / 1000);
const normalCourseGB = [15, 35];
const normalAnnualGB = [7, 11]; // Round the component calculation outward.
const stressCourseGB = 80;
const stressAnnualGB = 15;
const capacityReserveFactor = 1.20; // Empty operating space; not stored bytes.
const horizons = [1, 3, 5, 10].map(years => {
  const normalGB = normalCourseGB.map((c, i) => c + years * normalAnnualGB[i]);
  const stressGB = stressCourseGB + years * stressAnnualGB;
  return { yearsOfIELTS: years, normalUniqueGB: normalGB,
    normalProvisionedGB: normalGB.map(n => round(n * capacityReserveFactor)),
    stressUniqueGB: stressGB, stressProvisionedGB: round(stressGB * capacityReserveFactor) };
});
const model = {
  date: '2026-10-05', status: 'research-not-production', units: 'decimal MB and GB',
  userInputs: { setsPerWeek, attemptsPerSet, setsPerYear, answerCyclesPerYear: setsPerYear * attemptsPerSet,
    preferredRecurringStorageFeeCny: 0 },
  measuredExistingKokoro: { files: 220, bytes: 4780206, seconds: 731.95,
    weightedKbps: round(4780206 * 8 / 731.95 / 1000), medianEffectiveKbps: 53.028571 },
  sourceTextbookBytes: 33454522,
  courseSensitivity: [
    course('lighter', 15000, 6, 8, 1.5, 9, 3, 64, 0.20, 0.5),
    course('central', 16000, 12, 9, 3, 10, 4.5, 64, 0.25, 1),
    course('dense', 16000, 18, 9, 4, 10, 6, 64, 0.25, 1.5),
    course('stress', 16000, 24, 10, 5, 11, 6, 80, 0.30, 3)
  ],
  fullIELTS: { questionAudioAndDocumentsMB: questionMB.map(round),
    oneAnswerCycleMB: answerMB.map(round), attemptsPerSet,
    fullSetBeforeVariationMB: fullSetMB.map(round), retainedVariationFactor,
    fullSetWithVariationMB: fullSetMB.map(n => round(n * retainedVariationFactor)),
    calculatedAnnualGB: annualGB.map(round), planningAnnualGB: normalAnnualGB,
    stressPlanningAnnualGB: stressAnnualGB },
  capacityReserveFactor, normalCourseGB, stressCourseGB, horizons,
  indexSensitivity: [200000, 400000].map(assets => ({assets,
    at2000BytesPerAssetGB: assets * 2000 / 1e9, at4000BytesPerAssetGB: assets * 4000 / 1e9})),
  rules: [
    'All full IELTS sets for planning; mini sets reduce question-side bytes.',
    'A repeated answer reuses questions and question audio, but preserves new original audio and evidence.',
    'Original compressed recording and actual analysis WAV are both counted.',
    'Archived request descriptors do not contain another full base64 copy for each model.',
    'Shared story sentences count once; audio reuse is keyed by the actual synthesis descriptor.',
    'Temporary pages expire; exclusive temporary assets are not accumulated as permanent lessons.',
    'Derived identical scratch copies are not independent assets; distinct retained versions are counted.',
    'Reserve is free operating space; backup and cache copies require separate physical capacity.',
    'No finite free quota is an infinite retention guarantee.',
    'No complete formal IELTS set or complete dictionary curriculum has been measured yet.'
  ]
};
await writeFile(new URL('./storage-capacity-forecast-2026-10-05.json', import.meta.url),
  JSON.stringify(model, null, 2) + '\n');
console.log(JSON.stringify({userInputs: model.userInputs, fullIELTS: model.fullIELTS,
  courseSensitivity: model.courseSensitivity, horizons}, null, 2));
