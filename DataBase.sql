CREATE DATABASE project_iteration2;
USE project_iteration2;

CREATE TABLE User (
    UserID INT AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    Role ENUM('Admin', 'Organizer', 'Participant', 'Judge', 'Sponsor') NOT NULL,
    Password VARCHAR(255) NOT NULL,
    PRIMARY KEY (UserID)
);
select *from user ;


CREATE TABLE Venue (
    VenueID INT AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Capacity INT NOT NULL CHECK (Capacity > 0),
    PRIMARY KEY (VenueID)
);
select *from Venue ;

CREATE TABLE Event (
    EventID INT AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Description TEXT,
    Rules TEXT,
    MaxParticipants INT CHECK (MaxParticipants > 0),
    RegistrationFee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    VenueID INT,
    OrganizerID INT NOT NULL,
    PRIMARY KEY (EventID),
    FOREIGN KEY (VenueID) REFERENCES Venue(VenueID) ON DELETE SET NULL,
    FOREIGN KEY (OrganizerID) REFERENCES User(UserID) ON DELETE CASCADE
);
select *from Event ;


CREATE TABLE Team (
    TeamID INT AUTO_INCREMENT,
    TeamName VARCHAR(100) NOT NULL,
    EventID INT NOT NULL,
    PRIMARY KEY (TeamID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE
);
select *from Team ;

CREATE TABLE Participant (
    ParticipantID INT AUTO_INCREMENT,
    UserID INT NOT NULL,
    IndividualOrTeam ENUM('Individual', 'Team') NOT NULL,
    PRIMARY KEY (ParticipantID),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);
select *from Participant ;

CREATE TABLE Team_Participant (
    TeamID INT,
    ParticipantID INT,
    PRIMARY KEY (TeamID, ParticipantID),
    FOREIGN KEY (TeamID) REFERENCES Team(TeamID) ON DELETE CASCADE,
    FOREIGN KEY (ParticipantID) REFERENCES Participant(ParticipantID) ON DELETE CASCADE
);
select *from Team_Participant ;

CREATE TABLE Registration (
    RegistrationID INT AUTO_INCREMENT,
    ParticipantID INT NOT NULL,
    EventID INT NOT NULL,
    RegistrationDate DATE NOT NULL,
    PRIMARY KEY (RegistrationID),
    UNIQUE KEY (ParticipantID, EventID),
    FOREIGN KEY (ParticipantID) REFERENCES Participant(ParticipantID) ON DELETE CASCADE,
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE
);
select *from Registration ;


CREATE OR REPLACE VIEW RegistrationStatusView AS
SELECT
    r.RegistrationID,
    r.ParticipantID,
    r.EventID,
    r.RegistrationDate,
    CASE
        WHEN p.PaymentID IS NOT NULL THEN 'Paid'
        ELSE 'Pending'
    END AS PaymentStatus
FROM Registration r
LEFT JOIN Payment p
  ON r.ParticipantID = p.ParticipantID AND r.EventID = p.EventID;

SELECT * FROM RegistrationStatusView;






CREATE TABLE Sponsor (
    SponsorID INT AUTO_INCREMENT,
    CompanyName VARCHAR(100) NOT NULL,
    ContactPerson VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (SponsorID)
);

select *from Sponsor ;

CREATE TABLE Sponsorship (
    SponsorshipID INT AUTO_INCREMENT,
    EventID INT NOT NULL,
    SponsorID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    SponsorshipType VARCHAR(50) NOT NULL,
    PRIMARY KEY (SponsorshipID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE,
    FOREIGN KEY (SponsorID) REFERENCES Sponsor(SponsorID) ON DELETE CASCADE
);


CREATE TABLE Judge_Assignment (
    AssignmentID INT AUTO_INCREMENT,
    JudgeID INT NOT NULL,
    EventID INT NOT NULL,
    PRIMARY KEY (AssignmentID),
    FOREIGN KEY (JudgeID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE
);


CREATE TABLE Score (
    ScoreID INT AUTO_INCREMENT,
    JudgeID INT NOT NULL,
    ParticipantID INT NOT NULL,
    EventID INT NOT NULL,
    Criteria VARCHAR(100) NOT NULL,
    ScoreValue DECIMAL(5,2) CHECK (ScoreValue BETWEEN 0 AND 100),
    PRIMARY KEY (ScoreID),
    FOREIGN KEY (JudgeID) REFERENCES User(UserID),
    FOREIGN KEY (ParticipantID) REFERENCES Participant(ParticipantID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID)
);
select *from score ;
CREATE TABLE Leaderboard (
    LeaderboardID INT AUTO_INCREMENT,
    EventID INT NOT NULL,
    ParticipantID INT NOT NULL,
    AverageScore DECIMAL(5,2),
    Ranke INT,
    PRIMARY KEY (LeaderboardID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID),
    FOREIGN KEY (ParticipantID) REFERENCES Participant(ParticipantID)
);
select *from Leaderboard;

SELECT ja.JudgeID, u.Name, e.Name AS EventName
FROM Judge_Assignment ja
JOIN User u ON ja.JudgeID = u.UserID
JOIN Event e ON ja.EventID = e.EventID;

select *from Judge_Assignment;




select *from Sponsorship ;
select *from user ;
select *from venue ;
select *from Event ;
select *from Registration ;
select *from Team ;
select *from Participant ;
SELECT * FROM RegistrationStatusView;
select *from sponsor ;
DELIMITER $$

CREATE TRIGGER update_leaderboard_after_score
AFTER INSERT ON Score
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE p_id INT;
    DECLARE avg_score DECIMAL(5,2);
    DECLARE cur CURSOR FOR
        SELECT ParticipantID, AVG(ScoreValue)
        FROM Score
        WHERE EventID = NEW.EventID
        GROUP BY ParticipantID
        ORDER BY AVG(ScoreValue) DESC;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    DROP TEMPORARY TABLE IF EXISTS temp_leaderboard;
    CREATE TEMPORARY TABLE temp_leaderboard (
        ParticipantID INT,
        AverageScore DECIMAL(5,2),
        Ranke INT AUTO_INCREMENT PRIMARY KEY
    ) AUTO_INCREMENT = 1;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO p_id, avg_score;
        IF done THEN
            LEAVE read_loop;
        END IF;
        INSERT INTO temp_leaderboard (ParticipantID, AverageScore) VALUES (p_id, avg_score);
    END LOOP;
    CLOSE cur;

    DELETE FROM Leaderboard WHERE EventID = NEW.EventID;

    INSERT INTO Leaderboard (EventID, ParticipantID, AverageScore, Ranke)
    SELECT NEW.EventID, ParticipantID, AverageScore, Ranke FROM temp_leaderboard;
END $$

DELIMITER ;





CREATE TABLE Accommodation (
    AccommodationID INT AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(255),
    TotalRooms INT NOT NULL CHECK (TotalRooms > 0),
    RoomsAvailable INT NOT NULL,
    BudgetPerPerson DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (AccommodationID)
);

select *from Accommodation;
INSERT INTO Accommodation (Name, Location, Capacity, Price, AvailableRooms)
VALUES 
('Hotel A', 'City Center', 2, 1000.00, 10),
('Hotel B', 'Downtown', 4, 2000.00, 5),
('Hotel C', 'Suburbs', 1, 1500.00, 3);
CREATE TABLE Accommodation_Request (
    RequestID INT AUTO_INCREMENT,
    ParticipantID INT NOT NULL,
    NumPeople INT NOT NULL CHECK (NumPeople > 0),
    MaxBudget DECIMAL(10,2) NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    AccommodationID INT,
    RoomAllocated INT,
    RequestDate DATE NOT NULL DEFAULT (CURDATE()),
    PRIMARY KEY (RequestID),
    FOREIGN KEY (ParticipantID) REFERENCES Participant(ParticipantID),
    FOREIGN KEY (AccommodationID) REFERENCES Accommodation(AccommodationID)
);
select *from Accommodation_Request ;

DELIMITER $$

CREATE PROCEDURE AssignAccommodation(IN p_request_id INT)
BEGIN
    DECLARE v_participant_id INT;
    DECLARE v_num_people INT;
    DECLARE v_budget DECIMAL(10,2);
    DECLARE v_acc_id INT;

    SELECT ParticipantID, NumPeople, MaxBudget INTO v_participant_id, v_num_people, v_budget
    FROM Accommodation_Request
    WHERE RequestID = p_request_id AND Status = 'Pending';

    -- Select the first available accommodation that fits
    SELECT AccommodationID INTO v_acc_id
    FROM Accommodation
    WHERE RoomsAvailable >= v_num_people AND BudgetPerPerson <= v_budget
    ORDER BY BudgetPerPerson ASC
    LIMIT 1;

    IF v_acc_id IS NOT NULL THEN
        -- Update request with allocation
        UPDATE Accommodation_Request
        SET Status = 'Approved',
            AccommodationID = v_acc_id,
            RoomAllocated = v_num_people
        WHERE RequestID = p_request_id;

        -- Update available rooms
        UPDATE Accommodation
        SET RoomsAvailable = RoomsAvailable - v_num_people
        WHERE AccommodationID = v_acc_id;
    ELSE
        -- Mark as rejected
        UPDATE Accommodation_Request
        SET Status = 'Rejected'
        WHERE RequestID = p_request_id;
    END IF;
END $$

DELIMITER ;

CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT,
    ParticipantID INT NOT NULL,
    EventID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod ENUM('Online', 'Manual') NOT NULL,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (PaymentID),
    FOREIGN KEY (ParticipantID) REFERENCES Participant(ParticipantID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID)
);


DELIMITER $$

CREATE TRIGGER set_payment_status_after_payment
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
    -- Update RegistrationStatusView based on the payment status
    UPDATE RegistrationStatusView
    SET Status = 'Paid'
    WHERE ParticipantID = NEW.ParticipantID 
      AND EventID = NEW.EventID 
      AND Status = 'Pending';
END $$

DELIMITER ;

INSERT INTO Payment (ParticipantID, EventID, Amount, PaymentMethod)
        VALUES (6,1,2000,'Online')
select *from Payment;