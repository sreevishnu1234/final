//Function to read the file given by the user
function analyzeLogFiles() {
      //var numDays = document.getElementById("numDays").value;
      var logFileInput = document.getElementById("logFile");
      var logFile = logFileInput.files[0];

      /*if (!numDays || isNaN(numDays) || !logFile) {
        alert("Please enter a valid number of days and select a log file.");
        return;
      }*/

      var reader = new FileReader();//API to read file
      reader.onload = function(event) {
        var logData = event.target.result;
        var logLines = logData.split('\n'); //Dividing paragraph into lines

        var tableBody = document.getElementById("creationTableBody");
        tableBody.innerHTML = "";

        var entries = [];
        var entries1 = [];
        var currentEntry = null;
        var currentEntry1 = null;
        var currentJobId = null;
        var currentoperation = null;

        for (var i = 0; i < logLines.length; i++) {
          var line = logLines[i];

          if (line.includes("Created jobId")) {
            var jobIdStart = line.lastIndexOf(":")+1;
            currentJobId = line.substring(jobIdStart).trim();
          }

          if (line.includes("Successfully created") || line.includes("Successfully set") || line.includes("Failed") ) {
            currentEntry = { jobId: currentJobId };

            if (line.includes("Successfully created") || line.includes("Successfully set")) {
              currentEntry.status = "Success";
            }
			else {
              currentEntry.status = "Fail";
            }
            var operation = line.lastIndexOf("\\")+1;
              currentoperation = line.substring(operation).trim();
              currentEntry1 = { operation: currentoperation };

            var pathStart = line.lastIndexOf(":")-1;
            currentEntry.path = line.substring(pathStart).trim();
            

            entries.push(currentEntry);
            entries1.push(currentEntry1);
            currentEntry = null;
            currentEntry1 = null;
          }
        }


        var successCount = 0;
        var error = 0;
        var status = 0;
        var inp = 0;
        var data = 0;
       
        
        for (var j = 0; j < entries.length; j++) {
		  
          var newRow = "<tr><td>" + entries[j].jobId + "</td><td>" + entries1[j].operation + "</td><td>" + entries[j].status + "</td><td>" + entries[j].path + "</td></tr>";
         tableBody.innerHTML += newRow;
         extractAndPopulateFields(entries[j].path,entries[j].jobId,entries1[j].operation);//Function call to read the file using path sent by enitries[j].path 
         
          if (entries[j].status === "Success") {
            successCount++;
            //For Summary thing
            if (entries1[j].operation === "Status_Import")
            {
				status++;
				
			}
			else if (entries1[j].operation === "Input_Import")
            {
				inp++;
				
			}
			else if (entries1[j].operation === "data.3dxml")
            {
				data++;
				
			}
			else if (entries1[j].operation === "ErrorFile")
            {
				error++;
			}
          }
          else if (entries[j].status === "Fail") {
			failcount++;
		  }
		}
        var summary = document.getElementById("summary");
        var summary1 = document.getElementById("summary1");
        var summary2 = document.getElementById("summary2");
        var summary3 = document.getElementById("summary3");
        var summary4 = document.getElementById("summary4");
        summary.innerHTML = "Total Successful Entries: " + successCount;
        summary1.innerHTML = "Total Status_Import File Created: " + (status/2);
        summary2.innerHTML = "Total	Input_Import File Created: " + inp;
        summary3.innerHTML = "Total data.3dxml Created: " + data;
        summary4.innerHTML = "Total Error File Created: " + error;
      };
		reader.readAsText(logFile);
		
    }
    
   //Called Function
   function extractAndPopulateFields(logFilePath,id,operation) {
//alert("187"+ logFilePath);	
  		var xhr = new XMLHttpRequest();//API to read file using path of file
//alert("189 "+ logFilePath);
 	 	var newLogFilePath = logFilePath.replace(/\\/g,'/');
  		var a = 'file://';
  		var nLogFilePath = a.concat('' , newLogFilePath);
//console.log(" " + nLogFilePath); 
  		xhr.open("GET",nLogFilePath,true);
//console.log(" " + nLogFilePath);
//alert("logsree" + newLogFilePath.lastIndexOf("/")+1 );
  		xhr.onload = function () {
//console.log("srwerr" );
//alert("194"+ logFilePath);
//alert(" "+ xhr.status);
    	if (xhr.status === 200) {
      		var logData = xhr.responseText;
      		var logLines = logData.split('\n');//Dividing paragaphs into lines
			var extractedTableBody = document.getElementById("extractedTableBody");
//extractedTableBody.innerHTML = "";
			for (var i = 1; i < logLines.length; i++) {//For treversing each and every line
		 		if(nLogFilePath.includes("Status_Import"))
				{
					var fields = logLines[i].split('\t'); //Split string based on tab spaces
        			var field1 = fields[0];
        			var field4 = fields[4];
        			var field10 = fields[8];
				}
//if(nLogFilePath.includes("Input_Import"))
				else
				{
        			var fields = logLines[i].split('\t');
        			var field1 = fields[1];
        			var field4 = fields[2];
        			var field10 = fields[28];
        		}
			var extractedRow = "<tr><td>"+ id + "</td><td>" + operation +"</td><td>" + logFilePath + "</td><td>" + field1 +"</td><td>" + field4 + "</td><td>" + field10 + "</td></tr>";
        	extractedTableBody.innerHTML += extractedRow;
        	}
    	} else {
      console.error('Error fetching log content. Status code: ' + xhr.status);
      
    }
  };
xhr.onerror = function () { //error Handling
      var extractedRow = "<tr><td>"+ id + "</td><td>" + operation + "</td><td>" + logFilePath + "</td><td>" + field1 +"</td><td>" + field4 + "</td><td>" + field10 + "</td></tr>";
        extractedTableBody.innerHTML += extractedRow;
    };
  

  xhr.send();
}

//Function to reset the dashboard
function ResetLogFiles() {//for reseting values in table
  var logFileInput = document.getElementById('logFile');
  if (confirm('Are you sure you want to reset the selected log files?')) {
    logFileInput.value = '';

    var creationTable = document.getElementById('creationTable');
    var extractedTable = document.getElementById('extractedTable');

    clearTable(creationTable);//function call
    clearTable(extractedTable);
   
    document.getElementById('summary').textContent = '';
    document.getElementById('summary1').textContent = '';
    document.getElementById('summary2').textContent = '';
    document.getElementById('summary3').textContent = '';
    document.getElementById('summary4').textContent = '';

    alert('Log files reset from GUI successfully.');
  }
}

//Called Function
function clearTable(table) {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

//Function to select the one of the table. show the selected thing
function toggleTable() {
    var selectedTable = document.getElementById("tableSelector").value;
    if (selectedTable === "creationTable") {
        document.getElementById("creationTable").style.display = "table";
        document.getElementById("extractedTable").style.display = "none";// Only 1 table will ve visible
    } else if (selectedTable === "extractedTable") {
        document.getElementById("creationTable").style.display = "none";
        document.getElementById("extractedTable").style.display = "table";
    }
        removeDuplicates() ;
		removeDuplicates1();
		//removeDuplicates() ;
}

//Function to search the element in table based on input given by the user
function searchTables() {
    var input, filter, tables, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    tables = document.querySelectorAll("table[id='creationTable'], table[id='extractedTable']"); // Get the specific tables by ID

    for (i = 0; i < tables.length; i++) {
        table = tables[i];
        tr = table.getElementsByTagName("tr");

        //To hide those that don't match the search query
        for (j = 1; j < tr.length; j++) { // Skip the header row
            tr[j].style.display = "none"; 
            td = tr[j].getElementsByTagName("td");
            for (var k = 0; k < td.length; k++) {
                txtValue = td[k].textContent || td[k].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[j].style.display = ""; // Ifmatch is found
                    break; 
                }
            }
        }
    }
}


//Function to sort the table based on input given by the user
function sortTables() {
  var sortOrder = document.getElementById("sortOrder").value;
  sortTable("creationTable", sortOrder);//Function call
  sortTable("extractedTable", sortOrder);
}


//Called Function
function sortTable(tableId, sortOrder) {
  var table = document.getElementById(tableId);
  var tbody = table.tBodies[0];
  var rows = Array.from(tbody.rows); //All table

  rows.sort(function (a, b) {
    var valueA = a.cells[0].textContent; 
    var valueB = b.cells[0].textContent;

    if (sortOrder === "asc") {
      return valueA.localeCompare(valueB, undefined, { numeric: true });
    } else {
      return valueB.localeCompare(valueA, undefined, { numeric: true });
    }
  });

  tbody.innerHTML = "";

  // Sorted Values
  rows.forEach(function (row) {
    tbody.appendChild(row);
  });
}

function removeDuplicates() {
            var table = document.getElementById("creationTable");
            var rows = table.getElementsByTagName("tr");
            var seen = {};
            var index = rows.length - 1;
          
            while (index > 0) {
                var currentRow = rows[index];
                var path = currentRow.cells[3].innerText;
                

                if (seen[path]) {
                    table.deleteRow(index);
                } else {
                    seen[path] = true;
                }
                index--;
            }
}


function removeDuplicates1() {
            var table = document.getElementById("extractedTable");
            var rows = table.getElementsByTagName("tr");
            var seen = {};
            var index = rows.length - 1;

            while (index > 0) {
                var currentRow = rows[index];
                var path = currentRow.cells[2].innerText;

                if (seen[path]) {
                    table.deleteRow(index);
                } else {
                    seen[path] = true;
                }
                index--;
            }
}
    

