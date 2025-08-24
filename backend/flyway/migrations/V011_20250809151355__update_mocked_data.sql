-- Fix pageCount = 0 -> set to > 100
UPDATE books
SET pageCount = 120
WHERE pageCount = 0;

-- Fill empty ISBNs with unique 13-digit numbers derived from the book UUID
-- Format: 979 + 10 digits (numeric) derived from the UUID to ensure uniqueness
UPDATE books
SET isbn = CONCAT(
  '979',
  RIGHT(LPAD(CONV(SUBSTRING(REPLACE(id, '-', ''), 1, 16), 16, 10), 10, '0'), 10)
)
WHERE isbn IS NULL OR TRIM(isbn) = '';

-- Fill empty descriptions based on title
UPDATE books
SET description = CONCAT('An engaging read: ', title, '. Placeholder description for development data.')
WHERE description IS NULL OR TRIM(description) = '';

-- Update book quantity and available copies
update books b
set quantity = 
(select count(*) 
from books_copies bc
where bc.bookId = b.id);

update books b
set availableCopies = 
(select count(*) 
from books_copies bc
where bc.bookId = b.id
and bc.isBorrowed = false);

-- Add avgRating column
ALTER TABLE books
ADD avgRating DECIMAL(2, 1);

DROP PROCEDURE IF EXISTS CalculateAvgRating;
DELIMITER //

CREATE PROCEDURE CalculateAvgRating()
BEGIN
  UPDATE books bo
  SET avgRating = COALESCE(
    (SELECT AVG(r.rating)
     FROM reviews r
     WHERE r.bookId = bo.id), 
    0
  );
END //

DELIMITER ;

SET SQL_SAFE_UPDATES = 0;
call CalculateAvgRating();