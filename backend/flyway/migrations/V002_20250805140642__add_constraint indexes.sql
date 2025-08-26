-- Add foreign key constraints to Books table
ALTER TABLE books 
ADD CONSTRAINT fk_books_publisher 
FOREIGN KEY (publisherId) REFERENCES publishers(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add foreign key constraints to BookAuthors table
ALTER TABLE book_authors 
ADD CONSTRAINT fk_book_authors_book 
FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE book_authors 
ADD CONSTRAINT fk_book_authors_author 
FOREIGN KEY (authorId) REFERENCES authors(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints to BookGenres table
ALTER TABLE book_genres 
ADD CONSTRAINT fk_book_genres_book 
FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE book_genres 
ADD CONSTRAINT fk_book_genres_genre 
FOREIGN KEY (genreId) REFERENCES genres(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints to Checkouts table
ALTER TABLE checkouts 
ADD CONSTRAINT fk_checkouts_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE checkouts 
ADD CONSTRAINT fk_checkouts_book 
FOREIGN KEY (copyId) REFERENCES books_copies(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints to Reviews table
ALTER TABLE reviews 
ADD CONSTRAINT fk_reviews_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reviews 
ADD CONSTRAINT fk_reviews_book 
FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints to StaffLogs table
ALTER TABLE staff_logs 
ADD CONSTRAINT fk_staff_logs_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE staff_logs 
ADD CONSTRAINT fk_staff_logs_book 
FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add unique constraints for relation tables
ALTER TABLE book_authors 
ADD CONSTRAINT unique_book_author UNIQUE (bookId, authorId);

ALTER TABLE book_genres 
ADD CONSTRAINT unique_book_genre UNIQUE (bookId, genreId);

ALTER TABLE books_copies
ADD CONSTRAINT unique_book_copy UNIQUE (id, bookId);

-- Add other unique constraints
ALTER TABLE users 
ADD CONSTRAINT unique_username UNIQUE (userName);

ALTER TABLE users 
ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE genres 
ADD CONSTRAINT unique_genre_name UNIQUE (name);