<?php

    include 'xlsx.php';

    
    $con = mysqli_connect('localhost', 'root', '', 'hempromak');
    
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    }
    
    $excel = SimpleXLSX::parse('./ExcelData/Book1.xlsx');

    foreach ($excel->rows() as $row ){
        if ($row[0] != ''){
            $query = "INSERT INTO test (name, role) VALUES ('" . $row[1] . "', '" . $row[2] . "')";

            if ($con->query($query) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $query . "<br>" . $con->error;
            }
        }
    }

    $con->close();


?>