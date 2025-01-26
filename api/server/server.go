package server

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/Matheushols/dailyorganize/database/database"
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

	db, erro := database.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}

	fmt.Print(db)
}
