-- # Procedures

DROP PROCEDURE IF EXISTS BorrowBook;
DROP PROCEDURE IF EXISTS ReturnBook;
DROP PROCEDURE IF EXISTS AddNewBook;
DROP PROCEDURE IF EXISTS UpdateBookInventory;
DROP PROCEDURE IF EXISTS RetireBook;
DROP PROCEDURE IF EXISTS RetireBookCopy;
DROP PROCEDURE IF EXISTS AddBookCopy;
DROP PROCEDURE IF EXISTS DeleteBookCopy;
DROP PROCEDURE IF EXISTS UpdateBook;
DROP PROCEDURE IF EXISTS ReviewBook;

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
    DECLARE v_book_retired VARCHAR(20);
    DECLARE v_user_exists INT DEFAULT 0;
    DECLARE v_active_checkout_count INT DEFAULT 0;
    DECLARE v_is_available BOOLEAN;
    DECLARE v_copyId VARCHAR(36) DEFAULT NULL;

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
    FROM checkouts c
    JOIN books_copies bc ON c.copyId = bc.id
    WHERE c.userId = p_userId AND bc.bookId = p_bookId AND c.isReturned = FALSE;
    
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
    SELECT availableCopies, isRetired INTO v_available_copies, v_book_retired
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

    IF v_book_retired = TRUE THEN
        SET p_success = FALSE;
        SET p_message = 'Book has been retired and cannot be borrowed';
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

    -- Find an available copy and lock it
    SELECT id INTO v_copyId
    FROM books_copies
    WHERE bookId = p_bookId AND isBorrowed = FALSE
    ORDER BY createdAt ASC
    LIMIT 1
    FOR UPDATE;

    IF v_copyId IS NULL THEN
        SET p_success = FALSE;
        SET p_message = 'No available copy found for checkout';
        SET p_checkoutId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;

    -- Generate checkout ID
    SET p_checkoutId = UUID();

    -- Create checkout record
    INSERT INTO checkouts (
        id, userId, copyId, checkoutDate, dueDate, isReturned, isLate
    ) VALUES (
        p_checkoutId, p_userId, v_copyId, CURDATE(), p_dueDate, FALSE, FALSE
    );

    -- Set success values
    SET p_success = TRUE;
    SET p_message = 'Book borrowed successfully';
    
    COMMIT;
END//

DELIMITER $$

CREATE PROCEDURE AddNewBook(
    IN p_title VARCHAR(500),
    IN p_thumbnailUrl TEXT,
    IN p_isbn VARCHAR(20),
    IN p_quantity INT,
    IN p_availableCopies INT,
    IN p_pageCount INT,
    IN p_publisherId VARCHAR(36),
    IN p_description TEXT,
    IN p_avgRating DECIMAL(2,1),
    IN p_authorIds TEXT,
    IN p_genreIds TEXT,
    IN p_staffId VARCHAR(36),
    OUT p_bookId VARCHAR(36)
)
BEGIN
    DECLARE v_authorId VARCHAR(36);
    DECLARE v_genreId VARCHAR(36);
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_len INT DEFAULT 0;
    DECLARE v_bookId VARCHAR(36); 
    DECLARE i INT;
    DECLARE v_copiesId VARCHAR(36);

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
    IF p_title IS NULL OR p_authorIds IS NULL OR p_authorIds = '' OR p_genreIds IS NULL OR p_genreIds = '' OR p_publisherId IS NULL OR p_publisherId = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Required fields (title, author_ids, p_genreIds, p_publisherId) cannot be null or empty';
    END IF;

    SET v_bookId = UUID();
    SET p_bookId = v_bookId;

    INSERT INTO books (
        id,
        title,
        thumbnailUrl,
        isbn,
        quantity,
        availableCopies,
        pageCount,
        publisherId,
        description,
        avgRating,
        createdAt,
        updatedAt
    ) VALUES (
        v_bookId,
        p_title,
        p_thumbnailUrl,
        p_isbn,
        0,
        0,
        p_pageCount,
        p_publisherId,
        p_description,
        p_avgRating,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
    
    -- Loop to create book copies based on p_quantity
    SET i = 1;
    WHILE i <= p_quantity DO
        SET v_copiesId = UUID();
        INSERT INTO books_copies (
            id,
            bookId,
            isBorrowed,
            createdAt,
            updatedAt
        ) VALUES (
            v_copiesId,
            v_bookId,
            0,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
        SET i = i + 1;
    END WHILE;

    -- Append trailing comma to ensure last author ID is processed
    SET p_authorIds = CONCAT(p_authorIds, ',');

    -- Loop through the comma-separated list of author IDs
    SET v_len = LOCATE(',', p_authorIds, v_pos);
    WHILE v_len > 0 DO
        SET v_authorId = TRIM(SUBSTRING(p_authorIds, v_pos, v_len - v_pos));
        
        -- Check if the author ID is not empty
        IF v_authorId <> '' THEN
            -- Insert a record into the join table
            INSERT INTO book_authors (bookId, authorId, createdAt, updatedAt)
            VALUES (v_bookId, v_authorId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        END IF;

        SET v_pos = v_len + 1;
        SET v_len = LOCATE(',', p_authorIds, v_pos); -- Move to the next comma
    END WHILE;

    -- Append trailing comma to ensure last genre ID is processed
    SET v_pos = 1;
    SET v_len = 0;
    SET p_genreIds = CONCAT(p_genreIds, ',');

    -- Loop through the comma-separated list of author IDs
    SET v_len = LOCATE(',', p_genreIds, v_pos);
    WHILE v_len > 0 DO
        SET v_genreId = TRIM(SUBSTRING(p_genreIds, v_pos, v_len - v_pos));
        
        -- Check if the author ID is not empty
        IF v_genreId <> '' THEN
            -- Insert a record into the join table
            INSERT INTO book_genres (bookId, genreId, createdAt, updatedAt)
            VALUES (v_bookId, v_genreId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        END IF;

        SET v_pos = v_len + 1;
        SET v_len = LOCATE(',', p_genreIds, v_pos); -- Move to the next comma
    END WHILE;

    -- Log the staff action
    CALL AddStaffLog(p_staffId, v_bookId, 'CREATE', CONCAT('Added new book: "', p_title, '" (ID: ', v_bookId, ')'));
    
    -- Commit the transaction if all operations were successful
    COMMIT;

END $$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UpdateBookInventory (
    IN p_bookId VARCHAR(36),
    IN p_newQuantity INT,
    IN p_staffId VARCHAR(36)
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
    FROM books
    WHERE id = p_bookId FOR UPDATE;

    -- Check if the book was found
    IF v_currentQuantity IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book not found';
    END IF;

    -- Calculate the difference between the new and current quantity
    SET v_quantityDiff = p_newQuantity - v_currentQuantity;

    -- Update both quantity and availableCopies
    UPDATE books
    SET 
        quantity = p_newQuantity,
        availableCopies = availableCopies + v_quantityDiff,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = p_bookId;

    -- Log the staff action
    CALL AddStaffLog(p_staffId, p_bookId, 'UPDATE', CONCAT('Updated inventory for book ID ', p_bookId, ' to ', p_newQuantity));

    COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE RetireBook(
    IN p_bookId VARCHAR(36),
    IN p_staffId VARCHAR(36)
)
BEGIN
    -- Declare a variable to hold the current retired status
    DECLARE currentIsRetired TINYINT;

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

    -- Check the current status of the book
    SELECT isRetired INTO currentIsRetired
    FROM books
    WHERE id = p_bookId FOR UPDATE;

    -- Check if the book was found
    IF currentIsRetired IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book not found';
    END IF;

    -- If the book is already retired, log the attempt and exit gracefully
    IF currentIsRetired = 1 THEN
        CALL AddStaffLog(p_staffId, p_bookId, 'UPDATE', CONCAT('Attempted to retire an already retired book: ', p_bookId));
    ELSE
        -- The book is not retired, so we can proceed with retiring it
        UPDATE books
        SET
            isRetired = 1,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = p_bookId;

        -- Also retire all book copies associated with this book
        UPDATE books_copies
        SET
            isBorrowed = 1, -- Set to 0 to indicate the copies are no longer borrowed
            updatedAt = CURRENT_TIMESTAMP
        WHERE bookId = p_bookId;

        -- Log the successful action
        CALL AddStaffLog(p_staffId, p_bookId, 'UPDATE', CONCAT('Book and all its copies with ID ', p_bookId, ' retired'));
    END IF;
    
    COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE AddBookCopy(
    IN p_bookId VARCHAR(36),
    IN p_staffId VARCHAR(36),
    OUT o_copyId VARCHAR(36)
)
BEGIN
    -- Declare a variable to hold the new UUID
    DECLARE newCopyId VARCHAR(36);

    -- Declare a handler for any SQL exceptions to roll back the transaction.
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred while adding the book copy. The transaction was rolled back.';
    END;

    -- Start a transaction to ensure the operation is atomic.
    START TRANSACTION;

    -- Check if the provided book ID is valid.
    IF NOT EXISTS (SELECT 1 FROM books WHERE id = p_bookId) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book not found. Cannot add a copy of a non-existent book.';
    END IF;
    
    -- Generate a new UUID for the book copy
    SET newCopyId = UUID();

    -- Insert a new record into the books_copies table.
    -- The newCopyId variable is used for the ID.
    INSERT INTO books_copies (id, bookId, isBorrowed, createdAt, updatedAt)
    VALUES (newCopyId, p_bookId, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    
    CALL AddStaffLog(p_staffId, p_bookId, 'CREATE', CONCAT('New book copy created with ID ', newCopyId));

    -- Set the OUT parameter to the newly created ID
    SET o_copyId = newCopyId;

    -- Commit the transaction if the insertion was successful.
    COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DeleteBookCopy(
    IN p_copyId VARCHAR(36),
    IN p_staffId VARCHAR(36)
)
BEGIN
    DECLARE v_bookId VARCHAR(36);
    DECLARE v_isBorrowed BOOLEAN;
    -- Error handler to rollback transaction on SQL errors
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred while deleting the book copy';
    END;

    -- Start a transaction
    START TRANSACTION;

    -- Validate input
    IF p_copyId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book copy ID cannot be null';
    END IF;

    -- Step 1: Check if the book copy exists and get its details.
    SELECT bookId, isBorrowed INTO v_bookId, v_isBorrowed
    FROM books_copies
    WHERE id = p_copyId FOR UPDATE;

    -- Step 2: Check if the book copy is currently borrowed.
    -- We are deliberately throwing a custom error if it is.
    IF v_isBorrowed THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete a book copy that is currently borrowed.';
    END IF;

    -- Step 3: Log the action before deletion.
    CALL AddStaffLog(p_staffId, v_bookId, 'DELETE', CONCAT('Attempted to delete book copy with ID ', p_copyId));

    -- Step 4: Delete the book copy from the books_copies table.
    DELETE FROM books_copies
    WHERE id = p_copyId;

    -- Step 5: If the deletion is successful, commit the transaction.
    COMMIT;
    
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE RetireBookCopy(
    IN p_copyId VARCHAR(36),
    IN p_staffId VARCHAR(36)
)
BEGIN
    -- Declare a variable to hold the current status
    DECLARE currentIsBorrowed TINYINT;
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
    IF p_copyId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book ID cannot be null';
    END IF;

    -- Check the current status of the book copy
    SELECT isBorrowed INTO currentIsBorrowed
    FROM books_copies
    WHERE id = p_copyId FOR UPDATE;

    -- Check if the book copy exists
    IF currentIsBorrowed IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Copy not found';
    END IF;

    -- Now, check if the book is already retired (isBorrowed = 0)
    IF currentIsBorrowed = 0 THEN
        -- If it's already retired, we don't need to do anything.
        -- We'll just log the attempt and exit successfully.
        CALL AddStaffLog(p_staffId, p_copyId, 'UPDATE', CONCAT('Attempted to retire an already retired copy: ', p_copyId));
    ELSE
        -- The book is currently borrowed (isBorrowed = 1), so we can proceed with retiring it.
        UPDATE books_copies
        SET
            isBorrowed = 0,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = p_copyId;
        
        -- Log the successful action
        CALL AddStaffLog(p_staffId, p_copyId, 'UPDATE', CONCAT('Copy ID ', p_copyId, ' retired'));
    END IF;

    COMMIT;
END$$

DELIMITER ;

DELIMITER $$
-- This procedure adds a log entry for staff actions, handling foreign key constraints.
CREATE PROCEDURE AddStaffLog(
    IN p_staffId VARCHAR(36),
    IN p_bookId VARCHAR(36),
    IN p_actionType VARCHAR(50),
    IN p_actionDetails TEXT
)
BEGIN
    -- Generate a unique ID for the new log entry
    DECLARE v_logId VARCHAR(36);

    -- This handler catches foreign key constraint errors and provides a specific message
    DECLARE EXIT HANDLER FOR 1452 -- MySQL error code for 'Cannot add or update a child row: a foreign key constraint fails'
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Foreign key constraint failed in Staff_Logs. Check if staffId or bookId are valid.';
    END;

    SET v_logId = UUID();
    -- Insert the new log entry into the Staff_Logs table with current timestamps
    INSERT INTO staff_logs (
        id,
        userId,
        bookId,
        actionType,
        actionDetails,
        createdAt,
        updatedAt
    ) VALUES (
        v_logId,
        p_staffId,
        p_bookId,
        p_actionType,
        p_actionDetails,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
END $$

DELIMITER ;

-- Create stored procedure for reviewing a book
DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `ReviewBook`(
    IN p_userId VARCHAR(36),
    IN p_bookId VARCHAR(36),
    IN p_rating INT,
    IN p_comment TEXT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500),
    OUT p_reviewId VARCHAR(36)
)
proc: BEGIN
    DECLARE v_user_exists INT DEFAULT 0;
    DECLARE v_book_exists INT DEFAULT 0;
    DECLARE v_has_borrowed INT DEFAULT 0;
    DECLARE v_existing_review INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'db error occurred while processing review';
        SET p_reviewId = NULL;
    END;
    
    START TRANSACTION;
    
    -- Check user exists
    SELECT COUNT(*) INTO v_user_exists
    FROM users 
    WHERE id = p_userId;
    
    IF v_user_exists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'User not found';
        SET p_reviewId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;
    
    -- Check book exists
    SELECT COUNT(*) INTO v_book_exists
    FROM books 
    WHERE id = p_bookId;
    
    IF v_book_exists = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Book not found';
        SET p_reviewId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;
    
    -- Check user has borrowed this book before
    SELECT COUNT(*) INTO v_has_borrowed
    FROM checkouts c
    JOIN books_copies bc
		ON c.copyId = bc.id
    WHERE c.userId = p_userId AND bc.bookId = p_bookId AND c.checkoutDate IS NOT NULL;
    
    IF v_has_borrowed = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'You can only review books you have borrowed';
        SET p_reviewId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;
    
    -- Check rating is within valid range
    IF p_rating < 1 OR p_rating > 5 THEN
        SET p_success = FALSE;
        SET p_message = 'Rating must be between 1 and 5';
        SET p_reviewId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;
    
    -- Check comment is valid
    IF LENGTH(p_comment) < 4 THEN
        SET p_success = FALSE;
        SET p_message = 'Comment must be more than 4 characters long';
        SET p_reviewId = NULL;
        ROLLBACK;
        LEAVE proc;
    END IF;
    
    -- Check user already reviewed this book
    SELECT COUNT(*) INTO v_existing_review
    FROM reviews
    WHERE userId = p_userId AND bookId = p_bookId;
    
    -- Insert or update review based on whether it already exists
    IF v_existing_review > 0 THEN
        SELECT id INTO p_reviewId
        FROM reviews
        WHERE userId = p_userId AND bookId = p_bookId;
        
        UPDATE reviews
        SET rating = p_rating,
            comment = p_comment,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = p_reviewId;
        
        IF ROW_COUNT() > 0 THEN
            SET p_success = TRUE;
            SET p_message = 'Review updated successfully';
        ELSE
            -- This case should be rare since we already checked for the review's existence
            SET p_success = FALSE;
            SET p_message = 'Failed to update review. Review not found.';
            SET p_reviewId = NULL;
            ROLLBACK;
            LEAVE proc;
        END IF;
    ELSE
        SET p_reviewId = UUID();
        INSERT INTO reviews (
            id, userId, bookId, rating, comment
        ) VALUES (
            p_reviewId, p_userId, p_bookId, p_rating, p_comment
        );
        IF ROW_COUNT() > 0 THEN
            SET p_success = TRUE;
            SET p_message = 'Review submitted successfully';
        ELSE
            SET p_success = FALSE;
            SET p_message = 'Failed to submit review.';
            SET p_reviewId = NULL;
            ROLLBACK;
            LEAVE proc;
        END IF;
    END IF;
    
    COMMIT;
END$$
DELIMITER ;

-- Create stored procedure for returning a book with concurrency control
DELIMITER //

CREATE PROCEDURE ReturnBook(
    IN p_userId VARCHAR(36),
    IN p_copyId VARCHAR(36),
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
    WHERE userId = p_userId AND copyId = p_copyId AND isReturned = FALSE;
    
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
    WHERE userId = p_userId AND copyId = p_copyId AND isReturned = FALSE
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

DELIMITER //

CREATE PROCEDURE CreateAuthor(
    IN p_firstName VARCHAR(255),
    IN p_lastName VARCHAR(255)
)
BEGIN
    -- Generate a unique ID for the new author
    DECLARE v_authorId VARCHAR(36);

    SET v_authorId = UUID();

    START TRANSACTION;

    INSERT INTO authors (id, firstName, lastName, createdAt, updatedAt)
    VALUES (v_authorId, p_firstName, p_lastName, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    -- Return the inserted author
    SELECT id, firstName, lastName
    FROM authors
    WHERE id = v_authorId;

    COMMIT;
END //
DELIMITER ;

DELIMITER //

CREATE PROCEDURE CreatePublisher(
    IN p_name VARCHAR(255)
)
BEGIN
    -- Generate a unique ID for the new publisher
    DECLARE v_publisherId VARCHAR(36);

    SET v_publisherId = UUID();

    START TRANSACTION;

    INSERT INTO publishers (id, name, createdAt, updatedAt)
    VALUES (v_publisherId, p_name, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    -- Return the inserted author
    SELECT id, name
    FROM publishers
    WHERE id = v_publisherId;

    COMMIT;
END //

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE UpdateBook(
    IN p_bookId VARCHAR(36),
    IN p_title VARCHAR(500),
    IN p_thumbnailUrl TEXT,
    IN p_isbn VARCHAR(20),
    IN p_quantity INT,
    IN p_pageCount INT,
    IN p_publisherId VARCHAR(36),
    IN p_description TEXT,
    IN p_avgRating DECIMAL(2,1),
    IN p_authorIds TEXT,
    IN p_genreIds TEXT,
    IN p_staffId VARCHAR(36)
)
BEGIN
    DECLARE v_authorId VARCHAR(36);
    DECLARE v_genreId VARCHAR(36);
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_len INT DEFAULT 0;

    -- Error handler to rollback transaction on SQL errors
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred during book update';
    END;

    -- Start a transaction to ensure all updates are applied atomically
    START TRANSACTION;
    
    -- Validate required inputs
    IF p_bookId IS NULL OR p_bookId = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book ID is a required field';
    END IF;

    -- Lock the row
    SELECT id INTO @bookExists
    FROM books
    WHERE id = p_bookId FOR UPDATE;

    IF @bookExists IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book ID does not exist';
    END IF;

    -- Update the main book record using IFNULL for partial updates
    UPDATE books
    SET
        title = IFNULL(p_title, title),
        thumbnailUrl = IFNULL(p_thumbnailUrl, thumbnailUrl),
        isbn = IFNULL(p_isbn, isbn),
        pageCount = IFNULL(p_pageCount, pageCount),
        publisherId = IFNULL(p_publisherId, publisherId),
        description = IFNULL(p_description, description),
        avgRating = IFNULL(p_avgRating, avgRating),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = p_bookId;

    -- Update author associations only if new author IDs are provided
    IF p_authorIds IS NOT NULL AND p_authorIds <> '' THEN
        -- Delete existing author associations and insert the new ones
        DELETE FROM book_authors WHERE bookId = p_bookId;
        
        SET p_authorIds = CONCAT(p_authorIds, ',');
        SET v_pos = 1;
        SET v_len = LOCATE(',', p_authorIds, v_pos);
        WHILE v_len > 0 DO
            SET v_authorId = TRIM(SUBSTRING(p_authorIds, v_pos, v_len - v_pos));
            IF v_authorId <> '' THEN
                INSERT INTO book_authors (bookId, authorId, createdAt, updatedAt)
                VALUES (p_bookId, v_authorId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            END IF;
            SET v_pos = v_len + 1;
            SET v_len = LOCATE(',', p_authorIds, v_pos);
        END WHILE;
    END IF;

    -- Update genre associations only if new genre IDs are provided
    IF p_genreIds IS NOT NULL AND p_genreIds <> '' THEN
        -- Delete existing genre associations and insert the new ones
        DELETE FROM book_genres WHERE bookId = p_bookId;

        SET p_genreIds = CONCAT(p_genreIds, ',');
        SET v_pos = 1;
        SET v_len = LOCATE(',', p_genreIds, v_pos);
        WHILE v_len > 0 DO
            SET v_genreId = TRIM(SUBSTRING(p_genreIds, v_pos, v_len - v_pos));
            IF v_genreId <> '' THEN
                INSERT INTO book_genres (bookId, genreId, createdAt, updatedAt)
                VALUES (p_bookId, v_genreId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            END IF;
            SET v_pos = v_len + 1;
            SET v_len = LOCATE(',', p_genreIds, v_pos);
        END WHILE;
    END IF;
    
    -- Log the staff action
    CALL AddStaffLog(p_staffId, p_bookId, 'UPDATE', CONCAT('Updated book: "', p_title, '" (ID: ', p_bookId, ')'));
    
    -- Commit the transaction
    COMMIT;

END $$

DELIMITER ;