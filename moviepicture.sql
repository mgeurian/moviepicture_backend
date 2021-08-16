\echo 'Delete and recreate moviepicture db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE moviepicture;
CREATE DATABASE moviepicture;
\connect moviepicture

\i moviepicture-schema.sql
\i moviepicture-seed.sql

\echo 'Delete and recreate moviepicture_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE moviepicture_test;
CREATE DATABASE moviepicture_test;
\connect moviepicture_test

\i moviepicture-schema.sql
