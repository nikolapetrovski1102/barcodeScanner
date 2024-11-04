<?php

    include 'xlsx.php';

    
    $con = mysqli_connect('localhost', 'root', '', 'hempromak');
    
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    }
    
    $directory = './ExcelData/';
    $files = glob($directory . '*.xlsx');
    $file_name_type = '';

    // $excel_file = SimpleXLSX::parse('./ExcelData/Adapteri-nipli.xlsx');

    if ($files) {
        foreach ($files as $file) {
            $file_name = basename($file);

            $excel_file = SimpleXLSX::parse($file);
    
            if ($excel_file) {
                $table = str_replace('-', '_', $file_name);
                $table = str_replace(' ', '_', $table);
                $table = explode('.', $table)[0];

                $check_table_query = "SHOW TABLES LIKE 'items_{$table}'";

                    $result = $con->query($check_table_query);

                    if (mysqli_num_rows($result) <= 0){
                        $create_table_query = 
                            "CREATE TABLE items_{$table} (
                                sifra INT NOT NULL PRIMARY KEY,
                                head_type VARCHAR(200) NOT NULL,
                                type VARCHAR(200) NOT NULL
                            );";

                    if ($con->query($create_table_query) === TRUE){
                        echo '<br> Created new table ' . $table . '<br>';
                    }
                    else
                        echo 'Error: ' . $create_table_query . '<br>' . $con->error;

                        $create_details_table_query = 
                            "CREATE TABLE items_{$table}_details (
                                sifra INT NOT NULL,
                                cena FLOAT NOT NULL,
                                komada VARCHAR(200) NULL,
                                opis VARCHAR(255) NULL,
                                times_used INT NULL DEFAULT 0,
                                FOREIGN KEY (sifra) REFERENCES $table(sifra) ON DELETE CASCADE
                            );";

                        if ($con->query($create_details_table_query) === TRUE){
                            echo '<br> Created new table ' . $table . '_details <br>';
                        }
                        else
                            echo 'Error: ' . $create_details_table_query . '<br>' . $con->error;


            } else {
                echo "Failed to parse: " . $file_name . "<br>";
            }

            $head_type = '';

            $excel = $excel_file->rows();

            $counter_row = 0;
            $prefix_table = '';
            $query_row = "";
            $type = '';
            $opis = '';

            // [1] - opis
            // [2] - kom
            // [3] - sifra
            // [4] - komada
            // [5] - cena
            // [6] - vrednost
            foreach ($excel as $row ){
                $counter_row++;

                if ($counter_row == 5 || empty($row)){
                    continue;
                }

                if (empty($row[1]) && !empty($row[2]) && empty($row[3]) && empty($row[4]) && empty($row[5]) ){
                    echo "<br> $head_type <br>";
                    $head_type = $row[2];
                    $head_type = str_replace(' ', '', $head_type);
                    $head_type = str_replace('-', '_', $head_type);
                }

                if (!empty($row[1]) && empty($row[2]) && empty($row[3]) && empty($row[4]) && empty($row[5]) ){
                    $type = $row[1];
                }

                if (!empty($row[1]) && !empty($row[3]) && !empty($row[4]) && !empty($row[5]) && $row[6] != '0.00'){
                    $opis = str_replace(' ', '', $row[1]);
                    
                    if (empty($query_row)){
                        $query_row = "INSERT IGNORE INTO items_{$table} (sifra, head_type, type) VALUES
                            ($row[3], '$head_type', '$type');

                        INSERT INTO items_{$table}_details (sifra, cena, komada, opis) VALUES
                            ($row[3], $row[5], '$row[4]', '$opis');";

                        echo '<br>';
                        print_r($query_row);
                        echo '<br>';

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
                    $query_details_row = "INSERT INTO {$table}_details (sifra, cena, komada, opis) VALUES
                        ($row[3], $row[5], '$row[4]', '$opis');";

                    if (!$con->query($query_details_row))
                        echo 'Error: ' . $con->error;

                }

            }

            }
        }

    } else {
        echo "No Excel files found in the directory.";
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