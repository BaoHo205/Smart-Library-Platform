-- DELIMITER $$

-- CREATE PROCEDURE insert_ten_copies_first22_v004()
-- BEGIN
--   DECLARE done INT DEFAULT 0;
--   DECLARE book_id VARCHAR(36);
--   DECLARE existing_count INT DEFAULT 0;
--   DECLARE to_insert INT DEFAULT 0;
--   DECLARE i INT DEFAULT 0;

--   -- Cursor over the explicit first-22 V004 book ids (preserves list)
--   DECLARE cur CURSOR FOR
--     SELECT id FROM (
--       SELECT '0418ba35-d180-4c9c-8cca-b9b41a46e65e' AS id UNION ALL
--       SELECT '09d86af8-796d-4fb8-b93f-28f3b0a5745a' UNION ALL
--       SELECT '0fe7225f-c962-4d6c-8d26-f3c6babcf865' UNION ALL
--       SELECT '1394174b-5a6e-458a-88c8-4d6656484ff7' UNION ALL
--       SELECT '1e97f78b-6cc3-4eee-86a3-e79280f64d47' UNION ALL
--       SELECT '2013d438-5bd7-4bf5-9cc5-735a7495063c' UNION ALL
--       SELECT '26c0c82d-0730-4b62-bc8f-36e99c5c68e4' UNION ALL
--       SELECT '2772b67c-5593-414f-9c3f-ff70668d3f18' UNION ALL
--       SELECT '2e55112a-4c74-4054-8a36-ad970b790092' UNION ALL
--       SELECT '2f8b83c5-991d-4790-98a4-c9f817294c0b' UNION ALL
--       SELECT '40671057-2871-4843-b1a3-eb4919d6fb05' UNION ALL
--       SELECT '4c6887cd-e5c5-4470-8313-9fb48a3ce662' UNION ALL
--       SELECT '4c8cf7dd-91b1-4304-a06f-7f6e1d3eda53' UNION ALL
--       SELECT '4fce7bc0-36b5-4474-a37a-79e2e9e10acf' UNION ALL
--       SELECT '52a8e46f-1965-4caa-b4e2-b6db5e9a7174' UNION ALL
--       SELECT '5a3531d5-8e08-4066-a92d-e8d80b3d5546' UNION ALL
--       SELECT '5b857ba9-3b52-46d4-a4bb-b2640a39db2b' UNION ALL
--       SELECT '61d2f03f-55a6-4768-9ca0-fd717629eaff' UNION ALL
--       SELECT '679d7f9b-86c8-4675-9cef-e745d6ce3bd7' UNION ALL
--       SELECT '690a70d4-a89b-4ec3-9e8a-e3fbdffd14d1' UNION ALL
--       SELECT '6d42b5ec-ec57-4c3b-a51f-9f67735d26a9' UNION ALL
--       SELECT '796c3bde-2a06-4290-aa9f-33d478bc61c8'
--     ) AS ids;

--   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

--   OPEN cur;

--   read_loop: LOOP
--     FETCH cur INTO book_id;
--     IF done THEN
--       LEAVE read_loop;
--     END IF;

--     -- ensure the book exists (skip if not present)
--     SELECT COUNT(*) INTO existing_count FROM books WHERE id = book_id;
--     IF existing_count = 0 THEN
--       ITERATE read_loop;
--     END IF;

--     -- count existing copies and calculate how many to insert to reach 10 total
--     SELECT COUNT(*) INTO existing_count FROM books_copies WHERE bookId = book_id;
--     SET to_insert = 10 - existing_count;

--     IF to_insert > 0 THEN
--       SET i = 1;
--       WHILE i <= to_insert DO
--         INSERT INTO books_copies (id, bookId, isBorrowed)
--         VALUES (UUID(), book_id, FALSE);
--         SET i = i + 1;
--       END WHILE;
--     END IF;
--   END LOOP;

--   CLOSE cur;
-- END$$

-- DELIMITER ;

-- CALL insert_ten_copies_first22_v004();

-- DELIMITER $$

-- CREATE PROCEDURE insert_three_copies_remaining22_v004()
-- BEGIN
--   DECLARE done INT DEFAULT 0;
--   DECLARE book_id VARCHAR(36);
--   DECLARE existing_count INT DEFAULT 0;
--   DECLARE to_insert INT DEFAULT 0;
--   DECLARE i INT DEFAULT 0;

--   -- Cursor: select up to 22 books that are NOT in the "first 22" list from V004
--   DECLARE cur CURSOR FOR
--     SELECT id FROM books
--     WHERE id NOT IN (
--       '0418ba35-d180-4c9c-8cca-b9b41a46e65e',
--       '09d86af8-796d-4fb8-b93f-28f3b0a5745a',
--       '0fe7225f-c962-4d6c-8d26-f3c6babcf865',
--       '1394174b-5a6e-458a-88c8-4d6656484ff7',
--       '1e97f78b-6cc3-4eee-86a3-e79280f64d47',
--       '2013d438-5bd7-4bf5-9cc5-735a7495063c',
--       '26c0c82d-0730-4b62-bc8f-36e99c5c68e4',
--       '2772b67c-5593-414f-9c3f-ff70668d3f18',
--       '2e55112a-4c74-4054-8a36-ad970b790092',
--       '2f8b83c5-991d-4790-98a4-c9f817294c0b',
--       '40671057-2871-4843-b1a3-eb4919d6fb05',
--       '4c6887cd-e5c5-4470-8313-9fb48a3ce662',
--       '4c8cf7dd-91b1-4304-a06f-7f6e1d3eda53',
--       '4fce7bc0-36b5-4474-a37a-79e2e9e10acf',
--       '52a8e46f-1965-4caa-b4e2-b6db5e9a7174',
--       '5a3531d5-8e08-4066-a92d-e8d80b3d5546',
--       '5b857ba9-3b52-46d4-a4bb-b2640a39db2b',
--       '61d2f03f-55a6-4768-9ca0-fd717629eaff',
--       '679d7f9b-86c8-4675-9cef-e745d6ce3bd7',
--       '690a70d4-a89b-4ec3-9e8a-e3fbdffd14d1',
--       '6d42b5ec-ec57-4c3b-a51f-9f67735d26a9',
--       '796c3bde-2a06-4290-aa9f-33d478bc61c8'
--     )
--     LIMIT 22;

--   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

--   OPEN cur;

--   read_loop: LOOP
--     FETCH cur INTO book_id;
--     IF done THEN
--       LEAVE read_loop;
--     END IF;

--     -- ensure the book exists (extra safety)
--     SELECT COUNT(*) INTO existing_count FROM books WHERE id = book_id;
--     IF existing_count = 0 THEN
--       ITERATE read_loop;
--     END IF;

--     -- how many copies already exist for this book
--     SELECT COUNT(*) INTO existing_count FROM books_copies WHERE bookId = book_id;
--     SET to_insert = 3 - existing_count;

--     -- insert the delta (so total becomes at least 3; won't exceed 3)
--     IF to_insert > 0 THEN
--       SET i = 1;
--       WHILE i <= to_insert DO
--         INSERT INTO books_copies (id, bookId, isBorrowed)
--         VALUES (UUID(), book_id, FALSE);
--         SET i = i + 1;
--       END WHILE;
--     END IF;
--   END LOOP;

--   CLOSE cur;
-- END$$

-- DELIMITER ;

-- CALL insert_three_copies_remaining22_v004();

-- -- 200 past checkouts insert
-- DELIMITER $$

-- CREATE PROCEDURE insert_200_past_checkouts()
-- BEGIN
--   DECLARE i INT DEFAULT 0;
--   DECLARE users_count INT DEFAULT 0;
--   DECLARE tbl_exists INT DEFAULT 0;
--   DECLARE copy_table_name VARCHAR(64);
--   DECLARE user_id VARCHAR(36);
--   DECLARE copy_id VARCHAR(36);
--   DECLARE checkout_dt DATE;
--   DECLARE due_dt DATE;
--   DECLARE return_dt DATE;
--   DECLARE rand_days INT;
--   DECLARE loan_days INT;
--   DECLARE is_late_flag INT;
--   DECLARE delta_days INT;

--   -- must have users
--   SELECT COUNT(*) INTO users_count FROM users;
--   IF users_count = 0 THEN
--     SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No users found - aborting';
--   END IF;

--   -- choose which copies table exists
--   SELECT COUNT(*) INTO tbl_exists
--     FROM information_schema.tables
--     WHERE table_schema = DATABASE() AND table_name = 'books_copies';
--   IF tbl_exists > 0 THEN
--     SET copy_table_name = 'books_copies';
--   ELSE
--     SELECT COUNT(*) INTO tbl_exists
--       FROM information_schema.tables
--       WHERE table_schema = DATABASE() AND table_name = 'books_copies';
--     IF tbl_exists > 0 THEN
--       SET copy_table_name = 'books_copies';
--     ELSE
--       SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No copies table (books_copies or books_copies) found - aborting';
--     END IF;
--   END IF;

--   SET i = 1;
--   WHILE i <= 200 DO
--     -- pick a random user
--     SELECT id INTO user_id FROM users ORDER BY RAND() LIMIT 1;

--     -- pick a random copy id from the chosen copy table using dynamic SQL into a user-variable
--     SET @sql = CONCAT('SELECT id INTO @selected_copy_id FROM ', copy_table_name, ' ORDER BY RAND() LIMIT 1');
--     PREPARE stmt FROM @sql;
--     EXECUTE stmt;
--     DEALLOCATE PREPARE stmt;
--     SET copy_id = @selected_copy_id;

--     -- if either selection failed, just skip this iteration (increment counter)
--     IF user_id IS NULL OR copy_id IS NULL THEN
--       SET i = i + 1;
--     ELSE
--       -- random checkout date between 1 and 365 days ago
--       SET rand_days = FLOOR(RAND() * 365) + 1;
--       SET checkout_dt = DATE_SUB(CURDATE(), INTERVAL rand_days DAY);

--       -- random loan length between 7 and 28 days
--       SET loan_days = FLOOR(RAND() * 22) + 7;
--       SET due_dt = DATE_ADD(checkout_dt, INTERVAL loan_days DAY);

--       -- decide if returned late (~30% chance)
--       SET is_late_flag = IF(RAND() < 0.30, 1, 0);

--       IF is_late_flag = 1 THEN
--         -- returned after due date: add 1..30 days to due date, but cap to today - 1
--         SET return_dt = DATE_ADD(due_dt, INTERVAL (FLOOR(RAND()*30) + 1) DAY);
--         IF return_dt >= CURDATE() THEN
--           SET return_dt = DATE_SUB(CURDATE(), INTERVAL 1 DAY);
--         END IF;
--       ELSE
--         -- returned on or before due date: between checkout_date and due_date
--         SET delta_days = DATEDIFF(due_dt, checkout_dt);
--         IF delta_days < 0 THEN SET delta_days = 0; END IF;
--         SET return_dt = DATE_ADD(checkout_dt, INTERVAL FLOOR(RAND() * (delta_days + 1)) DAY);
--         IF return_dt >= CURDATE() THEN
--           SET return_dt = DATE_SUB(CURDATE(), INTERVAL 1 DAY);
--         END IF;
--       END IF;

--       -- final isLate safety: recalc based on dates (in case of capping)
--       SET is_late_flag = IF(return_dt > due_dt, 1, 0);

--       -- insert checkout row
--       INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate)
--       VALUES (UUID(), user_id, copy_id, checkout_dt, due_dt, return_dt, TRUE, is_late_flag);

--       SET i = i + 1;
--     END IF;
--   END WHILE;
-- END$$

-- DELIMITER ;

-- CALL insert_200_past_checkouts();

-- -- Migration: create 99 active checkouts for the first 11 books
-- -- Ensures: each of the first 11 books has 9 active checkouts (99 total)
-- -- - No user will have 2 active checkouts for the same book
-- -- - No two users will borrow the same copy
-- -- - Inserts extra copies when a book has fewer than 9 copies

-- DELIMITER $$

-- DROP PROCEDURE IF EXISTS create_99_active_checkouts_first11$$
-- CREATE PROCEDURE create_99_active_checkouts_first11()
-- BEGIN
--     DECLARE v_done INT DEFAULT 0;
--     DECLARE v_book_id VARCHAR(36);
--     DECLARE v_copy_id VARCHAR(36);
--     DECLARE v_user_id VARCHAR(36);
--     DECLARE v_existing_copies INT DEFAULT 0;
--     DECLARE v_to_add INT DEFAULT 0;
--     DECLARE v_i INT DEFAULT 0;
--     DECLARE v_loan_days INT DEFAULT 14;
--     DECLARE v_checkout_dt DATE;
--     DECLARE v_due_dt DATE;

--     -- cursor for first 11 books (ordered by createdAt then id to be deterministic)
--     DECLARE cur_books CURSOR FOR SELECT id FROM books ORDER BY createdAt, id LIMIT 11;
--     DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = 1;

--     OPEN cur_books;

--     book_loop: LOOP
--         FETCH cur_books INTO v_book_id;
--         IF v_done = 1 THEN
--             LEAVE book_loop;
--         END IF;

--         -- Ensure at least 9 copies exist for this book
--         SELECT COUNT(*) INTO v_existing_copies FROM books_copies WHERE bookId = v_book_id;
--         IF v_existing_copies < 9 THEN
--             SET v_to_add = 9 - v_existing_copies;
--             SET v_i = 1;
--             WHILE v_i <= v_to_add DO
--                 INSERT INTO books_copies (id, bookId, isBorrowed, createdAt, updatedAt)
--                 VALUES (UUID(), v_book_id, FALSE, NOW(), NOW());
--                 SET v_i = v_i + 1;
--             END WHILE;
--         END IF;

--         -- Create 9 active checkouts for this book
--         SET v_i = 1;
--         WHILE v_i <= 9 DO
--             -- pick a random available copy for this book (not currently borrowed)
--             SELECT id INTO v_copy_id
--             FROM books_copies
--             WHERE bookId = v_book_id AND isBorrowed = FALSE
--             ORDER BY RAND() LIMIT 1;

--             IF v_copy_id IS NULL THEN
--                 -- should not happen because we ensured >=9 copies and mark them as borrowed below,
--                 -- but if it happens, abort with descriptive error
--                 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No available copy found for book while creating active checkouts.';
--             END IF;

--             -- pick a random user who does NOT already have an active checkout for this book
--             SELECT id INTO v_user_id
--             FROM users u
--             WHERE NOT EXISTS (
--                 SELECT 1 FROM checkouts c
--                 JOIN books_copies bc ON bc.id = c.copyId
--                 WHERE c.userId = u.id
--                   AND c.isReturned = FALSE
--                   AND bc.bookId = v_book_id
--             )
--             ORDER BY RAND() LIMIT 1;

--             IF v_user_id IS NULL THEN
--                 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough users available to satisfy unique-user-per-book constraint.';
--             END IF;

--             -- compute checkout and due dates (checkout within last 10 days)
--             SET v_checkout_dt = DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 10) DAY);
--             SET v_due_dt = DATE_ADD(v_checkout_dt, INTERVAL v_loan_days DAY);

--             -- insert active (not returned) checkout
--             INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt)
--             VALUES (UUID(), v_user_id, v_copy_id, v_checkout_dt, v_due_dt, NULL, FALSE, FALSE, NOW(), NOW());

--             -- mark the copy as borrowed so we don't reuse it
--             UPDATE books_copies SET isBorrowed = TRUE, updatedAt = NOW() WHERE id = v_copy_id;

--             SET v_i = v_i + 1;
--         END WHILE;

--     END LOOP book_loop;

--     CLOSE cur_books;
-- END$$

-- DELIMITER ;

-- -- Optionally call the procedure to execute it during migration
-- CALL create_99_active_checkouts_first11();
-- -- DROP PROCEDURE IF EXISTS create_99_active_checkouts_first11; -- keep or remove as desired

-- DELIMITER $$

-- CREATE PROCEDURE create_88_active_checkouts_books12_22()
-- BEGIN
--   DECLARE done INT DEFAULT 0;
--   DECLARE book_id VARCHAR(36);
--   DECLARE existing_active INT DEFAULT 0;
--   DECLARE total_copies INT DEFAULT 0;
--   DECLARE missing_copies INT DEFAULT 0;
--   DECLARE to_insert INT DEFAULT 0;
--   DECLARE j INT DEFAULT 0;
--   DECLARE user_id VARCHAR(36);
--   DECLARE copy_id VARCHAR(36);
--   DECLARE v_msg VARCHAR(255) DEFAULT '';

--   -- Cursor over book IDs 12..22 from V004 (order of insert queries)
--   DECLARE cur CURSOR FOR
--     SELECT id FROM (
--       SELECT '4c6887cd-e5c5-4470-8313-9fb48a3ce662' AS id UNION ALL
--       SELECT '4c8cf7dd-91b1-4304-a06f-7f6e1d3eda53' UNION ALL
--       SELECT '4fce7bc0-36b5-4474-a37a-79e2e9e10acf' UNION ALL
--       SELECT '52a8e46f-1965-4caa-b4e2-b6db5e9a7174' UNION ALL
--       SELECT '5a3531d5-8e08-4066-a92d-e8d80b3d5546' UNION ALL
--       SELECT '5b857ba9-3b52-46d4-a4bb-b2640a39db2b' UNION ALL
--       SELECT '5bb6d3ba-537c-494a-9085-bcfe47f2c245' UNION ALL
--       SELECT '61d2f03f-55a6-4768-9ca0-fd717629eaff' UNION ALL
--       SELECT '679d7f9b-86c8-4675-9cef-e745d6ce3bd7' UNION ALL
--       SELECT '690a70d4-a89b-4ec3-9e8a-e3fbdffd14d1' UNION ALL
--       SELECT '6d42b5ec-ec57-4c3b-a51f-9f67735d26a9'
--     ) AS ids;

--   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

--   OPEN cur;

--   read_loop: LOOP
--     FETCH cur INTO book_id;
--     IF done THEN
--       LEAVE read_loop;
--     END IF;

--     -- count existing active checkouts for this book
--     SELECT COUNT(*) INTO existing_active
--       FROM checkouts c
--       JOIN books_copies bc ON c.copyId = bc.id
--       WHERE bc.bookId = book_id AND c.isReturned = FALSE;

--     SET to_insert = 7 - existing_active;
--     IF to_insert <= 0 THEN
--       ITERATE read_loop;
--     END IF;

--     -- ensure there are at least 8 copies total for the book
--     SELECT COUNT(*) INTO total_copies FROM books_copies WHERE bookId = book_id;
--     SET missing_copies = 7 - total_copies;
--     IF missing_copies > 0 THEN
--       SET j = 1;
--       WHILE j <= missing_copies DO
--         INSERT INTO books_copies (id, bookId, isBorrowed) VALUES (UUID(), book_id, FALSE);
--         SET j = j + 1;
--       END WHILE;
--     END IF;

--     -- create required active checkouts
--     SET j = 1;
--     WHILE j <= to_insert DO
--       -- pick a user who does NOT have an active checkout for this book
--       SET user_id = (
--         SELECT u.id
--         FROM users u
--         WHERE NOT EXISTS (
--           SELECT 1 FROM checkouts c2
--           JOIN books_copies bc2 ON c2.copyId = bc2.id
--           WHERE c2.userId = u.id AND c2.isReturned = FALSE AND bc2.bookId = book_id
--         )
--         ORDER BY RAND()
--         LIMIT 1
--       );

--       IF user_id IS NULL THEN
--         SET v_msg = CONCAT('Not enough distinct users available for book ', book_id);
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
--       END IF;

--       -- pick an available copy (not borrowed)
--       SET copy_id = (
--         SELECT id FROM books_copies
--         WHERE bookId = book_id AND isBorrowed = FALSE
--         ORDER BY RAND()
--         LIMIT 1
--       );

--       IF copy_id IS NULL THEN
--         SET v_msg = CONCAT('No available copy to borrow for book ', book_id);
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
--       END IF;

--       -- insert active checkout (isReturned = FALSE)
--       INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate)
--       VALUES (UUID(), user_id, copy_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), NULL, FALSE, FALSE);

--       -- mark copy as borrowed
--       UPDATE books_copies SET isBorrowed = TRUE WHERE id = copy_id;

--       SET j = j + 1;
--     END WHILE;
--   END LOOP;

--   CLOSE cur;
-- END$$

-- DELIMITER ;

-- call create_88_active_checkouts_books12_22();