<?php

    // set directory
    $target_dir = "uploads/";
    $fighterImage = $target_dir . basename($_FILES["fImageUpload"]["name"]);
    $uploadCheck = 1;

    // check if file is an image
    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fImageUpload"]["tmp_name"]);
        if($check !== false) {
            echo "File is an image.";
            $uploadCheck = 1;
        } else {
            echo "File is not an image.";
            $uploadCheck = 0;
        }
    }

    // check if file already exists
    if (file_exists($fighterImage)) {
        echo "This file already exists.";
        $uploadCheck = 0;
    }

    // check file size
    if ($_FILES["fImageUpload"]["size"] > 500000) {
        echo "This file is too large.";
        $uploadCheck = 0;
    }

    // only allow certain file formats
    $imageFileType = strtolower(pathinfo($fighterImage,PATHINFO_EXTENSION));
    if($imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "jpg") {
        echo "Only JPEG, JPG, and PNG are allowed.";
        $uploadCheck = 0;
    }

    // check if $uploadCheck is set to 0 by an error
    if ($uploadCheck == 0) {
        echo "Your file was not uploaded.";
        // if everything is ok, try to upload file
        } else {
        if (move_uploaded_file($_FILES["fImageUpload"]["tmp_name"], $fighterImage)) {
            echo "The file ". htmlspecialchars( basename( $_FILES["fImageUpload"]["name"])). " has been uploaded.";

            // change permissions on the file
            chmod($fighterImage, 0644);
        } else {
            echo "There was an error uploading your file.";
        }
    }
?>