package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	stringConnectioUrl := "root:12345678@/dailyorganize?charset=utf8&parseTime=True&loc=Local"
	db, erro := sql.Open("mysql", stringConnectioUrl)
	if erro != nil {
		log.Fatal(erro)
	}
	defer db.Close()

	if erro = db.Ping(); erro != nil {
		log.Fatal(erro)
	}

	fmt.Println("Conected on data base.")

}
