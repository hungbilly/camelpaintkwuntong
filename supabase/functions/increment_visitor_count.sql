CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE visitors 
  SET count = count + 1
  WHERE id = (SELECT id FROM visitors ORDER BY created_at ASC LIMIT 1);
END;
$$;