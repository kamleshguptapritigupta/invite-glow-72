-- Fix function security warnings by setting search_path
CREATE OR REPLACE FUNCTION generate_greeting_slug(sender_name TEXT, receiver_name TEXT, event_name TEXT)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Create base slug from sender-wishes-receiver-event format
  base_slug := LOWER(
    REGEXP_REPLACE(
      CONCAT(sender_name, '-wishes-', receiver_name, '-', event_name),
      '[^a-zA-Z0-9]+', '-', 'g'
    )
  );
  
  -- Remove leading/trailing dashes
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  -- Ensure it's not too long
  IF LENGTH(base_slug) > 50 THEN
    base_slug := SUBSTRING(base_slug FROM 1 FOR 50);
  END IF;
  
  final_slug := base_slug;
  
  -- Check if slug exists and increment counter if needed
  WHILE EXISTS (SELECT 1 FROM public.greetings WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

CREATE OR REPLACE FUNCTION update_greeting_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;