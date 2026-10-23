// A chapter is one published date, regardless of how many revisions it has.
// Text revision metadata remains available as provenance; it is not a counter.
export const chapterNumber = ordinal => `第 ${ordinal} 章`;

export async function numberForDate(db,date) {
 const row=await db.prepare(`SELECT COUNT(*) AS n FROM published_chapters p
  JOIN chapter_sources s ON s.digest=p.digest AND s.policy='current-affairs-v1'
  WHERE p.study_date<?`).bind(date).first();
 return chapterNumber(Number(row.n)+1);
}
