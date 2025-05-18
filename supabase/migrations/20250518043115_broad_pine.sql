/*
  # Create grades table for storing student course grades

  1. New Tables
    - `grades`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `course_name` (text)
      - `first_grade` (numeric)
      - `second_grade` (numeric)
      - `third_grade` (numeric, nullable)
      - `required_grade` (numeric, nullable)
      - `semester` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `grades` table
    - Add policies for authenticated users to:
      - Read their own grades
      - Create new grades
      - Update their own grades
      - Delete their own grades
*/

CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  course_name text NOT NULL,
  first_grade numeric(3,2) CHECK (first_grade >= 0 AND first_grade <= 5) NOT NULL,
  second_grade numeric(3,2) CHECK (second_grade >= 0 AND second_grade <= 5) NOT NULL,
  third_grade numeric(3,2) CHECK (third_grade >= 0 AND third_grade <= 5),
  required_grade numeric(3,2) CHECK (required_grade >= 0 AND required_grade <= 5),
  semester text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own grades"
  ON grades
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create grades"
  ON grades
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grades"
  ON grades
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grades"
  ON grades
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS grades_user_id_idx ON grades(user_id);
CREATE INDEX IF NOT EXISTS grades_semester_idx ON grades(semester);