-- # Functions
DROP FUNCTION IF EXISTS IsBookAvailable;
DROP FUNCTION IF EXISTS IsReturnOnTime;

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
    WHERE id = bookId;
    
    RETURN COALESCE(available_count, 0) > 0;
END//

DELIMITER ;

-- Create function to check if a book return is on time
DELIMITER //

CREATE FUNCTION IsReturnOnTime(
    p_dueDate DATE,
    p_returnDate DATE
)
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    -- If return date is null, use current date
    DECLARE v_returnDate DATE;
    
    SET v_returnDate = COALESCE(p_returnDate, CURDATE());
    
    -- Return true if return date is on or before due date
    RETURN v_returnDate <= p_dueDate;
END//

DELIMITER ;