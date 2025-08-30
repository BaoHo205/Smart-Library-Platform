-- # Add Triggers

DROP TRIGGER IF EXISTS after_checkout_insert;
DROP TRIGGER IF EXISTS after_checkout_update;
DROP TRIGGER IF EXISTS after_review_insert;
DROP TRIGGER IF EXISTS book_copy_delete;
DROP TRIGGER IF EXISTS book_copy_insert;

-- Trigger to automatically update book availability when a book is borrowed
DELIMITER //

CREATE TRIGGER after_checkout_insert
AFTER INSERT ON checkouts
FOR EACH ROW
BEGIN
    -- Update available copies when a book is borrowed
    IF NEW.isReturned = FALSE THEN
        UPDATE books 
        SET availableCopies = availableCopies - 1
        WHERE id = NEW.copyId AND availableCopies > 0;
    END IF;
END//

DELIMITER ;

-- Trigger to automatically update book availability when a book is returned
DELIMITER //

CREATE TRIGGER after_checkout_update
AFTER UPDATE ON checkouts
FOR EACH ROW
BEGIN
    -- If the book was just returned (isReturned changed from FALSE to TRUE)
    IF OLD.isReturned = FALSE AND NEW.isReturned = TRUE THEN
        UPDATE books 
        SET availableCopies = availableCopies + 1
        WHERE id = NEW.copyId;
    END IF;
    
    -- If the book was un-returned (isReturned changed from TRUE to FALSE)
    IF OLD.isReturned = TRUE AND NEW.isReturned = FALSE THEN
        UPDATE books 
        SET availableCopies = availableCopies - 1
        WHERE id = NEW.copyId AND availableCopies > 0;
    END IF;
END//

DELIMITER ;

-- Trigger to automatically update book rating when a review is inserted
DELIMITER //

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE books b
	SET avgRating = COALESCE(
		(SELECT AVG(r.rating)
		FROM reviews r
        JOIN books_copies bc 
        ON r.copyId = bc.id
		WHERE bc.bookId = NEW.bookId), 
	0
    ) WHERE b.id = NEW.bookId;

END//

DELIMITER ;

DELIMITER $$

-- This trigger automatically decrements the quantity and availableCopies
-- in the books table whenever a book copy is deleted from books_copies.
CREATE TRIGGER book_copy_delete
BEFORE DELETE ON books_copies
FOR EACH ROW
BEGIN
    -- We decrement both the quantity and availableCopies counts.
    -- The WHERE clause uses OLD.bookId to identify the correct book.
    UPDATE books
    SET
        quantity = quantity - 1,
        availableCopies = availableCopies - 1
    WHERE id = OLD.bookId;
END$$

DELIMITER ;


DELIMITER $$

-- This trigger automatically increments the quantity and availableCopies
-- in the books table whenever a new book copy is added to books_copies.
CREATE TRIGGER book_copy_insert
BEFORE INSERT ON books_copies
FOR EACH ROW
BEGIN
    -- We increment both the quantity and availableCopies counts.
    -- The WHERE clause uses NEW.bookId to identify the correct book.
    UPDATE books
    SET
        quantity = quantity + 1,
        availableCopies = availableCopies + 1
    WHERE id = NEW.bookId;
END$$

DELIMITER ;