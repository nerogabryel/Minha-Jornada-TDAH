-- Migration 004: Admin Roles and Storage Setup

-- 1. Add is_admin column to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create an index to quickly find admins
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON public.user_profiles(is_admin);

-- 2. Update RLS policies to allow Admins full access to core tables
-- We will add policies to course_modules, course_lessons, course_activities

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for course_modules
CREATE POLICY "Admins can insert modules" ON public.course_modules FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update modules" ON public.course_modules FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete modules" ON public.course_modules FOR DELETE USING (public.is_admin());

-- Policies for course_lessons
CREATE POLICY "Admins can insert lessons" ON public.course_lessons FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update lessons" ON public.course_lessons FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete lessons" ON public.course_lessons FOR DELETE USING (public.is_admin());

-- Policies for course_activities
CREATE POLICY "Admins can insert activities" ON public.course_activities FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update activities" ON public.course_activities FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete activities" ON public.course_activities FOR DELETE USING (public.is_admin());

-- 3. Storage Buckets for Avatars and Assets
-- Note: Buckets must be created via the Supabase Dashboard as creating them via SQL is restricted in some environments,
-- but we can prepare the policies assuming the buckets 'avatars' and 'course_assets' will be created.

-- Ensure the storage schema extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Storage Policies for 'avatars' (assuming bucket is created manually)
-- CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "Users can upload their own avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
-- CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
-- CREATE POLICY "Users can delete their own avatar." ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Storage Policies for 'course_assets' 
-- CREATE POLICY "Premium users and admins can read assets." ON storage.objects FOR SELECT USING (
--   bucket_id = 'course_assets' AND (
--     public.is_admin() OR 
--     EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND subscription_tier = 'premium')
--   )
-- );
-- CREATE POLICY "Only admins can upload/modify assets." ON storage.objects FOR ALL USING (bucket_id = 'course_assets' AND public.is_admin());
