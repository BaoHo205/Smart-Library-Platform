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
CREATE INDEX idx_books_low_availability ON books(availableCopies, quantity, id, title);

-- For getMostBorrowedBooks & getTopActiveReaders - partitioning by month
ALTER TABLE `checkouts`
PARTITION BY RANGE ( UNIX_TIMESTAMP(checkoutDate) ) (
    PARTITION p2024_01 VALUES LESS THAN (UNIX_TIMESTAMP('2024-02-01')),
    PARTITION p2024_02 VALUES LESS THAN (UNIX_TIMESTAMP('2024-03-01')),
    PARTITION p2024_03 VALUES LESS THAN (UNIX_TIMESTAMP('2024-04-01')),
    PARTITION p2024_04 VALUES LESS THAN (UNIX_TIMESTAMP('2024-05-01')),
    PARTITION p2024_05 VALUES LESS THAN (UNIX_TIMESTAMP('2024-06-01')),
    PARTITION p2024_06 VALUES LESS THAN (UNIX_TIMESTAMP('2024-07-01')),
    PARTITION p2024_07 VALUES LESS THAN (UNIX_TIMESTAMP('2024-08-01')),
    PARTITION p2024_08 VALUES LESS THAN (UNIX_TIMESTAMP('2024-09-01')),
    PARTITION p2024_09 VALUES LESS THAN (UNIX_TIMESTAMP('2024-10-01')),
    PARTITION p2024_10 VALUES LESS THAN (UNIX_TIMESTAMP('2024-11-01')),
    PARTITION p2024_11 VALUES LESS THAN (UNIX_TIMESTAMP('2024-12-01')),
    PARTITION p2024_12 VALUES LESS THAN (UNIX_TIMESTAMP('2025-01-01')),
    PARTITION p_future VALUES LESS THAN (MAXVALUE)
);