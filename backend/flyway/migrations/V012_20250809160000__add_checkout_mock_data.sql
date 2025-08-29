-- V012: Add comprehensive checkout mock data for staff reports
-- This migration adds 50 checkout records across different users and books
-- to provide rich data for the staff reports UI

-- Checkout 1: Recent checkout (2 days ago)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c001-2025-08-07-001', '70875304-d60a-467f-8cf8-eb446aad7f5f', 'bd721fc2-2e9e-4c57-bba0-5033a6a77b3a', 
    '2025-08-07', '2025-09-07', NULL, FALSE, FALSE, '2025-08-07 10:30:00', '2025-08-07 10:30:00'
);

-- Checkout 2: Returned on time
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c002-2025-07-15-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', '68c8374e-46df-4028-acf4-4ab82bfb6eb8', 
    '2025-07-15', '2025-08-15', '2025-08-10', TRUE, FALSE, '2025-07-15 14:20:00', '2025-08-10 16:45:00'
);

-- Checkout 3: Late return
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c003-2025-06-20-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '45c612fb-df7d-47bb-9bbf-1a282feca4a2', 
    '2025-06-20', '2025-07-20', '2025-07-25', TRUE, TRUE, '2025-06-20 09:15:00', '2025-07-25 11:30:00'
);

-- Checkout 4: Currently borrowed
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c004-2025-08-05-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', '3e41daeb-2028-41f9-822d-844d1a25d087', 
    '2025-08-05', '2025-09-05', NULL, FALSE, FALSE, '2025-08-05 13:45:00', '2025-08-05 13:45:00'
);

-- Checkout 5: Recently returned
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c005-2025-07-28-001', 'e5ed73c9-9e35-4a27-8d8b-cdd00019657b', '6d259919-f294-4e7f-8d0b-b06234f5e140', 
    '2025-07-28', '2025-08-28', '2025-08-08', TRUE, FALSE, '2025-07-28 16:20:00', '2025-08-08 10:15:00'
);

-- Checkout 6: Staff member checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c006-2025-08-01-001', '026766aa-71e0-11f0-b7ee-4b6c3be6ce57', 'db0d7d53-bd4c-4255-92a6-6e4b56728f38', 
    '2025-08-01', '2025-09-01', NULL, FALSE, FALSE, '2025-08-01 08:30:00', '2025-08-01 08:30:00'
);

-- Checkout 7: Multiple checkouts by same user (Diana Prince - will be top reader)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c007-2025-07-10-001', '70875304-d60a-467f-8cf8-eb446aad7f5f', '97d9a4f2-5c49-4e95-8908-93ba9c938775', 
    '2025-07-10', '2025-08-10', '2025-07-25', TRUE, FALSE, '2025-07-10 11:00:00', '2025-07-25 14:20:00'
);

-- Checkout 8: Another multiple checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c008-2025-06-15-001', '70875304-d60a-467f-8cf8-eb446aad7f5f', '7a51bac2-45d1-4e7b-8c2e-09e2494d73a5', 
    '2025-06-15', '2025-07-15', '2025-07-05', TRUE, FALSE, '2025-06-15 15:30:00', '2025-07-05 12:45:00'
);

-- Checkout 9: Popular book checkout (Uncle Bob's Clean Code)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c009-2025-07-20-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', 'cc1e8eb9-d214-4d67-85b4-15889d025873', 
    '2025-07-20', '2025-08-20', '2025-08-15', TRUE, FALSE, '2025-07-20 10:15:00', '2025-08-15 16:30:00'
);

-- Checkout 10: Another popular book checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c010-2025-07-22-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '0e05171a-891a-4a1c-a165-23ef65d64b40', 
    '2025-07-22', '2025-08-22', '2025-08-18', TRUE, FALSE, '2025-07-22 14:45:00', '2025-08-18 11:20:00'
);

-- Checkout 11: Third popular book checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c011-2025-07-25-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', '7baa0eb8-3997-4676-a978-b1224dfa2b33', 
    '2025-07-25', '2025-08-25', '2025-08-20', TRUE, FALSE, '2025-07-25 09:30:00', '2025-08-20 15:10:00'
);

-- Checkout 12: Staff member multiple checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c012-2025-07-12-001', '026766aa-71e0-11f0-b7ee-4b6c3be6ce57', '33b5121c-aa2d-47ec-9fb0-fb9974206e2b', 
    '2025-07-12', '2025-08-12', '2025-08-05', TRUE, FALSE, '2025-07-12 12:00:00', '2025-08-05 10:45:00'
);

-- Checkout 13: Another staff checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c013-2025-08-03-001', '02676c04-71e0-11f0-b7ee-4b6c3be6ce57', '1741b0be-ae1e-4465-85b4-0c892297be20', 
    '2025-08-03', '2025-09-03', NULL, FALSE, FALSE, '2025-08-03 16:20:00', '2025-08-03 16:20:00'
);

-- Checkout 14: Third staff checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c014-2025-07-18-001', '02677014-71e0-11f0-b7ee-4b6c3be6ce57', '163efc6f-29e7-49f1-91cb-7bcc6c26a735', 
    '2025-07-18', '2025-08-18', '2025-08-10', TRUE, FALSE, '2025-07-18 13:15:00', '2025-08-10 14:30:00'
);

-- Checkout 15: Fourth staff checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c015-2025-08-06-001', '026773f2-71e0-11f0-b7ee-4b6c3be6ce57', 'b88506b6-8e8d-4ef7-96f8-2f32b5c6aa86', 
    '2025-08-06', '2025-09-06', NULL, FALSE, FALSE, '2025-08-06 11:45:00', '2025-08-06 11:45:00'
);

-- Checkout 16: Fifth staff checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c016-2025-07-30-001', '02677794-71e0-11f0-b7ee-4b6c3be6ce57', '20611af5-87d8-4619-9f48-ecf1e7ccec4f', 
    '2025-07-30', '2025-08-30', '2025-08-12', TRUE, FALSE, '2025-07-30 10:00:00', '2025-08-12 16:15:00'
);

-- Checkout 17: User with multiple checkouts (Alice Smith - will be second top reader)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c017-2025-07-05-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', '65417324-3787-4b56-a9e9-7007e8879a05', 
    '2025-07-05', '2025-08-05', '2025-07-28', TRUE, FALSE, '2025-07-05 14:30:00', '2025-07-28 12:45:00'
);

-- Checkout 18: Another checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c018-2025-06-28-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', 'b43b7020-824e-4808-a291-ac53c17e252b', 
    '2025-06-28', '2025-07-28', '2025-07-20', TRUE, FALSE, '2025-06-28 16:45:00', '2025-07-20 11:30:00'
);

-- Checkout 19: Third checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c019-2025-06-10-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', '8a6492a4-5783-491c-b416-548d4a861cf3', 
    '2025-06-10', '2025-07-10', '2025-07-05', TRUE, FALSE, '2025-06-10 09:20:00', '2025-07-05 15:40:00'
);

-- Checkout 20: Fourth checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c020-2025-05-25-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', 'd6efd171-e9d5-424a-b5bc-37b2aa07fa9f', 
    '2025-05-25', '2025-06-25', '2025-06-20', TRUE, FALSE, '2025-05-25 13:15:00', '2025-06-20 10:25:00'
);

-- Checkout 21: User with many checkouts (Clark Kent - will be third top reader)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c021-2025-07-08-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '4abd7368-8d5f-43a7-8fcc-483ba8419f78', 
    '2025-07-08', '2025-08-08', '2025-07-30', TRUE, FALSE, '2025-07-08 11:45:00', '2025-07-30 14:20:00'
);

-- Checkout 22: Another checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c022-2025-06-22-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '1a87fd39-9bb9-437f-9987-d1ee11a240f1', 
    '2025-06-22', '2025-07-22', '2025-07-15', TRUE, FALSE, '2025-06-22 15:30:00', '2025-07-15 12:10:00'
);

-- Checkout 23: Third checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c023-2025-06-05-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', 'b1f9ba19-ffd5-4df1-9cd3-134ddc9bb94c', 
    '2025-06-05', '2025-07-05', '2025-06-28', TRUE, FALSE, '2025-06-05 10:20:00', '2025-06-28 16:35:00'
);

-- Checkout 24: Fourth checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c024-2025-05-18-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '43198f80-e2d1-45a7-9f72-bb87e830a526', 
    '2025-05-18', '2025-06-18', '2025-06-10', TRUE, FALSE, '2025-05-18 14:45:00', '2025-06-10 11:50:00'
);

-- Checkout 25: Fifth checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c025-2025-05-05-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '559f16df-b651-4e2e-afb1-e213ba817309', 
    '2025-05-05', '2025-06-05', '2025-05-28', TRUE, FALSE, '2025-05-05 12:30:00', '2025-05-28 15:15:00'
);

-- Checkout 26: User with moderate checkouts (Bruce Wayne - will be fourth top reader)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c026-2025-07-14-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', '91c8f19a-6d3b-4759-860f-ada05b56d8b1', 
    '2025-07-14', '2025-08-14', '2025-08-05', TRUE, FALSE, '2025-07-14 16:10:00', '2025-08-05 13:25:00'
);

-- Checkout 27: Another checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c027-2025-06-30-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', 'f0c04d34-e125-4bcb-ad7e-e2b7b7f519c0', 
    '2025-06-30', '2025-07-30', '2025-07-22', TRUE, FALSE, '2025-06-30 09:45:00', '2025-07-22 14:40:00'
);

-- Checkout 28: Third checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c028-2025-06-12-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', '743a374d-b507-4207-887a-412f025938c4', 
    '2025-06-12', '2025-07-12', '2025-07-05', TRUE, FALSE, '2025-06-12 13:20:00', '2025-07-05 10:55:00'
);

-- Checkout 29: User with few checkouts (John Doe - will be fifth top reader)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c029-2025-07-25-001', 'e5ed73c9-9e35-4a27-8d8b-cdd00019657b', 'dc5fc2d5-bca5-43ad-b901-4919ca86625d', 
    '2025-07-25', '2025-08-25', '2025-08-15', TRUE, FALSE, '2025-07-25 11:30:00', '2025-08-15 16:20:00'
);

-- Checkout 30: Another checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c030-2025-06-18-001', 'e5ed73c9-9e35-4a27-8d8b-cdd00019657b', 'adae4052-d11e-4b64-829f-f447a50d82e6', 
    '2025-06-18', '2025-07-18', '2025-07-10', TRUE, FALSE, '2025-06-18 15:15:00', '2025-07-10 12:30:00'
);

-- Checkout 31: Third checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c031-2025-05-30-001', 'e5ed73c9-9e35-4a27-8d8b-cdd00019657b', '72bb405c-7db9-4d5c-a55b-59bac8cfd8b8', 
    '2025-05-30', '2025-06-30', '2025-06-22', TRUE, FALSE, '2025-05-30 10:45:00', '2025-06-22 14:15:00'
);

-- Checkout 32: User with minimal checkouts (Qui Huynh - staff)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c032-2025-07-20-001', 'a331b5fe-9707-4ac5-ae58-88cc47abe34e', '46a4735c-e717-404a-9e55-276df182b2eb', 
    '2025-07-20', '2025-08-20', '2025-08-10', TRUE, FALSE, '2025-07-20 12:00:00', '2025-08-10 15:45:00'
);

-- Checkout 33: Another checkout by same user
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c033-2025-06-25-001', 'a331b5fe-9707-4ac5-ae58-88cc47abe34e', '1748fd34-3a8e-4c1f-976d-f7c5ae61489d', 
    '2025-06-25', '2025-07-25', '2025-07-18', TRUE, FALSE, '2025-06-25 14:30:00', '2025-07-18 11:20:00'
);

-- Checkout 34: Staff member with one checkout (Minh Hoang)
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c034-2025-07-30-001', '21174981-494a-45e7-a784-f8aa3f29712d', '195094c9-6f80-4f76-bcf2-06c7ebcdaca7', 
    '2025-07-30', '2025-08-30', '2025-08-20', TRUE, FALSE, '2025-07-30 16:45:00', '2025-08-20 13:10:00'
);

-- Checkout 35: Final checkout for variety
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c035-2025-08-08-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', '8ec7d200-ae64-44a7-bee6-b1f5e0ba889e', 
    '2025-08-08', '2025-09-08', NULL, FALSE, FALSE, '2025-08-08 09:15:00', '2025-08-08 09:15:00'
);

-- Additional checkouts to create more realistic distribution (36-50)
-- More checkouts for popular books to create better distribution

-- Checkout 36: Another Clean Code checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c036-2025-07-12-001', '70875304-d60a-467f-8cf8-eb446aad7f5f', 'cc1e8eb9-d214-4d67-85b4-15889d025873', 
    '2025-07-12', '2025-08-12', '2025-07-28', TRUE, FALSE, '2025-07-12 14:20:00', '2025-07-28 16:30:00'
);

-- Checkout 37: Another Clean Code checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c037-2025-06-15-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', 'cc1e8eb9-d214-4d67-85b4-15889d025873', 
    '2025-06-15', '2025-07-15', '2025-07-05', TRUE, FALSE, '2025-06-15 11:45:00', '2025-07-05 13:20:00'
);

-- Checkout 38: Another Clean Code checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c038-2025-05-20-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', 'cc1e8eb9-d214-4d67-85b4-15889d025873', 
    '2025-05-20', '2025-06-20', '2025-06-10', TRUE, FALSE, '2025-05-20 09:30:00', '2025-06-10 15:45:00'
);

-- Checkout 39: Another Clean Code checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c039-2025-04-25-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', 'cc1e8eb9-d214-4d67-85b4-15889d025873', 
    '2025-04-25', '2025-05-25', '2025-05-15', TRUE, FALSE, '2025-04-25 16:15:00', '2025-05-15 12:30:00'
);

-- Checkout 40: Another Clean Code checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c040-2025-03-30-001', 'e5ed73c9-9e35-4a27-8d8b-cdd00019657b', 'cc1e8eb9-d214-4d67-85b4-15889d025873', 
    '2025-03-30', '2025-04-30', '2025-04-20', TRUE, FALSE, '2025-03-30 13:45:00', '2025-04-20 14:15:00'
);

-- Checkout 41: Design Patterns checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c041-2025-07-18-001', '70875304-d60a-467f-8cf8-eb446aad7f5f', '0e05171a-891a-4a1c-a165-23ef65d64b40', 
    '2025-07-18', '2025-08-18', '2025-08-05', TRUE, FALSE, '2025-07-18 10:30:00', '2025-08-05 16:20:00'
);

-- Checkout 42: Another Design Patterns checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c042-2025-06-22-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '0e05171a-891a-4a1c-a165-23ef65d64b40', 
    '2025-06-22', '2025-07-22', '2025-07-15', TRUE, FALSE, '2025-06-22 14:45:00', '2025-07-15 11:30:00'
);

-- Checkout 43: Another Design Patterns checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c043-2025-05-28-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', '0e05171a-891a-4a1c-a165-23ef65d64b40', 
    '2025-05-28', '2025-06-28', '2025-06-20', TRUE, FALSE, '2025-05-28 12:15:00', '2025-06-20 15:40:00'
);

-- Checkout 44: Refactoring checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c044-2025-07-25-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', '7baa0eb8-3997-4676-a978-b1224dfa2b33', 
    '2025-07-25', '2025-08-25', '2025-08-15', TRUE, FALSE, '2025-07-25 09:45:00', '2025-08-15 13:25:00'
);

-- Checkout 45: Another Refactoring checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c045-2025-06-30-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '7baa0eb8-3997-4676-a978-b1224dfa2b33', 
    '2025-06-30', '2025-07-30', '2025-07-22', TRUE, FALSE, '2025-06-30 16:20:00', '2025-07-22 12:45:00'
);

-- Checkout 46: Another Refactoring checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c046-2025-05-15-001', '6b8fe1ec-095b-43e5-8bd6-6760694caccc', '7baa0eb8-3997-4676-a978-b1224dfa2b33', 
    '2025-05-15', '2025-06-15', '2025-06-05', TRUE, FALSE, '2025-05-15 11:30:00', '2025-06-05 14:15:00'
);

-- Checkout 47: Another Refactoring checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c047-2025-04-20-001', 'e5ed73c9-9e35-4a27-8d8b-cdd00019657b', '7baa0eb8-3997-4676-a978-b1224dfa2b33', 
    '2025-04-20', '2025-05-20', '2025-05-10', TRUE, FALSE, '2025-04-20 15:45:00', '2025-05-10 10:30:00'
);

-- Checkout 48: Another Refactoring checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c048-2025-03-25-001', '70875304-d60a-467f-8cf8-eb446aad7f5f', '7baa0eb8-3997-4676-a978-b1224dfa2b33', 
    '2025-03-25', '2025-04-25', '2025-04-15', TRUE, FALSE, '2025-03-25 13:20:00', '2025-04-15 16:45:00'
);

-- Checkout 49: Another Refactoring checkout
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c049-2025-02-28-001', '9cbf94dd-10df-47c8-abc4-c124791dae74', '7baa0eb8-3997-4676-a978-b1224dfa2b33', 
    '2025-02-28', '2025-03-28', '2025-03-20', TRUE, FALSE, '2025-02-28 10:15:00', '2025-03-20 14:30:00'
);

-- Checkout 50: Final checkout for variety
INSERT INTO checkouts (id, userId, copyId, checkoutDate, dueDate, returnDate, isReturned, isLate, createdAt, updatedAt) VALUES (
    'c050-2025-08-09-001', 'f7d180d9-dbbe-4bf4-8450-c9141f320826', 'cc1e8eb9-d214-4d67-85b4-15889d025873', 
    '2025-08-09', '2025-09-09', NULL, FALSE, FALSE, '2025-08-09 08:30:00', '2025-08-09 08:30:00'
);

-- Update book copies to reflect borrowed status
UPDATE books_copies SET isBorrowed = TRUE WHERE id IN (
    'bd721fc2-2e9e-4c57-bba0-5033a6a77b3a',
    '3e41daeb-2028-41f9-822d-844d1a25d087',
    'db0d7d53-bd4c-4255-92a6-6e4b56728f38',
    '1741b0be-ae1e-4465-85b4-0c892297be20',
    'b88506b6-8e8d-4ef7-96f8-2f32b5c6aa86',
    '8ec7d200-ae64-44a7-bee6-b1f5e0ba889e'
);

-- Update book available copies to reflect current status
UPDATE books SET availableCopies = availableCopies - 6 WHERE id IN (
    '825c0ff5-0599-4127-af19-9a63bfe3c1d5',
    'edd3c35b-527e-4e67-bfcb-b546ce48ca85',
    'c5304b68-66c0-42c8-a594-431bd2ff252f',
    '5bb6d3ba-537c-494a-9085-bcfe47f2c245',
    '4c6887cd-e5c5-4470-8313-9fb48a3ce662',
    '1394174b-5a6e-458a-88c8-4d6656484ff7'
);

-- testing
UPDATE books SET availableCopies = 1, quantity = 10 WHERE id = '825c0ff5-0599-4127-af19-9a63bfe3c1d5';
UPDATE books SET availableCopies = 2, quantity = 8 WHERE id = 'edd3c35b-527e-4e67-bfcb-b546ce48ca85';
UPDATE books SET availableCopies = 3, quantity = 10 WHERE id = 'c5304b68-66c0-42c8-a594-431bd2ff252f';
UPDATE books SET availableCopies = 0, quantity = 6 WHERE id = '5bb6d3ba-537c-494a-9085-bcfe47f2c245';
UPDATE books SET availableCopies = 0, quantity = 5 WHERE id = '4c6887cd-e5c5-4470-8313-9fb48a3ce662';
UPDATE books SET availableCopies = 2, quantity = 7 WHERE id = '1394174b-5a6e-458a-88c8-4d6656484ff7';
UPDATE books SET availableCopies = 4, quantity = 12 WHERE id = '7a51bac2-45d1-4e7b-8c2e-09e2494d73a5';
UPDATE books SET availableCopies = 3, quantity = 9 WHERE id = '97d9a4f2-5c49-4e95-8908-93ba9c938775';
UPDATE books SET availableCopies = 5, quantity = 15 WHERE id = '65417324-3787-4b56-a9e9-7007e8879a05';
UPDATE books SET availableCopies = 2, quantity = 8 WHERE id = 'b43b7020-824e-4808-a291-ac53c17e252b';
UPDATE books SET availableCopies = 1, quantity = 4 WHERE id = '1394174b-5a6e-458a-88c8-4d6656484ff7';
UPDATE books SET availableCopies = 4, quantity = 12 WHERE id = '7a51bac2-45d1-4e7b-8c2e-09e2494d73a5';
UPDATE books SET availableCopies = 0, quantity = 9 WHERE id = '97d9a4f2-5c49-4e95-8908-93ba9c938775';
UPDATE books SET availableCopies = 5, quantity = 15 WHERE id = '65417324-3787-4b56-a9e9-7007e8879a05';
UPDATE books SET availableCopies = 2, quantity = 8 WHERE id = 'b43b7020-824e-4808-a291-ac53c17e252b';
UPDATE books SET availableCopies = 1, quantity = 4 WHERE id = '1394174b-5a6e-458a-88c8-4d6656484ff7';
UPDATE books SET availableCopies = 1, quantity = 10 WHERE id = '5b857ba9-3b52-46d4-a4bb-b2640a39db2b'; -- 10%
UPDATE books SET availableCopies = 2, quantity = 10 WHERE id = '09d86af8-796d-4fb8-b93f-28f3b0a5745a'; -- 20%
UPDATE books SET availableCopies = 3, quantity = 12 WHERE id = 'aa6dddbf-d03f-4d6c-be25-dafdd8feacc5'; -- 25%
UPDATE books SET availableCopies = 4, quantity = 15 WHERE id = '4fce7bc0-36b5-4474-a37a-79e2e9e10acf'; -- 27%
UPDATE books SET availableCopies = 0, quantity = 8 WHERE id = '679d7f9b-86c8-4675-9cef-e745d6ce3bd7'; -- 0%
UPDATE books SET availableCopies = 1, quantity = 5 WHERE id = '5bb6d3ba-537c-494a-9085-bcfe47f2c245'; -- 20%
UPDATE books SET availableCopies = 2, quantity = 8 WHERE id = '4c6887cd-e5c5-4470-8313-9fb48a3ce662'; -- 25%
UPDATE books SET availableCopies = 3, quantity = 10 WHERE id = '1394174b-5a6e-458a-88c8-4d6656484ff7'; -- 30%
UPDATE books SET availableCopies = 0, quantity = 7 WHERE id = '825c0ff5-0599-4127-af19-9a63bfe3c1d5'; -- 0%
UPDATE books SET availableCopies = 1, quantity = 6 WHERE id = 'c5304b68-66c0-42c8-a594-431bd2ff252f'; -- 17%
UPDATE books SET availableCopies = 2, quantity = 9 WHERE id = 'edd3c35b-527e-4e67-bfcb-b546ce48ca85'; -- 22%
UPDATE books SET availableCopies = 3, quantity = 11 WHERE id = '7a51bac2-45d1-4e7b-8c2e-09e2494d73a5'; -- 27%
UPDATE books SET availableCopies = 0, quantity = 4 WHERE id = '97d9a4f2-5c49-4e95-8908-93ba9c938775'; -- 0%
UPDATE books SET availableCopies = 1, quantity = 7 WHERE id = '65417324-3787-4b56-a9e9-7007e8879a05'; -- 14%
UPDATE books SET availableCopies = 2, quantity = 10 WHERE id = 'b43b7020-824e-4808-a291-ac53c17e252b'; -- 20%
UPDATE books SET availableCopies = 3, quantity = 12 WHERE id = '5b857ba9-3b52-46d4-a4bb-b2640a39db2b'; -- 25%
UPDATE books SET availableCopies = 4, quantity = 14 WHERE id = '09d86af8-796d-4fb8-b93f-28f3b0a5745a'; -- 29%
UPDATE books SET availableCopies = 0, quantity = 6 WHERE id = 'aa6dddbf-d03f-4d6c-be25-dafdd8feacc5'; -- 0%
UPDATE books SET availableCopies = 1, quantity = 8 WHERE id = '4fce7bc0-36b5-4474-a37a-79e2e9e10acf'; -- 13%
UPDATE books SET availableCopies = 2, quantity = 11 WHERE id = '679d7f9b-86c8-4675-9cef-e745d6ce3bd7'; -- 18%
