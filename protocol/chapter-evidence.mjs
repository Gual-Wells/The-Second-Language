// Private publication evidence. Public source packages carry only its digest.
export const CHAPTER_EVIDENCE_POLICY = 'chapter-evidence-v1';
export const MAX_EVIDENCE_OBJECT_BYTES = 24 * 1024 * 1024;
const sha = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const id = value => typeof value === 'string' && /^[A-Za-z0-9._:-]{1,100}$/.test(value);
export function validateEvidenceManifest(value, expected = {}) {
  if (!value || value.schemaVersion !== 1 || value.kind !== CHAPTER_EVIDENCE_POLICY ||
      !/^20\d{2}-\d{2}-\d{2}$/.test(value.studyDate || '') || !Number.isFinite(Date.parse(value.studyDate)) || new Date(value.studyDate).toISOString().slice(0,10)!==value.studyDate || !id(value.runId) ||
      !sha(value.chapterDigest) || !sha(value.selectionDigest) ||
      !/^[a-f0-9]{40}$/.test(value.vixInputCommit || '') || value.authoringPolicy !== 'authentic-context-v1' ||
      !Number.isSafeInteger(value.wordCount) || value.wordCount < 1 || value.wordCount > 200 ||
      !Number.isSafeInteger(value.sourceCount) || value.sourceCount < 1 ||
      !Array.isArray(value.groups) || !value.groups.length || value.groups.length > 512) throw Error('章节私有证据清单无效');
  for (const key of ['studyDate', 'runId', 'chapterDigest', 'selectionDigest', 'vixInputCommit']) {
    if (expected[key] != null && value[key] !== expected[key]) throw Error('章节私有证据与固定' + key + '不一致');
  }
  const seen = new Set();
  for (const group of value.groups) {
    if (!group || !sha(group.digest) || seen.has(group.digest) || !Number.isSafeInteger(group.bytes) ||
        group.bytes < 1 || group.bytes > MAX_EVIDENCE_OBJECT_BYTES) throw Error('章节私有证据分包无效或重复');
    seen.add(group.digest);
  }
  return value;
}
export function validateEvidenceGroup(value) {
  if (!value || value.schemaVersion !== 1 || value.kind !== 'chapter-evidence-group-v1' ||
      !Array.isArray(value.records) || !value.records.length ||
      value.records.some(record => !record || !['control', 'word', 'source', 'text', 'html'].includes(record.kind))) throw Error('章节私有证据对象无效');
  return value;
}
