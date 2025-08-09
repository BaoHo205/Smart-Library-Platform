-- # Procedures

DROP PROCEDURE IF EXISTS BorrowBook;

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