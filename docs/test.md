# Testing instructions

## Requirements

Spiral tests are written in CoffeScript for better readibility. You should have it installed with `npm install -g coffee-script`.

To test routng system you should have MySQL database running with `test_spiral` database already created. Tests are using enviroment variable `USER` to log in. This user account should:

* be stored without any password

```sql
CREATE USER 'jeffrey'@'localhost';
```

* have administrative rights (should be able to create and delete tables)

```sql
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
```
