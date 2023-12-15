-- Create the CAR_POOL database
CREATE DATABASE IF NOT EXISTS CAR_POOL;

USE CAR_POOL;
DROP TABLE CarPoolBooking;
USE CAR_POOL;
DROP TABLE CarPoolTrip;
USE CAR_POOL;
DROP TABLE CarPoolUser;


USE CAR_POOL;
-- Create the User Table
CREATE TABLE IF NOT EXISTS CarPoolUser (
    UserID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    MobileNumber VARCHAR(50) NOT NULL,
    EmailAddress VARCHAR(100) NOT NULL,
    UserPassword VARCHAR(255) NOT NULL, 
    DriverLicense VARCHAR(20),
    CarPlateNumber VARCHAR(15),
    CreationDate VARCHAR(50) NOT NULL,
    LastUpdate VARCHAR(50) NOT NULL,
    DeletionDate VARCHAR(50),
    UserType ENUM('passenger', 'car owner') NOT NULL
);

-- Create the Trip Table
CREATE TABLE IF NOT EXISTS CarPoolTrip (
    TripID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    PickupAddress VARCHAR(100) NOT NULL,
    AltPickupAddress VARCHAR(100),
    StartDateTime VARCHAR(50) NOT NULL,
    DestinationAddress VARCHAR(100) NOT NULL,
    AvailableSeats INT NOT NULL,
    TripStatus ENUM('fully booked', 'cancelled', 'completed', 'created', 'started') NOT NULL,
    PublishDate VARCHAR(50) NOT NULL,
	EstimatedEndDateTime VARCHAR(50), 
	TripDuration INT NOT NULL, 
	CompletedDateTime VARCHAR(50),    
    FOREIGN KEY (UserID) REFERENCES CarPoolUser(UserID)
);

-- Create the Booking Table
CREATE TABLE IF NOT EXISTS CarPoolBooking (
    BookingID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    TripID INT NOT NULL,
    PassengerID INT NOT NULL,
    BookingDateTime VARCHAR(50),
    FOREIGN KEY (BookingID) REFERENCES CarPoolTrip(TripID),
    FOREIGN KEY (PassengerID) REFERENCES CarPoolUser(UserID)
);




-- Insert 10 Passenger Accounts
INSERT INTO CarPoolUser (FirstName, LastName, MobileNumber, EmailAddress, UserPassword, CreationDate, LastUpdate, UserType)
VALUES
('Passenger1_FirstName', 'Passenger1_LastName', '1234567890', 'passenger1@example.com', 'password1', '2023-12-01', '2023-12-01', 'passenger'),
('Passenger2_FirstName', 'Passenger2_LastName', '1234567891', 'passenger2@example.com', 'password2', '2022-11-02', '2023-12-01', 'passenger'),
('Passenger3_FirstName', 'Passenger3_LastName', '1234567892', 'passenger3@example.com', 'password3', '2021-10-03', '2023-12-01', 'passenger'),
('Passenger4_FirstName', 'Passenger4_LastName', '1234567893', 'passenger4@example.com', 'password4', '2022-09-04', '2023-12-01', 'passenger'),
('Passenger5_FirstName', 'Passenger5_LastName', '1234567894', 'passenger5@example.com', 'password5', '2023-08-05', '2023-12-01', 'passenger'),
('Passenger6_FirstName', 'Passenger6_LastName', '1234567895', 'passenger6@example.com', 'password6', '2022-07-06', '2023-12-01', 'passenger'),
('Passenger7_FirstName', 'Passenger7_LastName', '1234567896', 'passenger7@example.com', 'password7', '2021-06-07', '2023-12-01', 'passenger'),
('Passenger8_FirstName', 'Passenger8_LastName', '1234567897', 'passenger8@example.com', 'password8', '2022-05-08', '2023-12-01', 'passenger'),
('Passenger9_FirstName', 'Passenger9_LastName', '1234567898', 'passenger9@example.com', 'password9', '2023-04-09', '2023-12-01', 'passenger'),
('Passenger10_FirstName', 'Passenger10_LastName', '1234567899', 'passenger10@example.com', 'password10', '2023-03-10', '2023-12-01', 'passenger');


-- Insert 10 Car Owner Accounts
INSERT INTO CarPoolUser (FirstName, LastName, MobileNumber, EmailAddress, UserPassword, DriverLicense, CarPlateNumber, CreationDate, LastUpdate, UserType)
VALUES
('CarOwner1_FirstName', 'CarOwner1_LastName', '9876543210', 'carowner1@example.com', 'password11', 'DL123', 'ABC123', '2023-12-01', '2023-12-01', 'car owner'),
('CarOwner2_FirstName', 'CarOwner2_LastName', '9876543211', 'carowner2@example.com', 'password12', 'DL456', 'XYZ789', '2023-11-02', '2023-12-01', 'car owner'),
('CarOwner3_FirstName', 'CarOwner3_LastName', '9876543212', 'carowner3@example.com', 'password13', 'DL789', '123XYZ', '2023-10-03', '2023-12-01', 'car owner'),
('CarOwner4_FirstName', 'CarOwner4_LastName', '9876543213', 'carowner4@example.com', 'password14', 'DL101', '456ABC', '2023-09-04', '2023-12-01', 'car owner'),
('CarOwner5_FirstName', 'CarOwner5_LastName', '9876543214', 'carowner5@example.com', 'password15', 'DL112', '789DEF', '2023-08-05', '2023-12-01', 'car owner'),
('CarOwner6_FirstName', 'CarOwner6_LastName', '9876543215', 'carowner6@example.com', 'password16', 'DL131', '101GHI', '2023-07-06', '2023-12-01', 'car owner'),
('CarOwner7_FirstName', 'CarOwner7_LastName', '9876543216', 'carowner7@example.com', 'password17', 'DL141', '112JKL', '2023-06-07', '2023-12-01', 'car owner'),
('CarOwner8_FirstName', 'CarOwner8_LastName', '9876543217', 'carowner8@example.com', 'password18', 'DL152', '123MNO', '2023-05-08', '2023-12-01', 'car owner'),
('CarOwner9_FirstName', 'CarOwner9_LastName', '9876543218', 'carowner9@example.com', 'password19', 'DL163', '234PQR', '2023-04-09', '2023-12-01', 'car owner'),
('CarOwner10_FirstName', 'CarOwner10_LastName', '9876543219', 'carowner10@example.com', 'password20', 'DL174', '345STU', '2023-03-10', '2023-12-01', 'car owner');


-- Insert data into the Trips table
INSERT INTO CarPoolTrip (UserID, PickupAddress, AltPickupAddress, StartDateTime, DestinationAddress, AvailableSeats, TripStatus, PublishDate, EstimatedEndDateTime, TripDuration, CompletedDateTime)
VALUES
(11, 'Pickup1', 'AltPickup1', '2023-12-15 08:00:00', 'Destination1', 3, 'created', '2023-12-01', '2023-12-15 09:30:00', 90, NULL),
(12, 'Pickup2', 'AltPickup2', '2023-12-10 10:00:00', 'Destination2', 2, 'created', '2023-12-01', '2023-12-10 12:30:00', 150, NULL),
(13, 'Pickup3', 'AltPickup3', '2023-12-15 12:00:00', 'Destination3', 4, 'created', '2023-12-01', '2023-12-15 13:45:00', 105, NULL),
(14, 'Pickup4', 'AltPickup4', '2023-12-20 14:00:00', 'Destination4', 1, 'created', '2023-12-02', '2023-12-20 14:15:00', 135, NULL),
(15, 'Pickup5', 'AltPickup5', '2023-12-25 16:00:00', 'Destination5', 5, 'created', '2023-12-02', '2023-12-25 16:30:00', 30, NULL),
(16, 'Pickup6', 'AltPickup6', '2023-12-08 06:00:00', 'Destination6', 2, 'created', '2023-12-02', '2023-12-08 07:30:00', 90, NULL),
(17, 'Pickup7', 'AltPickup7', '2023-12-12 08:00:00', 'Destination7', 4, 'created', '2023-12-03', '2023-12-12 08:30:00', 30, NULL),
(18, 'Pickup8', 'AltPickup8', '2023-12-18 10:00:00', 'Destination8', 3, 'created', '2023-12-03', '2023-12-18 10:15:00', 15, NULL),
(19, 'Pickup9', 'AltPickup9', '2023-12-22 12:00:00', 'Destination9', 1, 'created', '2023-12-03', '2023-12-22 13:00:00', 60, NULL),
(20, 'Pickup10', 'AltPickup10', '2023-12-28 14:00:00', 'Destination10', 5, 'created', '2023-12-04', '2023-12-28 14:25:00', 25, NULL),
(11, 'Pickup11', 'AltPickup11', '2023-12-12 15:00:00', 'Destination11', 3, 'created', '2023-12-04', '2023-12-12 15:20:00', 20, NULL),
(12, 'Pickup12', 'AltPickup12', '2023-12-14 16:00:00', 'Destination12', 2, 'created', '2023-12-04', '2023-12-14 16:45:00', 45, NULL),
(13, 'Pickup13', 'AltPickup13', '2023-12-16 17:00:00', 'Destination13', 4, 'created', '2023-12-04', '2023-12-16 17:30:00', 30, NULL),
(14, 'Pickup14', 'AltPickup14', '2023-12-20 18:00:00', 'Destination14', 1, 'created', '2023-12-05', '2023-12-20 18:10:00', 10, NULL),
(15, 'Pickup15', 'AltPickup15', '2023-12-15 19:00:00', 'Destination15', 5, 'created', '2023-12-05', '2023-12-15 19:35:00', 35, NULL),
(16, 'Pickup16', 'AltPickup16', '2023-12-20 20:00:00', 'Destination16', 3, 'created', '2023-12-05', '2023-12-20 20:55:00', 55, NULL),
(17, 'Pickup17', 'AltPickup17', '2023-12-25 21:00:00', 'Destination17', 4, 'created', '2023-12-05', '2023-12-25 22:10:00', 70, NULL),
(18, 'Pickup18', 'AltPickup18', '2023-12-28 22:00:00', 'Destination18', 2, 'created', '2023-12-06', '2023-12-28 22:25:00', 25, NULL),
(19, 'Pickup19', 'AltPickup19', '2023-12-30 22:00:00', 'Destination19', 1, 'created', '2023-12-04', '2023-12-30 22:55:00', 55, NULL),
(20, 'Pickup20', 'AltPickup20', '2023-12-31 23:00:00', 'Destination20', 5, 'created', '2023-12-04', '2023-12-31 23:20:00', 20, NULL),
(11, 'PickupABC', 'AltPickupCBA', '2023-12-15 16:45:00', 'DestinationDEF', 3, 'created', '2023-12-14', '2023-12-15 17:45:00', 60, NULL);


-- Insert data into the Trips table with conflicting dates and timings
INSERT INTO CarPoolTrip (UserID, PickupAddress, AltPickupAddress, StartDateTime, DestinationAddress, AvailableSeats, TripStatus, PublishDate, EstimatedEndDateTime, TripDuration, CompletedDateTime)
VALUES
(11, 'PickupA', 'AltPickupA', '2024-01-01 08:00:00', 'DestinationA', 3, 'created', '2023-12-10', '2024-01-01 08:40:00', 40, NULL),
(12, 'PickupB', 'AltPickupB', '2024-01-01 08:30:00', 'DestinationB', 2, 'created', '2023-12-10', '2024-01-01 09:10:00', 40, NULL),
(13, 'PickupC', 'AltPickupC', '2024-01-01 09:00:00', 'DestinationC', 4, 'created', '2023-12-10', '2024-01-01 09:40:00', 40, NULL),
(14, 'PickupD', 'AltPickupD', '2024-01-01 09:30:00', 'DestinationD', 1, 'created', '2023-12-10', '2024-01-01 10:10:00', 40, NULL),
(15, 'PickupE', 'AltPickupE', '2024-01-02 16:30:00', 'DestinationE', 5, 'created', '2023-12-10', '2024-01-02 17:10:00', 40, NULL),
(16, 'PickupF', 'AltPickupF', '2024-01-02 17:00:00', 'DestinationF', 2, 'created', '2023-12-10', '2024-01-02 17:40:00', 40, NULL),
(17, 'PickupG', 'AltPickupG', '2024-01-02 17:30:00', 'DestinationG', 4, 'created', '2023-12-10', '2024-01-02 18:10:00', 40, NULL),
(18, 'PickupH', 'AltPickupH', '2024-01-02 18:00:00', 'DestinationH', 3, 'created', '2023-12-10', '2024-01-02 18:40:00', 40, NULL);


