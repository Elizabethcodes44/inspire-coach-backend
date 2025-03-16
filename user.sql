SELECT * FROM dbo.Users;
SELECT name, type_desc 
FROM sys.database_principals 
WHERE type IN ('S','U','R');