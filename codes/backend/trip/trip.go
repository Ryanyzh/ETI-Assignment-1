// trip.go

package main

// import the necessary packages
import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Trip represents a car-pooling trip
type Trip struct {
	TripID               int            `json:"TripID"`
	UserID               int            `json:"UserID"`
	PickupAddress        string         `json:"PickupAddress"`
	AltPickupAddress     string         `json:"AltPickupAddress"`
	StartDateTime        string         `json:"StartDateTime"`
	DestinationAddress   string         `json:"DestinationAddress"`
	AvailableSeats       int            `json:"AvailableSeats"`
	TripStatus           string         `json:"TripStatus"`
	PublishDate          string         `json:"PublishDate"`
	EstimatedEndDateTime sql.NullString `json:"EstimatedEndDateTime,omitempty"`
	TripDuration         int            `json:"TripDuration"`
	CompletedDateTime    sql.NullString `json:"CompletedDateTime,omitempty"`
}

// Booking represents the booking of a passenger in a trip
type Booking struct {
	BookingID       int    `json:"BookingID"`
	TripID          int    `json:"TripID"`
	PassengerID     int    `json:"PassengerID"`
	BookingDateTime string `json:"BookingDateTime"`
}

// TripWithDriverInfo represents a car-pooling trip with driver information
type TripWithDriverInfo struct {
	Trip
	DriverFirstName string `json:"DriverFirstName"`
	DriverLastName  string `json:"DriverLastName"`
	DriverMobile    string `json:"DriverMobile"`
}

// db is the database connection pool
var db *sql.DB

// main handles the connection to the database server and initializes the router for the API requests (entry point to the application)
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
	router.HandleFunc("/api/v1/trips", publishNewTrip).Methods("POST")
	router.HandleFunc("/api/v1/trips", getAvailableTrips).Methods("GET")
	router.HandleFunc("/api/v1/passengerbookedtrips/{userID}", getPassengerBookedTrips).Methods("GET")
	router.HandleFunc("/api/v1/carownerbookedtrips/{userID}", getCarOwnerBookedTrips).Methods("GET")
	router.HandleFunc("/api/v1/startedtrips/{userID}", getStartedTrips).Methods("GET")
	router.HandleFunc("/api/v1/completedtrips/{userID}", getCompletedTrips).Methods("GET")
	router.HandleFunc("/api/v1/trips/{tripID}", updateTrip).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/v1/bookings/{userID}/{tripID}", makeBooking).Methods("POST")

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
	fmt.Println("Listening at port 5001")
	log.Fatal(http.ListenAndServe(":5001", handler))
}

// publishNewTrip handles the creation of a new trip
func publishNewTrip(w http.ResponseWriter, r *http.Request) {
	// Extract trip details from the request body
	var newTrip Trip
	err := json.NewDecoder(r.Body).Decode(&newTrip)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("1", err)
		return
	}

	// Perform validation and store trip in the database
	_, err = db.Exec(
		"INSERT INTO CarPoolTrip (UserID, PickupAddress, AltPickupAddress, StartDateTime, DestinationAddress, AvailableSeats, TripStatus, PublishDate, EstimatedEndDateTime, TripDuration, CompletedDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		newTrip.UserID, newTrip.PickupAddress, newTrip.AltPickupAddress, newTrip.StartDateTime, newTrip.DestinationAddress, newTrip.AvailableSeats, newTrip.TripStatus, newTrip.PublishDate, newTrip.EstimatedEndDateTime, newTrip.TripDuration, newTrip.CompletedDateTime,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("2", err)
		return
	}

	// Return a response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTrip)
}

// updateTrip handles the update of an existing trip
func updateTrip(w http.ResponseWriter, r *http.Request) {
	// Extract trip ID from the request parameters
	params := mux.Vars(r)
	tripID := params["tripID"]

	// Decode the updated trip details from the request body into a struct
	var updatedTrip Trip
	err := json.NewDecoder(r.Body).Decode(&updatedTrip)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("1", err)
		return
	}

	// print out the updated trip
	fmt.Println(updatedTrip)

	// Perform validation and update trip in the database
	_, err = db.Exec(
		"UPDATE CarPoolTrip SET UserID=?, PickupAddress=?, AltPickupAddress=?, StartDateTime=?, DestinationAddress=?, AvailableSeats=?, TripStatus=?, PublishDate=?, EstimatedEndDateTime=?, TripDuration=?, CompletedDateTime=? WHERE TripID=?",
		updatedTrip.UserID, updatedTrip.PickupAddress, updatedTrip.AltPickupAddress,
		updatedTrip.StartDateTime, updatedTrip.DestinationAddress, updatedTrip.AvailableSeats, updatedTrip.TripStatus, updatedTrip.PublishDate, updatedTrip.EstimatedEndDateTime, updatedTrip.TripDuration, updatedTrip.CompletedDateTime, tripID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("2", err)
		return
	}

	// Return a response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedTrip)
}

// getAvailableTrips handles the retrieval of available trips
func getAvailableTrips(w http.ResponseWriter, r *http.Request) {
	// Retrieve the destination address from the query string
	destinationAddress := r.URL.Query().Get("destinationAddress")

	// Construct the SQL query based on the partial search for destination address
	query := `
        SELECT 
            ct.TripID, ct.UserID, ct.PickupAddress, ct.AltPickupAddress,
            ct.StartDateTime, ct.DestinationAddress, ct.AvailableSeats, ct.TripStatus, ct.PublishDate, ct.EstimatedEndDateTime, ct.TripDuration, ct.CompletedDateTime,
            cu.FirstName AS DriverFirstName, cu.LastName AS DriverLastName, cu.MobileNumber AS DriverMobile
        FROM CarPoolTrip ct
        JOIN CarPoolUser cu ON ct.UserID = cu.UserID
        WHERE ct.TripStatus = 'created' AND ct.AvailableSeats > 0`

	// Add condition for the partial search on destination address
	if destinationAddress != "" {
		query += fmt.Sprintf(" AND ct.DestinationAddress LIKE '%%%s%%'", destinationAddress)
	}

	// Retrieve available trips with driver information from the database
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("1", err)
		return
	}
	defer rows.Close()

	// Add the data into the struct
	var trips []TripWithDriverInfo
	for rows.Next() {
		var tripWithDriverInfo TripWithDriverInfo
		err := rows.Scan(
			&tripWithDriverInfo.TripID, &tripWithDriverInfo.UserID, &tripWithDriverInfo.PickupAddress, &tripWithDriverInfo.AltPickupAddress,
			&tripWithDriverInfo.StartDateTime, &tripWithDriverInfo.DestinationAddress, &tripWithDriverInfo.AvailableSeats,
			&tripWithDriverInfo.TripStatus, &tripWithDriverInfo.PublishDate,
			&tripWithDriverInfo.EstimatedEndDateTime, &tripWithDriverInfo.TripDuration,
			&tripWithDriverInfo.CompletedDateTime,
			&tripWithDriverInfo.DriverFirstName, &tripWithDriverInfo.DriverLastName, &tripWithDriverInfo.DriverMobile,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			fmt.Println("2", err)
			return
		}

		// Convert StartDateTime to time.Time
		tripStartDateTime, err := time.Parse("2006-01-02 15:04:05", tripWithDriverInfo.StartDateTime)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			fmt.Println("3", err)
			return
		}

		// Load the Singapore time zone
		location, err := time.LoadLocation("Asia/Singapore")
		if err != nil {
			// Handle error
		}

		// Convert the local trip start time to Singapore time
		tripStartDateTimeSingapore := tripStartDateTime.In(location)

		// Get the current time in Singapore time
		nowSingapore := time.Now().In(location)

		// Subtract 8 hours from the UTC time to get the time in Singapore time
		tripStartDateTimeSingapore = tripStartDateTimeSingapore.Add(-8 * time.Hour)

		// Check if StartDateTime is after the current time in Singapore time
		if tripStartDateTimeSingapore.After(nowSingapore) {
			trips = append(trips, tripWithDriverInfo)
		} else {

		}
	}

	// Return a response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(trips)
}

// Function to get booked trips for a specific passenger
func getPassengerBookedTrips(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from the request parameters
	params := mux.Vars(r)
	userID := params["userID"]

	// Construct the SQL query
	query := `
		SELECT 
			ct.*, cu.FirstName AS CarOwnerFirstName, cu.LastName AS CarOwnerLastName
		FROM CarPoolTrip ct
		JOIN CarPoolUser cu ON ct.UserID = cu.UserID
		WHERE ct.TripID IN (SELECT TripID FROM CarPoolBooking WHERE PassengerID = ?)`

	// Retrieve booked trips for a specific passenger from the database
	rows, err := db.Query(query, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		// print out the error
		fmt.Println(err)
		return
	}
	defer rows.Close()

	// TripWithCarOwner represents trip details with car owner information
	type TripWithCarOwner struct {
		TripID               int            `json:"TripID"`
		UserID               int            `json:"UserID"`
		PickupAddress        string         `json:"PickupAddress"`
		AltPickupAddress     string         `json:"AltPickupAddress"`
		StartDateTime        string         `json:"StartDateTime"`
		DestinationAddress   string         `json:"DestinationAddress"`
		AvailableSeats       int            `json:"AvailableSeats"`
		TripStatus           string         `json:"TripStatus"`
		PublishDate          string         `json:"PublishDate"`
		EstimatedEndDateTime sql.NullString `json:"EstimatedEndDateTime"`
		TripDuration         string         `json:"TripDuration"`
		CompletedDateTime    sql.NullString `json:"CompletedDateTime"`
		CarOwnerFirstName    string         `json:"CarOwnerFirstName"`
		CarOwnerLastName     string         `json:"CarOwnerLastName"`
	}
	var trips []TripWithCarOwner

	// Add the data into the struct
	for rows.Next() {
		var trip TripWithCarOwner
		err := rows.Scan(
			&trip.TripID, &trip.UserID, &trip.PickupAddress, &trip.AltPickupAddress,
			&trip.StartDateTime, &trip.DestinationAddress, &trip.AvailableSeats, &trip.TripStatus, &trip.PublishDate,
			&trip.EstimatedEndDateTime, &trip.TripDuration, &trip.CompletedDateTime,
			&trip.CarOwnerFirstName, &trip.CarOwnerLastName,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			// print out the error
			fmt.Println(err)
			return
		}
		trips = append(trips, trip)
	}

	// Return a response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(trips)
}

// Function to get booked trips for a specific car owner with passenger details
func getCarOwnerBookedTrips(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from the request parameters
	params := mux.Vars(r)
	userID := params["userID"]

	// Retrieve booked trips for a specific car owner with passenger details from the database
	rows, err := db.Query(`
	SELECT 
		ct.TripID, ct.UserID, ct.PickupAddress, ct.AltPickupAddress,
		ct.StartDateTime, ct.DestinationAddress, ct.AvailableSeats, ct.TripStatus, ct.PublishDate,
		ct.EstimatedEndDateTime, ct.TripDuration, ct.CompletedDateTime,
		cu.UserID AS PassengerID, cu.FirstName AS PassengerFirstName, cu.LastName AS PassengerLastName, cu.MobileNumber AS PassengerMobileNumber
	FROM CarPoolTrip ct
	JOIN CarPoolBooking cb ON ct.TripID = cb.TripID
	JOIN CarPoolUser cu ON cb.PassengerID = cu.UserID
	WHERE ct.UserID = ?`, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		// print out the error
		fmt.Println("1", err)
		return
	}
	defer rows.Close()

	// Passenger represents passenger information
	type Passenger struct {
		PassengerID           int    `json:"PassengerID"`
		PassengerFirstName    string `json:"PassengerFirstName"`
		PassengerLastName     string `json:"PassengerLastName"`
		PassengerMobileNumber string `json:"PassengerMobileNumber"`
	}

	// TripWithPassenger represents trip details with passenger information
	type TripWithPassenger struct {
		TripID               int            `json:"TripID"`
		UserID               int            `json:"UserID"`
		PickupAddress        string         `json:"PickupAddress"`
		AltPickupAddress     string         `json:"AltPickupAddress"`
		StartDateTime        string         `json:"StartDateTime"`
		DestinationAddress   string         `json:"DestinationAddress"`
		AvailableSeats       int            `json:"AvailableSeats"`
		TripStatus           string         `json:"TripStatus"`
		PublishDate          string         `json:"PublishDate"`
		EstimatedEndDateTime sql.NullString `json:"EstimatedEndDateTime"`
		TripDuration         string         `json:"TripDuration"`
		CompletedDateTime    sql.NullString `json:"CompletedDateTime"`
		Passengers           []Passenger    `json:"Passengers"`
	}
	var tripsMap = make(map[int]*TripWithPassenger)

	// Add the data into the struct
	for rows.Next() {
		var tripID int
		var trip TripWithPassenger
		var passenger Passenger
		err := rows.Scan(
			&tripID, &trip.UserID, &trip.PickupAddress, &trip.AltPickupAddress,
			&trip.StartDateTime, &trip.DestinationAddress, &trip.AvailableSeats, &trip.TripStatus, &trip.PublishDate, &trip.EstimatedEndDateTime, &trip.TripDuration, &trip.CompletedDateTime,
			&passenger.PassengerID, &passenger.PassengerFirstName, &passenger.PassengerLastName, &passenger.PassengerMobileNumber,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			// print out the error
			fmt.Println("2", err)
			return
		}

		// Check if the trip is already in the map
		if _, exists := tripsMap[tripID]; exists {
			// Append passenger to existing trip
			tripsMap[tripID].Passengers = append(tripsMap[tripID].Passengers, passenger)
		} else {
			// Create a new trip and add passenger
			trip.TripID = tripID
			trip.Passengers = append(trip.Passengers, passenger)
			tripsMap[tripID] = &trip
		}
	}

	// Convert the map to a slice
	var trips []TripWithPassenger
	for _, trip := range tripsMap {
		trips = append(trips, *trip)
	}

	// Return a response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(trips)
}

// getStartedTrips to get started trips for a specific user
func getStartedTrips(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from the request parameters
	params := mux.Vars(r)
	userID := params["userID"]

	// Retrieve started trips for a specific user from the database
	rows, err := db.Query("SELECT * FROM CarPoolTrip WHERE TripStatus = 'started' AND UserID = ?", userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var trips []Trip

	// Add the data into the struct
	for rows.Next() {
		var trip Trip
		err := rows.Scan(
			&trip.TripID, &trip.UserID, &trip.PickupAddress, &trip.AltPickupAddress,
			&trip.StartDateTime, &trip.DestinationAddress, &trip.AvailableSeats, &trip.TripStatus, &trip.PublishDate,
			&trip.EstimatedEndDateTime, &trip.TripDuration, &trip.CompletedDateTime,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		trips = append(trips, trip)
	}

	// Return a response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(trips)
}

// getCompletedTrips to get completed trips for a specific user
func getCompletedTrips(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from the request parameters
	params := mux.Vars(r)
	userID := params["userID"]

	// Retrieve completed trips for a specific user from the database
	rows, err := db.Query(`
	SELECT 
		ct.*, cu.FirstName AS DriverFirstName, cu.LastName AS DriverLastName, cb.PassengerID AS PassengerID
	FROM CarPoolTrip ct
	JOIN CarPoolBooking cb ON ct.TripID = cb.TripID
	JOIN CarPoolUser cu ON ct.UserID = cu.UserID
	WHERE ct.TripStatus = 'completed' AND cb.PassengerID = ?
	ORDER BY ct.CompletedDateTime DESC`, userID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("1", err)
		return
	}
	defer rows.Close()

	// TripWithPassenger represents trip details with passenger and driver information
	type TripWithPassenger struct {
		TripID               int    `json:"TripID"`
		UserID               int    `json:"UserID"`
		PickupAddress        string `json:"PickupAddress"`
		AltPickupAddress     string `json:"AltPickupAddress"`
		StartDateTime        string `json:"StartDateTime"`
		DestinationAddress   string `json:"DestinationAddress"`
		AvailableSeats       int    `json:"AvailableSeats"`
		TripStatus           string `json:"TripStatus"`
		PublishDate          string `json:"PublishDate"`
		EstimatedEndDateTime string `json:"EstimatedEndDateTime"`
		TripDuration         string `json:"TripDuration"`
		CompletedDateTime    string `json:"CompletedDateTime"`
		PassengerID          int    `json:"PassengerID"`
		DriverFirstName      string `json:"DriverFirstName"`
		DriverLastName       string `json:"DriverLastName"`
	}

	// Add the data into the struct
	var trips []TripWithPassenger
	for rows.Next() {
		var trip TripWithPassenger
		err := rows.Scan(
			&trip.TripID, &trip.UserID, &trip.PickupAddress, &trip.AltPickupAddress, &trip.StartDateTime, &trip.DestinationAddress, &trip.AvailableSeats, &trip.TripStatus, &trip.PublishDate, &trip.EstimatedEndDateTime, &trip.TripDuration, &trip.CompletedDateTime, &trip.DriverFirstName, &trip.DriverLastName, &trip.PassengerID,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			fmt.Println("2", err)
			return
		}
		trips = append(trips, trip)
	}

	// Return a response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(trips)
}

// makeBooking handles the creation of a new booking
func makeBooking(w http.ResponseWriter, r *http.Request) {
	// Extract user and trip IDs from the request parameters
	params := mux.Vars(r)
	userID := params["userID"]
	tripID := params["tripID"]

	// Parse user and trip IDs to integers
	userIDInt, err := strconv.Atoi(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	tripIDInt, err := strconv.Atoi(tripID)
	if err != nil {
		http.Error(w, "Invalid trip ID", http.StatusBadRequest)
		return
	}

	// Create a new booking record with the current date and time
	booking := Booking{
		TripID:          tripIDInt,
		PassengerID:     userIDInt,
		BookingDateTime: time.Now().Format("2006-01-02 15:04:05"),
	}

	// Perform validation and store the booking in the database
	_, err = db.Exec(
		"INSERT INTO CarPoolBooking (TripID, PassengerID, BookingDateTime) VALUES (?, ?, ?)",
		booking.TripID, booking.PassengerID, booking.BookingDateTime,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return a response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(booking)
}
