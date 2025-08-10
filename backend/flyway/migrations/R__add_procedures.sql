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
    COMMIT;
END//

DELIMITER $$
CREATE PROCEDURE AddNewBook(
    IN p_id VARCHAR(36),
    IN p_title VARCHAR(500),
    IN p_thumbnailUrl TEXT,
    IN p_isbn VARCHAR(20),
    IN p_quantity INT,
    IN p_availableCopies INT,
    IN p_pageCount INT,
    IN p_publisherId VARCHAR(36),
    IN p_description TEXT,
    IN p_status ENUM('available', 'unavailable'),
    IN p_authorIds TEXT
)
BEGIN
    DECLARE v_author_id VARCHAR(36);
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_len INT DEFAULT 0;

    -- Error handler to rollback transaction on SQL errors
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred during book insertion';
    END;

    -- Start a transaction to ensure both book and author links are created atomically.
    START TRANSACTION;
    
    -- Validate required inputs
    IF p_id IS NULL OR p_title IS NULL OR p_authorIds IS NULL OR p_authorIds = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Required fields (id, title, author_ids) cannot be null or empty';
    END IF;

    INSERT INTO Book (
        id,
        title,
        thumbnailUrl,
        isbn,
        quantity,
        availableCopies,
        pageCount,
        publisherId,
        description,
        status
    ) VALUES (
        p_id,
        p_title,
        p_thumbnailUrl,
        p_isbn,
        p_quantity,
        p_availableCopies,
        p_pageCount,
        p_publisherId,
        p_description,
        p_status
    );

    -- Append trailing comma to ensure last author ID is processed
    SET p_authorIds = CONCAT(p_authorIds, ',');

    -- Loop through the comma-separated list of author IDs
    SET v_len = LOCATE(',', p_authorIds, v_pos);
    WHILE v_len > 0 DO
        SET v_authorId = TRIM(SUBSTRING(p_authorIds, v_pos, v_len - v_pos));
        
        -- Check if the author ID is not empty
        IF v_authorId <> '' THEN
            -- Insert a record into the join table
            INSERT INTO Book_Authors (bookId, authorId)
            VALUES (p_id, v_authorId);
        END IF;

        SET v_pos = v_len + 1;
        SET v_len = LOCATE(',', p_authorIds, v_pos); -- Move to the next comma
    END WHILE;

    -- Commit the transaction if all operations were successful
    COMMIT;
END $$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UpdateBookInventory(
    IN p_bookId VARCHAR(36),
    IN p_newQuantity INT
)
BEGIN
    DECLARE v_currentQuantity INT;
    DECLARE v_quantityDiff INT;

    -- Error handler to rollback transaction on SQL errors
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred while updating book inventory';
    END;

    -- Start a transaction
    START TRANSACTION;

    -- Validate input
    IF p_bookId IS NULL OR p_newQuantity < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book ID cannot be null and new quantity cannot be negative';
    END IF;

    -- Lock the row and get the current quantity to ensure consistency.
    SELECT quantity INTO v_currentQuantity
    FROM Books
    WHERE id = p_bookId FOR UPDATE;

    -- Check if the book was found
    IF v_quantityDiff IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book not found';
    END IF;

    -- Calculate the difference between the new and current quantity
    SET v_quantityDiff = p_newQuantity - v_currentQuantity;

    -- Update both quantity and availableCopies
    UPDATE Books
    SET 
        quantity = p_newQuantity,
        availableCopies = availableCopies + v_quantity_diff,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_bookId;

    COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE RetireBook(
    IN p_bookId VARCHAR(36)
)
BEGIN
    -- Error handler to rollback transaction on SQL errors
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred while retiring the book';
    END;

    -- Start a transaction
    START TRANSACTION;

    -- Validate input
    IF p_bookId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book ID cannot be null';
    END IF;

    -- Update the book's status to 'unavailable'
    UPDATE Book
    SET
        status = 'unavailable',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_bookId;

    -- Check if a row was affected
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book not found';
    END IF;
    
    COMMIT;
END$$

DELIMITER ;