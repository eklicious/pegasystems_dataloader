echo "Waiting for startup.."
until curl http://mongodb:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done

echo curl http://mongodb:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1
echo "Started.."

sleep 10

mongo mongodb:27017/admin <<-EOF
    db.createUser({ user: 'admin', pwd: 'admin', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
EOF

mongo -u admin -p admin mongodb:27017/admin <<-EOF
    db.runCommand({
        createRole: "listDatabases",
        privileges: [
            { resource: { cluster : true }, actions: ["listDatabases"]}
        ],
        roles: []
    });
    db.runCommand({
        createRole: "listCollections",
        privileges: [
            { resource: { cluster : true }, actions: ["listCollections"]}
        ],
        roles: []
    });

    db.createUser({
        user: 'cleanroom',
        pwd: 'cleanroom',
        roles: [
            { role: "readWrite", db: "cleanroom" },
            { role: "readWrite", db: "listCollections" },
            { role: "read", db: "local" },
            { role: "listDatabases", db: "admin" },
            { role: "read", db: "config" },
            { role: "read", db: "admin" }
        ]
    });

    db.createCollection
EOF

echo "Created users"

tail -f /dev/null
