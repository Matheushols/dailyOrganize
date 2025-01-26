package databaseaplication

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql" // Driver to conection
)

// Conect open the conection with database
func Conect() (*sql.DB, error) {
	stringConnectioUrl := "root:12345678@/dailyorganize?charset=utf8&parseTime=True&loc=Local"

	db, erro := sql.Open("mysql", stringConnectioUrl)
	if erro != nil {
		return nil, erro
	}

	if erro = db.Ping(); erro != nil {
		return nil, erro
	}

	return db, nil
}
