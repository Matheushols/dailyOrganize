package server

import (
	"dailyorganize/databaseaplication"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

type task struct {
	ID          uint32    `json: "id"`
	DataAndHour time.Time `json: "dataAndHour"`
	Title       string    `json: "title"`
	Description string    `json: "description"`
	IsFinished  bool      `json: "isFinished"`
}

type taskType struct {
	ID          uint32 `json: "id"`
	Description string `json: "description"`
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

// List the tasks
func ListTask(w http.ResponseWriter, r *http.Request) {
	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}
	defer db.Close()

	lines, erro := db.Query("select * from dailytasks")
	if erro != nil {
		w.Write([]byte("Error to execute query."))
		return
	}
	defer lines.Close()

	var tasks []task
	for lines.Next() {
		var task task

		if erro := lines.Scan(&task.ID, &task.DataAndHour, &task.Title, &task.Description, &task.IsFinished); erro != nil {
			w.Write([]byte("Error to get tasks."))
			return
		}

		tasks = append(tasks, task)
	}

	w.WriteHeader(http.StatusOK)
	if erro := json.NewEncoder(w).Encode(tasks); erro != nil {
		w.Write([]byte("Error to convert tasks in to JSON."))
		return
	}
}

// Search an specific task by id
func SearchTask(w http.ResponseWriter, r *http.Request) {
	parameters := mux.Vars(r)

	ID, erro := strconv.ParseUint(parameters["id"], 10, 32)
	if erro != nil {
		w.Write([]byte("Error to converte parameter to a integer number."))
		return
	}

	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}
	defer db.Close()

	lines, erro := db.Query("select * from dailytasks where id = ?", ID)
	if erro != nil {
		w.Write([]byte("Error when execute query to get specific task."))
		return
	}
	defer lines.Close()

	var task task
	if lines.Next() {
		if erro := lines.Scan(&task.ID, &task.DataAndHour, &task.Title, &task.Description, &task.IsFinished); erro != nil {
			w.Write([]byte("Error to get tasks."))
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	if erro := json.NewEncoder(w).Encode(task); erro != nil {
		w.Write([]byte("Error to convert tasks in to JSON."))
		return
	}
}

// Edit an specific task by id
func EditTask(w http.ResponseWriter, r *http.Request) {
	parameters := mux.Vars(r)

	ID, erro := strconv.ParseUint(parameters["id"], 10, 32)
	if erro != nil {
		w.Write([]byte("Error to converte parameter to a integer number."))
		return
	}

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
		w.Write([]byte("Error to conect on database,"))
	}
	defer db.Close()

	statement, erro := db.Prepare("update dailytasks set dataAndHour = ?, title = ?, description = ?, isFinished = ? where id = ?")
	if erro != nil {
		w.Write([]byte("Error when execute query to update an specific task."))
		return
	}
	defer statement.Close()

	if _, erro := statement.Exec(task.DataAndHour, task.Title, task.Description, task.IsFinished, ID); erro != nil {
		w.Write([]byte("Error when update an task!"))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Delete an specific task by id
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	parameters := mux.Vars(r)

	ID, erro := strconv.ParseUint(parameters["id"], 10, 32)
	if erro != nil {
		w.Write([]byte("Error to converte parameter to a integer number."))
		return
	}

	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database,"))
	}
	defer db.Close()

	statement, erro := db.Prepare("delete from dailytasks where id = ?")
	if erro != nil {
		w.Write([]byte("Error when execute query to delete an specific task."))
		return
	}
	defer statement.Close()

	if _, erro := statement.Exec(ID); erro != nil {
		w.Write([]byte("Erro when delete an task!"))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Create a task type
func CreateTaskType(w http.ResponseWriter, r *http.Request) {
	requestBody, erro := ioutil.ReadAll(r.Body)
	if erro != nil {
		w.Write([]byte("Fail on read body of the request."))
		return
	}

	var taskType taskType
	if erro = json.Unmarshal(requestBody, &taskType); erro != nil {
		w.Write([]byte("Erro to convert task to struct."))
		return
	}

	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}

	statement, erro := db.Prepare("insert into type (description) values (?)")
	if erro != nil {
		w.Write([]byte("Error to create statement"))
		return
	}
	defer statement.Close()

	insert, erro := statement.Exec(taskType.Description)
	if erro != nil {
		w.Write([]byte("Error to execute statement."))
		return
	}

	idInserted, erro := insert.LastInsertId()
	if erro != nil {
		w.Write([]byte("Error to get the id included."))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Task Type sucesseful created! Id: %d", idInserted)))
}

// List the tasks types
func ListTaskType(w http.ResponseWriter, r *http.Request) {
	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}
	defer db.Close()

	lines, erro := db.Query("select * from type")
	if erro != nil {
		w.Write([]byte("Error to execute query."))
		return
	}
	defer lines.Close()

	var tasksTypes []taskType
	for lines.Next() {
		var taskType taskType

		if erro := lines.Scan(&taskType.ID, &taskType.Description); erro != nil {
			w.Write([]byte("Error to get tasks."))
			return
		}

		tasksTypes = append(tasksTypes, taskType)
	}

	w.WriteHeader(http.StatusOK)
	if erro := json.NewEncoder(w).Encode(tasksTypes); erro != nil {
		w.Write([]byte("Error to convert tasks in to JSON."))
		return
	}
}

// Search an specific task type by id
func SearchTaskType(w http.ResponseWriter, r *http.Request) {
	parameters := mux.Vars(r)

	ID, erro := strconv.ParseUint(parameters["id"], 10, 32)
	if erro != nil {
		w.Write([]byte("Error to converte parameter to a integer number."))
		return
	}

	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}
	defer db.Close()

	lines, erro := db.Query("select * from type where id = ?", ID)
	if erro != nil {
		w.Write([]byte("Error when execute query to get specific task type."))
		return
	}
	defer lines.Close()

	var taskType taskType
	if lines.Next() {
		if erro := lines.Scan(&taskType.ID, &taskType.Description); erro != nil {
			w.Write([]byte("Error to get tasks type."))
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	if erro := json.NewEncoder(w).Encode(taskType); erro != nil {
		w.Write([]byte("Error to convert tasks in to JSON."))
		return
	}
}

// Edit an specific task type by id
func EditTaskType(w http.ResponseWriter, r *http.Request) {
	parameters := mux.Vars(r)

	ID, erro := strconv.ParseUint(parameters["id"], 10, 32)
	if erro != nil {
		w.Write([]byte("Error to converte parameter to a integer number."))
		return
	}

	requestBody, erro := ioutil.ReadAll(r.Body)
	if erro != nil {
		w.Write([]byte("Fail on read body of the request."))
		return
	}

	var taskType taskType
	if erro = json.Unmarshal(requestBody, &taskType); erro != nil {
		w.Write([]byte("Erro to convert task type to struct."))
		return
	}

	db, erro := databaseaplication.Conect()
	if erro != nil {
		w.Write([]byte("Error to conect on database"))
	}
	defer db.Close()

	statement, erro := db.Prepare("update type set description = ? where id = ?")
	if erro != nil {
		w.Write([]byte("Error when execute query to update an specific task type."))
		return
	}
	defer statement.Close()

	if _, erro := statement.Exec(taskType.Description, ID); erro != nil {
		w.Write([]byte("Error when update an task type!"))
		return
	}

	w.WriteHeader(http.StatusNoContent)

}
