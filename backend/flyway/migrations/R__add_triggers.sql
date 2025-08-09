-- # Add Triggers

DROP TRIGGER IF EXISTS after_checkout_insert;
DROP TRIGGER IF EXISTS after_checkout_update;

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
        WHERE id = NEW.bookId AND availableCopies > 0;
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
        WHERE id = NEW.bookId;
    END IF;
    
    -- If the book was un-returned (isReturned changed from TRUE to FALSE)
    IF OLD.isReturned = TRUE AND NEW.isReturned = FALSE THEN
        UPDATE books 
        SET availableCopies = availableCopies - 1
        WHERE id = NEW.bookId AND availableCopies > 0;
    END IF;
END//

DELIMITER ;