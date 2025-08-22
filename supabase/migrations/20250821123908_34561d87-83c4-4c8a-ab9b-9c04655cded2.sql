-- Create greetings table to store customization data
CREATE TABLE public.greetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL DEFAULT 'My Greeting',
  slug TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT,
  event_emoji TEXT,
  sender_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  theme TEXT,
  layout TEXT DEFAULT 'grid',
  frame_style TEXT DEFAULT 'classic',
  animation_style TEXT DEFAULT 'fade',
  
  -- JSON fields for complex data
  texts JSONB DEFAULT '[]',
  media JSONB DEFAULT '[]',
  emojis JSONB DEFAULT '[]',
  background_settings JSONB DEFAULT '{}',
  border_settings JSONB DEFAULT '{}',
  
  -- SEO and sharing
  is_public BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-zA-Z0-9-]+$')
);

-- Create index for fast slug lookups
CREATE INDEX idx_greetings_slug ON public.greetings(slug);
CREATE INDEX idx_greetings_user_id ON public.greetings(user_id);
CREATE INDEX idx_greetings_public ON public.greetings(is_public) WHERE is_public = true;

-- Enable RLS
ALTER TABLE public.greetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view public greetings" 
ON public.greetings FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own greetings" 
ON public.greetings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own greetings" 
ON public.greetings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own greetings" 
ON public.greetings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own greetings" 
ON public.greetings FOR DELETE 
USING (auth.uid() = user_id);

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_greeting_slug(sender_name TEXT, receiver_name TEXT, event_name TEXT)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamps
CREATE OR REPLACE FUNCTION update_greeting_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_greetings_updated_at
  BEFORE UPDATE ON public.greetings
  FOR EACH ROW
  EXECUTE FUNCTION update_greeting_updated_at();

-- Create AI suggestions table for text suggestions
CREATE TABLE public.ai_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  suggestion_type TEXT NOT NULL, -- 'text', 'theme', 'layout'
  content JSONB NOT NULL,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for AI suggestions
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone can read AI suggestions
CREATE POLICY "Anyone can read AI suggestions" 
ON public.ai_suggestions FOR SELECT 
USING (true);

-- Insert some default AI suggestions
INSERT INTO public.ai_suggestions (event_type, suggestion_type, content) VALUES
('birthday', 'text', '{"suggestions": ["Wishing you a day filled with happiness and a year filled with joy!", "May your birthday be the start of a year filled with good luck, good health and much happiness!", "Another year older, another year wiser. Happy Birthday!"]}'),
('anniversary', 'text', '{"suggestions": ["Congratulations on another year of love and happiness!", "May your love story continue to inspire others!", "Here''s to many more years of love and laughter together!"]}'),
('christmas', 'text', '{"suggestions": ["May your Christmas be filled with joy, love, and laughter!", "Wishing you and your family a Christmas filled with wonder and magic!", "May the spirit of Christmas bring you peace and happiness!"]}'),
('newyear', 'text', '{"suggestions": ["May this new year bring you happiness, peace, and prosperity!", "Wishing you a year full of new adventures and opportunities!", "Here''s to a fresh start and new beginnings!"]}');