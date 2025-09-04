-- # Add Triggers

DROP TRIGGER IF EXISTS after_book_copy_insert;
DROP TRIGGER IF EXISTS after_book_copy_update;
DROP TRIGGER IF EXISTS after_book_copy_delete;
DROP TRIGGER IF EXISTS after_checkout_insert;
DROP TRIGGER IF EXISTS after_checkout_update;
DROP TRIGGER IF EXISTS after_review_insert;
DROP TRIGGER IF EXISTS book_copy_delete;
DROP TRIGGER IF EXISTS book_copy_insert;

-- Trigger to automatically update availableCopies when book copies are inserted
DELIMITER //

CREATE TRIGGER after_book_copy_insert
AFTER INSERT ON book_copies
FOR EACH ROW
BEGIN
    -- Update available copies count when a new copy is added
    UPDATE books 
    SET availableCopies = (
        SELECT COUNT(*) 
        FROM book_copies 
        WHERE bookId = NEW.bookId AND isBorrowed = FALSE
    )
    WHERE id = NEW.bookId;
END//

DELIMITER ;

-- Trigger to automatically update availableCopies when book copies are updated
DELIMITER //

CREATE TRIGGER after_book_copy_update
AFTER UPDATE ON book_copies
FOR EACH ROW
BEGIN
    -- Only update if isBorrowed status changed
    IF OLD.isBorrowed != NEW.isBorrowed THEN
        UPDATE books 
        SET availableCopies = (
            SELECT COUNT(*) 
            FROM book_copies 
            WHERE bookId = NEW.bookId AND isBorrowed = FALSE
        )
        WHERE id = NEW.bookId;
    END IF;
END//

DELIMITER ;

-- Trigger to automatically update availableCopies when book copies are deleted
DELIMITER //

CREATE TRIGGER after_book_copy_delete
AFTER DELETE ON book_copies
FOR EACH ROW
BEGIN
    -- Update available copies count when a copy is deleted
    UPDATE books 
    SET availableCopies = (
        SELECT COUNT(*) 
        FROM book_copies 
        WHERE bookId = OLD.bookId AND isBorrowed = FALSE
    ),
    quantity = (
        SELECT COUNT(*) 
        FROM book_copies 
        WHERE bookId = OLD.bookId
    )
    WHERE id = OLD.bookId;
END//

DELIMITER ;

-- Trigger to automatically update book copy status when a book is borrowed
DELIMITER //

CREATE TRIGGER after_checkout_insert
AFTER INSERT ON checkouts
FOR EACH ROW
BEGIN
    -- Mark the copy as borrowed when a book is checked out
    IF NEW.isReturned = FALSE THEN
        UPDATE book_copies
        SET isBorrowed = TRUE, updatedAt = CURRENT_TIMESTAMP
        WHERE id = NEW.copyId;
    END IF;
END//

DELIMITER ;

-- Trigger to automatically update book copy status when a book is returned
DELIMITER //

CREATE TRIGGER after_checkout_update
AFTER UPDATE ON checkouts
FOR EACH ROW
BEGIN
    -- If the book was just returned (isReturned changed from FALSE to TRUE)
    IF OLD.isReturned = FALSE AND NEW.isReturned = TRUE THEN
        -- Mark the copy as not borrowed
        UPDATE book_copies
        SET isBorrowed = FALSE, updatedAt = CURRENT_TIMESTAMP
        WHERE id = NEW.copyId;
    END IF;
    
    -- If the book was un-returned (isReturned changed from TRUE to FALSE)
    IF OLD.isReturned = TRUE AND NEW.isReturned = FALSE THEN
        -- Mark the copy as borrowed again
        UPDATE book_copies
        SET isBorrowed = TRUE, updatedAt = CURRENT_TIMESTAMP
        WHERE id = NEW.copyId;
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
        WHERE r.bookId = NEW.bookId), 
    0
    ) WHERE b.id = NEW.bookId;
END//

DELIMITER ;

DELIMITER $$

-- This trigger automatically decrements the quantity and availableCopies
-- in the books table whenever a book copy is deleted from book_copies.
CREATE TRIGGER book_copy_delete
BEFORE DELETE ON book_copies
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
-- in the books table whenever a new book copy is added to book_copies.
CREATE TRIGGER book_copy_insert
BEFORE INSERT ON book_copies
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