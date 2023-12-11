// user.go

package main

// import all the necessary packages
import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// User represents a user in the system
type User struct {
	UserID         int    `json:"UserID"`
	FirstName      string `json:"FirstName"`
	LastName       string `json:"LastName"`
	MobileNumber   string `json:"MobileNumber"`
	EmailAddress   string `json:"EmailAddress"`
	UserPassword   string `json:"UserPassword"`
	DriverLicense  sql.NullString `json:"DriverLicense,omitempty"`
	CarPlateNumber sql.NullString `json:"CarPlateNumber,omitempty"`
	CreationDate   string `json:"CreationDate"`
	LastUpdate     string `json:"LastUpdate"`
	DeletionDate   sql.NullString `json:"DeletionDate,omitempty"`
	UserType       string `json:"UserType"`
}

// db is the database connection pool
var db *sql.DB

// main handles the connection to the database server and initializes the router for the API requests
func main() {
	// Connect to the database server
    var err error
    db, err = sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/CAR_POOL")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Initialize the router
    router := mux.NewRouter()

    // Register the API endpoints with the router
    router.HandleFunc("/api/v1/users/{userID}", getUserData).Methods("GET")
    router.HandleFunc("/api/v1/users", createUser).Methods("POST")
    router.HandleFunc("/api/v1/users/{userID}", updateUser).Methods("PUT", "OPTIONS")
    router.HandleFunc("/api/v1/authenticate", authenticateUser).Methods("POST")

    // Create a new CORS handler
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:3000"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowCredentials: true,
        Debug:            true,
    })

    // Use the CORS handler with the router
    handler := c.Handler(router)

    // Start the server
    fmt.Println("Listening at port 5000")
    log.Fatal(http.ListenAndServe(":5000", handler))
}

// getUserData handles the retrieval of user data
func getUserData(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the request parameters
	params := mux.Vars(r)
	userID := params["userID"]

	// Query the database to get user data based on the provided user ID
	var userData User
	err := db.QueryRow("SELECT * FROM CarPoolUser WHERE UserID = ?", userID).
		Scan(&userData.UserID, &userData.FirstName, &userData.LastName, &userData.MobileNumber,
			&userData.EmailAddress, &userData.UserPassword, &userData.DriverLicense,
			&userData.CarPlateNumber, &userData.CreationDate, &userData.LastUpdate,
			&userData.DeletionDate, &userData.UserType)
	if err != nil {
		// Handle errors appropriately
		fmt.Println(err)
		http.Error(w, "Error fetching user data", http.StatusInternalServerError)
		return
	}

	// Convert user data to JSON and write it to the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userData)
}

// createUser handles the creation of user accounts
func createUser(w http.ResponseWriter, r *http.Request) {
	// Decode the request body into a User struct
	var newUser User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	// Perform validation and store user in the database
	result, err := db.Exec(
		"INSERT INTO CarPoolUser (FirstName, LastName, MobileNumber, EmailAddress, UserPassword, DriverLicense, CarPlateNumber, CreationDate, LastUpdate, UserType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		newUser.FirstName, newUser.LastName, newUser.MobileNumber, newUser.EmailAddress, newUser.UserPassword, newUser.DriverLicense, newUser.CarPlateNumber, newUser.CreationDate, newUser.LastUpdate, newUser.UserType,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	// Get the last inserted ID
	lastInsertID, err := result.LastInsertId()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	// Update the user ID in the newUser struct
	newUser.UserID = int(lastInsertID)

	// Return a response with the user ID
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"UserID": lastInsertID,
		"User":   newUser,
	})
}


// updateUser handles the update of user accounts
func updateUser(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the request parameters
	params := mux.Vars(r)
	userID := params["userID"]

	// Decode the request body into a User struct
	var updatedUser User
	err := json.NewDecoder(r.Body).Decode(&updatedUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	// Perform validation and update user in the database
	_, err = db.Exec(
		"UPDATE CarPoolUser SET FirstName=?, LastName=?, MobileNumber=?, EmailAddress=?, UserPassword=?, DriverLicense=?, CarPlateNumber=?, CreationDate=?, LastUpdate=?, DeletionDate=?, UserType=? WHERE UserID=?",
		updatedUser.FirstName, updatedUser.LastName, updatedUser.MobileNumber, updatedUser.EmailAddress, updatedUser.UserPassword, updatedUser.DriverLicense, updatedUser.CarPlateNumber, updatedUser.CreationDate, updatedUser.LastUpdate, updatedUser.DeletionDate, updatedUser.UserType, userID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	// Return a response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedUser)
}

// authenticateUser authenticates a user and returns the user ID, user type, first name, and a response code
func authenticateUser(w http.ResponseWriter, r *http.Request) {
	// Decode the request body into a struct
    var credentials struct {
        EmailAddress string `json:"EmailAddress"`
        UserPassword string `json:"UserPassword"`
    }
    err := json.NewDecoder(r.Body).Decode(&credentials)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Query the database to check if the user exists and get UserID, UserType, and FirstName
    var userID int
    var userType, firstName string
    err = db.QueryRow("SELECT UserID, UserType, FirstName FROM CarPoolUser WHERE EmailAddress = ? AND UserPassword = ?", credentials.EmailAddress, credentials.UserPassword).Scan(&userID, &userType, &firstName)
    if err != nil {
        if err == sql.ErrNoRows {
            // User not found or incorrect password
            jsonResponse(w, http.StatusUnauthorized, map[string]interface{}{"Message": "Invalid email or password"})
        } else {
            // Other database error
            jsonResponse(w, http.StatusInternalServerError, map[string]interface{}{"Message": "Internal server error"})
        }
        return
    }

    // Authentication successful
    response := map[string]interface{}{"UserID": userID, "UserType": userType, "FirstName": firstName, "Message": "Authenticated successfully"}
    jsonResponse(w, http.StatusOK, response)
}


// jsonResponse writes a JSON response with the given status code and data
func jsonResponse(w http.ResponseWriter, statusCode int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)

    if err := json.NewEncoder(w).Encode(data); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}