@@ .. @@
   email,
   full_name,
   business_name,
+  subdomain,
   color,
   created_at,
   updated_at
 ) VALUES (
   'b8f4d8c0-1234-5678-9abc-def012345678'::uuid,
   'test@instructor.com',
   'Test Instructor',
   'Test Academy',
+  'testacademy',
   '#7c3aed',
   now(),
   now()