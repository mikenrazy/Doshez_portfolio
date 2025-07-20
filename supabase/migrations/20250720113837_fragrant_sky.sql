/*
  # Admin System Setup

  1. New Tables
    - `admin_users` - Admin authentication
    - `portfolio_content` - Dynamic portfolio content
    - `media_uploads` - File upload management
    
  2. Security
    - Enable RLS on all tables
    - Add policies for admin-only access
    
  3. Functions
    - Password hashing utilities
    - Content management functions
*/

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  profile_image_url text,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create portfolio content table
CREATE TABLE IF NOT EXISTS portfolio_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'hero', 'about', 'skills', 'experience', 'projects', 'contact'
  content_key text NOT NULL,
  content_value jsonb NOT NULL,
  admin_id uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create media uploads table
CREATE TABLE IF NOT EXISTS media_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  file_size integer NOT NULL,
  file_path text NOT NULL,
  upload_type text NOT NULL, -- 'profile', 'project', 'general'
  admin_id uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can manage their own data"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Portfolio content policies
CREATE POLICY "Admins can manage portfolio content"
  ON portfolio_content
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Public can read portfolio content"
  ON portfolio_content
  FOR SELECT
  TO anon
  USING (true);

-- Media uploads policies
CREATE POLICY "Admins can manage media uploads"
  ON media_uploads
  FOR ALL
  TO authenticated
  USING (admin_id = auth.uid());

CREATE POLICY "Public can read media uploads"
  ON media_uploads
  FOR SELECT
  TO anon
  USING (true);

-- Insert default admin user (password will be hashed in application)
INSERT INTO admin_users (email, password_hash, full_name) 
VALUES (
  'odongonmichael@gmail.com',
  '$2b$10$placeholder_hash_to_be_replaced',
  'Michael Odongo'
) ON CONFLICT (email) DO NOTHING;

-- Insert default portfolio content
INSERT INTO portfolio_content (section, content_key, content_value) VALUES
('hero', 'personal_info', '{
  "name": "Michael Odongo",
  "title": "IT Specialist",
  "roles": ["IT Specialist", "Tech Lead", "Full-Stack Developer"],
  "description": "Experienced IT specialist with a passion for designing beautiful and functional systems. Creative developer and innovator from Kenya, specializing in live streaming, system administration, and cutting-edge web technologies.",
  "location": "Butere, Kenya",
  "profile_image": "/api/placeholder/400/400"
}'),
('about', 'bio', '{
  "paragraphs": [
    "I am an experienced IT specialist with a demonstrated history of working in the computer networking industry. As a creative developer and innovator, I have a passion for designing beautiful and functional systems that make a real impact.",
    "Currently serving as Tech Lead at dx u (formerly CIO Africa), I bring expertise in system administration, live streaming technologies, web development, and cybersecurity. My goal is to develop my skills in organizations that offer both challenge and opportunity for personal initiative and career advancement.",
    "Based in Butere, Kenya, I am always excited to work on innovative projects that push the boundaries of technology and create meaningful solutions for users worldwide."
  ]
}'),
('contact', 'info', '{
  "email": "odongonmichael@gmail.com",
  "phone": "+254713974061",
  "location": "Butere, Kenya",
  "linkedin": "https://www.linkedin.com/in/mikenrazy",
  "github": "https://github.com/mikenrazy"
}')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_content_updated_at
    BEFORE UPDATE ON portfolio_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();