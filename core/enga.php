<?php

include 'dbhost.php';

if(!empty($_REQUEST)){
    if(function_exists($_REQUEST['action']))
    {
       call_user_func($_REQUEST['action']);
    }
       die();
}

function postAuth()
{

$name = $_REQUEST['name'];
$surname = $_REQUEST['surname'];
$second_name = $_REQUEST['second_name'];

$connect_data = "host=".DBHOST_IP." port=5432 dbname=test_db user=dbuser password=12345";

$db_connect = pg_connect($connect_data);

if (!$db_connect) {
  echo "nooo";
  die("error!!!" . pg_result_error());
}

$create_table =
<<<TBL
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    member_name CHARACTER VARYING(100) NOT NULL,
    member_surname CHARACTER VARYING(100) NOT NULL,
    member_second_name CHARACTER VARYING(100) NOT NULL
);
TBL;

$query_create_table = pg_query($db_connect, $create_table);

$insert = 'INSERT INTO members (member_name, member_surname, member_second_name) VALUES ('."$name".', '."$surname".', '."$second_name".')';

$query_insert = pg_query($db_connect, $insert);

$query_select = pg_query($db_connect, "SELECT * FROM members");

$arr = pg_fetch_all($query_select);

pg_close($db_connect);

echo json_encode($arr);
}

?>
