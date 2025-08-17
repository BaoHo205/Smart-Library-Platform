-- # Procedures

DROP PROCEDURE IF EXISTS BorrowBook;
DROP PROCEDURE IF EXISTS ReturnBook;

-- Create stored procedure for borrowing a book
DELIMITER //

CREATE PROCEDURE BorrowBook(
    IN p_userId VARCHAR(36),
    IN p_bookId VARCHAR(36),
    IN p_dueDate DATE,
    OUT p_checkoutId VARCHAR(36),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
proc: BEGIN
    DECLARE v_available_copies INT DEFAULT 0;
    DECLARE v_book_status VARCHAR(20);
    DECLARE v_user_exists INT DEFAULT 0;
    DECLARE v_active_checkout_count INT DEFAULT 0;
    DECLARE v_is_available BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Database error occurred while processing checkout';
        SET p_checkoutId = NULL;
    END;

    -- Start transaction
    START TRANSACTION;

    -- Check if user exists
    SELECT COUNT(*) INTO v_user_exists
    FROM users 
    WHERE id = p_userId;
    
    IF v_user_exists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'User not found';
        SET p_checkoutId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;

    -- Check if user already has this book checked out
    SELECT COUNT(*) INTO v_active_checkout_count
    FROM checkouts 
    WHERE userId = p_userId AND bookId = p_bookId AND isReturned = FALSE;
    
    IF v_active_checkout_count > 0 THEN
        SET p_success = FALSE;
        SET p_message = 'User already has this book checked out';
        SET p_checkoutId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;

    -- Check availability
    SET v_is_available = IsBookAvailable(p_bookId);
    
    IF NOT v_is_available THEN
        SET p_success = FALSE;
        SET p_message = 'Book not found or no copies available for checkout';
        SET p_checkoutId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;

    -- Lock the book record for update to prevent race conditions
    SELECT availableCopies, status INTO v_available_copies, v_book_status
    FROM books 
    WHERE id = p_bookId 
    FOR UPDATE;

    -- Check if book exists and is available
    IF v_available_copies IS NULL THEN
        SET p_success = FALSE;
        SET p_message = 'Book not found';
        SET p_checkoutId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;

    IF v_book_status != 'available' THEN
        SET p_success = FALSE;
        SET p_message = 'Book is not available for checkout';
        SET p_checkoutId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;

    IF v_available_copies <= 0 THEN
        SET p_success = FALSE;
        SET p_message = 'No copies available for checkout';
        SET p_checkoutId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;

    -- Generate checkout ID
    SET p_checkoutId = UUID();

    -- Create checkout record
    INSERT INTO checkouts (
        id, userId, bookId, checkoutDate, dueDate, isReturned, isLate
    ) VALUES (
        p_checkoutId, p_userId, p_bookId, CURDATE(), p_dueDate, FALSE, FALSE
    );

    -- Set success values
    SET p_success = TRUE;
    SET p_message = 'Book borrowed successfully';
    
    COMMIT;
END//

DELIMITER ;

-- Create stored procedure for returning a book with concurrency control
DELIMITER //

CREATE PROCEDURE ReturnBook(
    IN p_userId VARCHAR(36),
    IN p_bookId VARCHAR(36),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500),
    OUT p_isLate BOOLEAN
)
proc: BEGIN
    DECLARE v_checkoutId VARCHAR(36);
    DECLARE v_dueDate DATE;
    DECLARE v_currentDate DATE;
    DECLARE v_checkoutExists INT DEFAULT 0;
    DECLARE v_isLate BOOLEAN DEFAULT FALSE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Error occurred while returning book';
        SET p_isLate = FALSE;
    END;

    SET v_currentDate = CURDATE();
    
    START TRANSACTION;
    
    -- First check if checkout exists
    SELECT COUNT(*) INTO v_checkoutExists
    FROM checkouts 
    WHERE userId = p_userId AND bookId = p_bookId AND isReturned = FALSE;
    
    IF v_checkoutExists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'No active checkout found for this book';
        SET p_isLate = FALSE;
        ROLLBACK;
        LEAVE proc;
    END IF;
    
    -- Get the checkout details with FOR UPDATE lock
    SELECT id, dueDate INTO v_checkoutId, v_dueDate
    FROM checkouts 
    WHERE userId = p_userId AND bookId = p_bookId AND isReturned = FALSE
    ORDER BY checkoutDate DESC
    LIMIT 1
    FOR UPDATE;
    
    -- Check if return is late
    SET p_isLate = NOT IsReturnOnTime(v_dueDate, v_currentDate);
    
    -- Update checkout record (already locked)
    UPDATE checkouts 
    SET returnDate = v_currentDate, 
        isReturned = TRUE, 
        isLate = p_isLate
    WHERE id = v_checkoutId;
    
    -- Verify the update succeeded
    IF ROW_COUNT() = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Failed to update checkout record';
        SET p_isLate = FALSE;
        ROLLBACK;
        LEAVE proc;
    END IF;
    
    SET p_success = TRUE;
    IF p_isLate THEN
        SET p_message = 'Book returned successfully (late return)';
    ELSE
        SET p_message = 'Book returned successfully';
    END IF;
    
    COMMIT;
END //

DELIMITER ;