-- Books
CREATE INDEX idx_books_title ON books (title);
CREATE INDEX idx_books_isbn ON books (isbn);

-- Publishers / Authors / Genres
CREATE INDEX idx_publishers_name ON publishers (name);
CREATE INDEX idx_authors_name ON authors (lastName, firstName);
CREATE INDEX idx_genres_name ON genres (name);

-- Junctions
CREATE INDEX idx_book_authors_book ON book_authors (bookId);
CREATE INDEX idx_book_authors_author ON book_authors (authorId);
CREATE UNIQUE INDEX uq_book_author ON book_authors (bookId, authorId);

CREATE INDEX idx_book_genres_book ON book_genres (bookId);
CREATE INDEX idx_book_genres_genre ON book_genres (genreId);
CREATE UNIQUE INDEX uq_book_genre ON book_genres (bookId, genreId);

-- Checkouts (to compute availability quickly)
CREATE INDEX idx_checkouts_active ON checkouts (bookId, isReturned, returnDate);