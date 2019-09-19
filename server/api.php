<?php

    function create_possible_arrays(&$set, &$results)
    {
        for ($i = 0; $i < count($set); $i++)
        {
            $results[] = $set[$i];
            $tempset = $set;
            array_splice($tempset, $i, 1);
            $tempresults = array();
            create_possible_arrays($tempset, $tempresults);
            foreach ($tempresults as $res)
            {
                $results[] = $set[$i] . $res;
            }
        }
    }
    //this is the basic way of getting a database handler from PDO, PHP's built in quasi-ORM
    $dbhandle = new PDO("sqlite:scrabble.sqlite") or die("Failed to open DB");
    if (!$dbhandle) die($error);

    //this is a sample query which gets some data, the order by part shuffles the results
    //the limit 0, 10 takes the first 10 results.
    // you might want to consider taking more results, implementing "pagination", 
    // ordering by rank, etc.
    $query = "SELECT rack, words FROM racks WHERE length=5 order by random() limit 0, 1";

    //this next line could actually be used to provide user_given input to the query to 
    //avoid SQL injection attacks
    $statement = $dbhandle->prepare($query);
    $statement->execute();


    //The results of the query are typically many rows of data
    //there are several ways of getting the data out, iterating row by row,
    //I chose to get associative arrays inside of a big array
    //this will naturally create a pleasant array of JSON data when I echo in a couple lines
    $results = $statement->fetchAll(PDO::FETCH_ASSOC);

    $permutations = array();
    $str = $results[0]['rack'];
    $str = str_split($str);
    create_possible_arrays($str, $permutations);

    $possible_answer = Array();

    for ($i = 0; $i < count($permutations); $i++)
    {
        $query = "SELECT rack, words FROM racks WHERE rack='$permutations[$i]'";
        $statement = $dbhandle->prepare($query);
        $statement->execute();
        $possible_results = $statement->fetchAll(PDO::FETCH_ASSOC);

        if (count($possible_results) != 0)
        {
            $possible_answer = array_merge($possible_answer, explode("@@",$possible_results[0]['words']));
        }
    }
    
    $results[0]["words"] = array_values(array_unique($possible_answer + explode("@@",$results[0]["words"])));

    //this part is perhaps overkill but I wanted to set the HTTP headers and status code
    //making to this line means everything was great with this request
    header('HTTP/1.1 200 OK');
    //this lets the browser know to expect json
    header('Content-Type: application/json');

    header ("Access-Control-Allow-Origin: *");
    header ("Access-Control-Expose-Headers: Content-Length, X-JSON");
    header ("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    header ("Access-Control-Allow-Headers: *");

    //this creates json and gives it back to the browser
    echo json_encode($results);
