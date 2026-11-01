-- Private review body remains in immutable content storage; D1 holds only binding.
CREATE TABLE chapter_publication_reviews (
  chapter_digest TEXT PRIMARY KEY REFERENCES chapter_revisions(digest),
  source_digest TEXT NOT NULL,
  review_digest TEXT NOT NULL,
  validation_digest TEXT NOT NULL,
  policy TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TRIGGER chapter_publication_reviews_no_update BEFORE UPDATE ON chapter_publication_reviews
BEGIN SELECT RAISE(ABORT,'publication review binding is immutable'); END;
CREATE TRIGGER chapter_publication_reviews_no_delete BEFORE DELETE ON chapter_publication_reviews
BEGIN SELECT RAISE(ABORT,'publication review binding is immutable'); END;
