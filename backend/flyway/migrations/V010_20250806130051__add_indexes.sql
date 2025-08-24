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
CREATE INDEX idx_checkouts_active ON checkouts (copyId, isReturned, returnDate);

 
-- REPORT 
-- For getMostBorrowedBooks - covering index
CREATE INDEX idx_checkouts_date_book_covering ON checkouts(
  checkoutDate, 
  copyId, 
  id
);

-- For getTopActiveReaders - covering index
CREATE INDEX idx_checkouts_date_user_covering ON checkouts(
  checkoutDate, 
  userId, 
  id
);

-- For getBooksWithLowAvailability
-- tui nho la mysql k support where clause trong create index
-- CREATE INDEX idx_books_low_availability ON books(
--   availableCopies, 
--   quantity, 
--   id, 
--   title
-- ) WHERE availableCopies <= quantity * 0.2 OR availableCopies = 0;

-- k co where clause nhe
CREATE INDEX idx_books_low_availability ON books(availableCopies, quantity, id, title);