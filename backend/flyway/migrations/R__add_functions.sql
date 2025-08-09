-- # Functions
DROP FUNCTION IF EXISTS IsBookAvailable;

-- Create function to check if a book is available
DELIMITER //

CREATE FUNCTION IsBookAvailable(bookId VARCHAR(36))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE available_count INT;
    
    SELECT availableCopies INTO available_count
    FROM books 
    WHERE id = bookId AND status = 'available';
    
    RETURN COALESCE(available_count, 0) > 0;
END//

DELIMITER ;