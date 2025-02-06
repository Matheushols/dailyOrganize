package main

import (
	"fmt"
	"log"
	"net/http"

	"dailyorganize/api/server"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {

	router := mux.NewRouter()

	router.HandleFunc("/tasks", server.CreateTask).Methods(http.MethodPost)
	router.HandleFunc("/tasks", server.ListTask).Methods(http.MethodGet)
	router.HandleFunc("/tasks/{id}", server.SearchTask).Methods(http.MethodGet)
	router.HandleFunc("/tasks/{id}", server.EditTask).Methods(http.MethodPut)
	router.HandleFunc("/tasks/{id}", server.DeleteTask).Methods(http.MethodDelete)

	router.HandleFunc("/taskstype", server.CreateTaskType).Methods(http.MethodPost)
	router.HandleFunc("/taskstype", server.ListTaskType).Methods(http.MethodGet)
	router.HandleFunc("/taskstype/{id}", server.SearchTaskType).Methods(http.MethodGet)
	router.HandleFunc("/taskstype/{id}", server.EditTaskType).Methods(http.MethodPut)
	router.HandleFunc("/taskstype/{id}", server.DeleteTaskType).Methods(http.MethodDelete)

	// Adiciona o middleware CORS para permitir requisições de http://localhost:3000
	corsAllowed := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3001"}),         // Permite requisições da origem http://localhost:3000
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),  // Permite métodos específicos
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}), // Permite cabeçalhos específicos
	)

	fmt.Println("Conected on 5000 port.")
	log.Fatal(http.ListenAndServe(":5000", corsAllowed(router)))
}
