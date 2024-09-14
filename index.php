<?php

    include 'xlsx.php';

    
    $con = mysqli_connect('localhost', 'root', '', 'hempromak');
    
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    }
    
    $excel_file = SimpleXLSX::parse('./ExcelData/Adapteri-nipli.xlsx');

    $prefix_table = '';
    $table = '';

    $excel = $excel_file->rows();

    foreach ($excel as $row ){

        if (empty($row[1]) && !empty($row[2]) && empty($row[3]) && empty($row[4]) && empty($row[5]) ){
            $prefix_table = '';
            $prefix_table = str_replace(' ', '_', $row[2]);
            $prefix_table = str_replace('-', '_', $prefix_table);

            $check_table_query = "SHOW TABLES LIKE '$prefix_table'";

            $result = $con->query($check_table_query);

            if (mysqli_num_rows($result) <= 0){
                $create_table_query = "
                    CREATE TABLE $prefix_table (
                        sifra INT NOT NULL PRIMARY KEY,
                        opis VARCHAR(255) NULL,
                        kom VARCHAR(255) NULL,
                        quantity INT NOT NULL
                    );
                ";

                if ($con->query($create_table_query) === TRUE){
                    echo '<br> Created new table ' . $prefix_table . '<br>';
                }
                else
                    echo 'Error: ' . $create_table_query . '<br>' . $con->error;

                $create_table_query = "
                    CREATE TABLE {$prefix_table}_details (
                        sifra INT NOT NULL,
                        cena INT NOT NULL,
                        vrednost VARCHAR(200) NULL,
                        FOREIGN KEY (sifra) REFERENCES $prefix_table(sifra) ON DELETE CASCADE
                    );";
                
                if ($con->query($create_table_query) === TRUE)
                    echo '<br> Created new table ' . $prefix_table . '_details<br>';
                else
                    echo 'Error: ' . $create_table_query . '<br>' . $con->error;

            }


        }
    }

    $counter_row = 0;
    $quantity_counter = 0;
    $prefix_table = '';
    $query_row = "";

    // [1] - opis
    // [2] - kom
    // [3] - sifra
    // [4] - kom
    // [5] - cena
    // [6] - vrednost
    foreach ($excel as $row ){
        $counter_row++;

        if ($counter_row == 5){
            continue;
        }

        print_r('<pre>');
        print_r($row);
        print_r('</pre>');

        if (empty($row[1]) && !empty($row[2]) && empty($row[3]) && empty($row[4]) && empty($row[5]) ){
            $prefix_table = str_replace(' ', '_', $row[2]);
            $prefix_table = str_replace('-', '_', $prefix_table);
            echo $prefix_table . '<br>';
        }

        if (!empty($row[1]) && !empty($row[5]) && !empty($row[6])){
            $quantity_counter = 0;
            echo $prefix_table . '<br>';
            $quantity_counter++;
            if (empty($query_row)){
                $query_row = "INSERT INTO $prefix_table (sifra, opis, kom, quantity) VALUES
                    ($row[3], '$row[1]', '$row[2]', $quantity_counter);

                INSERT INTO {$prefix_table}_details (sifra, cena, vrednost) VALUES
                    ($row[3], $row[5], '$row[6]');
                ";

                mysqli_multi_query($con, $query_row);
                do {
                    if ($result = mysqli_store_result($con)) {
                        while ($row = mysqli_fetch_row($result)) {
                            printf("%s\n", $row[0]);
                        }
                    }
                    if (mysqli_more_results($con)) {
                        printf("-----------------\n");
                    }
                } while (mysqli_next_result($con));


                $query_row = '';

            }
        }

        if (empty($row[1]) && !empty($row[5]) && !empty($row[6])){
            $query_details_row = "INSERT INTO {$prefix_table}_details (sifra, cena, vrednost) VALUES
                ($row[3], $row[5], '$row[6]');";

            if ($con->query($query_details_row)){
                echo 'Added to details';
            }
            else{
                echo 'Error: ' . $con->error;
            }
        }

    }

        // if ($row[0] != ''){
            // $query = "INSERT INTO test (name, role) VALUES ('" . $row[1] . "', '" . $row[2] . "')";

            // if ($con->query($query) === TRUE) {
            //     echo "New record created successfully";
            // } else {
            //     echo "Error: " . $query . "<br>" . $con->error;
            // }
        // }

    $con->close();


?>