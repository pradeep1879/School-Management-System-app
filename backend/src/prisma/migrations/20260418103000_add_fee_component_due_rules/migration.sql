ALTER TABLE "FeeComponent"
ADD COLUMN "dueDay" INTEGER,
ADD COLUMN "dueMonth" INTEGER;

UPDATE "FeeComponent"
SET
  "dueDay" = CASE
    WHEN "frequency" = 'MONTHLY' THEN 10
    ELSE 20
  END,
  "dueMonth" = CASE
    WHEN "frequency" = 'MONTHLY' THEN NULL
    WHEN "frequency" = 'QUARTERLY' THEN 3
    ELSE 3
  END;

ALTER TABLE "FeeComponent"
ALTER COLUMN "dueDay" SET NOT NULL;
