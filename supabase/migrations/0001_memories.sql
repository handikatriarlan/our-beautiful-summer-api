/*
  # Create memories schema

  1. New Tables
    - `memories`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `photo_url` (text)
      - `date` (timestamp)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `memories` table
    - Add policies for authenticated users to manage their own memories
*/

CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  photo_url text NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own memories
CREATE POLICY "Users can read own memories"
  ON memories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own memories
CREATE POLICY "Users can insert own memories"
  ON memories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own memories
CREATE POLICY "Users can update own memories"
  ON memories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own memories
CREATE POLICY "Users can delete own memories"
  ON memories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);