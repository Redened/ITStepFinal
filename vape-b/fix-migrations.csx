using System;
using Npgsql;

var connStr = "Host=ep-curly-rice-ascnqs3s-pooler.c-4.eu-central-1.aws.neon.tech;Database=vapedb2;Username=neondb_owner;Password=npg_BumFpbe3d5ZK;";
using var conn = new NpgsqlConnection(connStr);
conn.Open();
var cmd = new NpgsqlCommand(@"
    CREATE TABLE IF NOT EXISTS ""__EFMigrationsHistory"" (
        ""MigrationId"" character varying(150) NOT NULL,
        ""ProductVersion"" character varying(32) NOT NULL,
        CONSTRAINT ""PK___EFMigrationsHistory"" PRIMARY KEY (""MigrationId"")
    );
    INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"") VALUES ('20260626042916_InitialCreate', '8.0.2') ON CONFLICT DO NOTHING;
", conn);
cmd.ExecuteNonQuery();
Console.WriteLine("History updated.");
