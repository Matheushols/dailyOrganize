package main

import (
	"fmt"
	"log"
	"net/http"

	"dailyorganize/api/server"

	"github.com/gorilla/mux"
)

func main() {

	router := mux.NewRouter()

	router.HandleFunc("/tasks", server.CreateTask).Methods(http.MethodPost)
	router.HandleFunc("/tasks", server.ListTask).Methods(http.MethodGet)
	router.HandleFunc("/tasks/{id}", server.SearchTask).Methods(http.MethodGet)
	router.HandleFunc("/tasks/{id}", server.EditTask).Methods(http.MethodPut)
	router.HandleFunc("/tasks/{id}", server.DeleteTask).Methods(http.MethodDelete)

	fmt.Println("Conected on 5000 port.")
	log.Fatal(http.ListenAndServe(":5000", router))
}
