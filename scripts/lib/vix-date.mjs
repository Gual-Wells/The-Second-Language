// VIX labels preserve the real Beijing study date; YY denotes 2000–2099.
export function vixDateLabel(studyDate) {
  if (typeof studyDate !== 'string' || !/^20\d{2}-\d{2}-\d{2}$/.test(studyDate)) throw new Error('课程日期必须为 2000–2099 年的 YYYY-MM-DD');
  const date = new Date(`${studyDate}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== studyDate) throw new Error('课程日期不是有效的真实日历日期');
  return studyDate.slice(2);
}

export function validateVixDate(selection) {
  const label = vixDateLabel(selection.studyDate);
  if (selection.vixMarkLabel !== label) throw new Error('VIX YY-MM-DD 标签必须与课程真实日期一致');
  return label;
}
