-- Phase 3 fix: semester_plan_items RLS only chained through week_id, so
-- unit-based planner items (week_id NULL, unit_id set) were invisible even
-- to the owning teacher. Add permissive policies for the unit chain.

create policy "Teachers manage own unit plan items"
  on public.semester_plan_items
  for all
  using (
    exists (
      select 1
      from public.plan_units u
      join public.semester_plans p on p.id = u.plan_id
      where u.id = semester_plan_items.unit_id
        and p.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.plan_units u
      join public.semester_plans p on p.id = u.plan_id
      where u.id = semester_plan_items.unit_id
        and p.teacher_id = auth.uid()
    )
  );

-- Students may read a unit-based plan item only when it belongs to a
-- published package of an ACTIVE plan for a classroom they are a member of.
create policy "Students read published unit plan items"
  on public.semester_plan_items
  for select
  using (
    exists (
      select 1
      from public.plan_package_items l
      join public.plan_packages pk on pk.id = l.package_id
      join public.plan_units u on u.id = pk.unit_id
      join public.semester_plans p on p.id = u.plan_id
      join public.classroom_members m on m.classroom_id = p.class_id
      where l.plan_item_id = semester_plan_items.id
        and pk.published_assignment_id is not null
        and p.status = 'active'
        and m.student_id = auth.uid()
    )
  );
