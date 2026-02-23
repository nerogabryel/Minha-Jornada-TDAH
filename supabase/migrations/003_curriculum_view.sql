-- Migration 003: Optimize Curriculum Fetching
-- Creates a single view to fetch the entire curriculum as a nested JSON structure
-- This solves the N+1 query problem, replacing 3 separate queries with 1 fast, pre-joined query.

CREATE OR REPLACE VIEW public.vw_full_curriculum AS
SELECT 
  m.id,
  m.title,
  m.description,
  m.order as module_order,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', l.id,
          'title', l.title,
          'duration', l.duration,
          'order', l.order,
          'activities', COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', a.id,
                  'type', a.type,
                  'title', a.title,
                  'instructions', a.instructions,
                  'motivational_text', a.motivational_text,
                  'content', a.content,
                  'order', a.order
                ) ORDER BY a.order ASC
              )
              FROM public.course_activities a
              WHERE a.lesson_id = l.id
            ), '[]'::json
          )
        ) ORDER BY l.order ASC
      )
      FROM public.course_lessons l
      WHERE l.module_id = m.id
    ), '[]'::json
  ) as lessons
FROM public.course_modules m
ORDER BY m.order ASC;

-- Grant read access to authenticated and anonymous users
GRANT SELECT ON public.vw_full_curriculum TO authenticated, anon;
