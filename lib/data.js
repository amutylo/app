/**
 * Library for storing and editing data
 */

// Dependencies
var fs = require('fs');
var path = require('path');

// Container for the module
var lib = {};

// Define a base dir of data folder.
lib.baseDir = path.join(__dirname, '/../.data/');
console.log('Dirname: ', __dirname);
console.log('Base dir set to: ', lib.baseDir);

// Write data to a file
lib.create = function(dir, file, data, callback) {
    // Try a file for writing.
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        console.log('err: ', err);
        console.log('descriptor: ', fileDescriptor);
        if(!err && fileDescriptor) {
            // Convert data to string.
            var stringData = JSON.stringify(data);

            // Write string data to file.
            fs.write(fileDescriptor, stringData, function(err){
                if (!err) {
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callback(false);
                        }
                        else {
                            callback('Error closing the new file')
                        }
                    })
                }
                else {

                }
            })
        } 
        else {
            callback('Can\'t create a new file. It may already exist.');
        }
    } );

};

//Read from a file.
lib.read = function (dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function (err, data) {
        callback(err, data);
    })
}

// Update existing data
lib.update = function (dir, file, data, callback) {
    // Open the file
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // Convert data to string.
            var stringData = JSON.stringify(data)
            // Trancate the file.
            fs.ftruncate(fileDescriptor, function (err) {
                if (!err) {
                    // Write to the file and close it.
                    fs.writeFile(fileDescriptor, stringData, function (err) {
                        if (!err) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false);
                                }
                                else {
                                    console.log('Error closing the file');
                                }
                            });
                        }
                        else {
                            console.log('Error writing to the existing file');
                        }
                    })
                }
                else {
                    console.log('Error trancating file');
                }
            });
        }
        else {
            console.log('Can\'t open file to read');
        }
    })
} 

lib.delete = function (dir, file, callback) {

    //Unlinking the file.
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err) {
        if (!err) {
            callback(false)
        }
        else {
            console.log('Error deleting the file')
        }
    });
}

// Export module
module.exports = lib;
