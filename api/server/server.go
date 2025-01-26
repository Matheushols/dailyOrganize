package server

import (
	"dailyorganize/databaseaplication"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type task struct {
	ID          uint32    `json: "id"`
	DataAndHour time.Time `json: "dataAndHour"`
	Title       string    `json: "title"`
	Description string    `json: "description"`
	IsFinished  bool      `json: "isFinished"`
}

// Create a task
func CreateTask(w http.ResponseWriter, r *http.Request) {
	requestBody, erro := ioutil.ReadAll(r.Body)
	if erro != nil {
		w.Write([]byte("Fail on read body of the request."))
		return
	}

	var task task
	if erro = json.Unmarshal(requestBody, &task); erro != nil {
		w.Write([]byte("Erro to convert task to struct."))
		return
	}

	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}

	statement, erro := db.Prepare("insert into dailytasks (dataAndHour, title, description, isFinished) values (?, ?, ?, ?)")
	if erro != nil {
		w.Write([]byte("Error to create statement"))
		return
	}
	defer statement.Close()

	insert, erro := statement.Exec(task.DataAndHour, task.Title, task.Description, task.IsFinished)
	if erro != nil {
		w.Write([]byte("Error to execute statement."))
		return
	}

	idInserted, erro := insert.LastInsertId()
	if erro != nil {
		w.Write([]byte("Error to get the id included."))
		return
	}

	w.Write([]byte(fmt.Sprintf("Task sucesseful created! Id: %d", idInserted)))
}
