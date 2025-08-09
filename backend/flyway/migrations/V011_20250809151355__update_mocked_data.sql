-- Update new field - available copies
UPDATE books b
LEFT JOIN (
  SELECT bookId, COUNT(*) AS activeCheckouts
  FROM checkouts
  WHERE isReturned = FALSE
  GROUP BY bookId
) co ON co.bookId = b.id
SET
  b.availableCopies = GREATEST(0, LEAST(b.quantity, b.quantity - IFNULL(co.activeCheckouts, 0))),
  b.status = CASE
               WHEN GREATEST(0, LEAST(b.quantity, b.quantity - IFNULL(co.activeCheckouts, 0))) > 0
                 THEN 'available'
               ELSE 'unavailable'
             END;