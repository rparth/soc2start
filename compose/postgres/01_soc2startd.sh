#!/bin/sh

set -eu

psql -v ON_ERROR_STOP=1 -U $POSTGRES_USER <<-EOF
CREATE USER soc2startd;
ALTER USER soc2startd WITH SUPERUSER;
ALTER USER soc2startd PASSWORD 'soc2startd';
CREATE DATABASE soc2startd;
GRANT ALL PRIVILEGES ON DATABASE soc2startd TO soc2startd;
CREATE DATABASE soc2startd_test;
GRANT ALL PRIVILEGES ON DATABASE soc2startd_test TO soc2startd;
EOF

psql -v ON_ERROR_STOP=1 -U $POSTGRES_USER -d soc2startd <<-EOF
ALTER SCHEMA public OWNER TO soc2startd;
GRANT ALL ON SCHEMA public TO soc2startd;
EOF

psql -v ON_ERROR_STOP=1 -U $POSTGRES_USER -d soc2startd_test <<-EOF
ALTER SCHEMA public OWNER TO soc2startd;
GRANT ALL ON SCHEMA public TO soc2startd;
EOF
