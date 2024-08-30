
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using TodoApi.Models;
// using Microsoft.AspNetCore.Http;
// using System.Collections.Generic;
// using System.Globalization;
// using System.Text.Json;
using CsvHelper;


namespace TodoApi.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;
        public int recordcount;
        private readonly RabbitMqService _rabbitMqService;

        private List<string> listrows = new List<string> { "Name_1", "email", "country", "state", "city", "telephone", "address_1", "address_2", "dob", "fy2019_20", "fy2020_21", "fy2021_22", "fy2022_23", "fy2023_24" };
        private static readonly string _connectionString = "Server=localhost;Database=sql_workbench;User=root;Password=root;";
        MySqlConnection connection = new MySqlConnection(_connectionString);

        public TodoItemsController(TodoContext context, RabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
        }

        // GET: api/TodoItems/5
        [HttpGet("search/{fileid}")]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItem(long fileid, string value)
        {
            // var todoItem = await _context.TodoItems.FindAsync(id);
            var todoItems = await _context.TodoItems.ToListAsync();

            List<TodoItem> todoList = new List<TodoItem>(todoItems);
            Console.WriteLine(fileid);
            Console.WriteLine(value);
            // var query2 = "SELECT Name_1 FROM datas WHERE fileid='" + fileid + "';";
            var query2 = @"SELECT * FROM datas
            WHERE (Name_1= '" + value + "' OR email ='" + value + "'OR country = '" + value + "'OR city = '" + value + "'OR address_1 = '" + value + "'OR address_2 = '" + value + "') and file_id='" + fileid + "';";
            MySqlCommand queryCommand = new MySqlCommand(query2, connection);
            try
            {
                await connection.OpenAsync();
                using (MySqlDataReader reader = queryCommand.ExecuteReader())
                {
                    while (await reader.ReadAsync())
                    {
                        Console.WriteLine($"data:{reader["Name_1"]} ,{reader["email"]},{reader["country"]}");

                        var name = reader["Name_1"].ToString();
                        var email = reader["email"].ToString();
                        var country = reader["country"].ToString();
                        var city = reader["city"].ToString();
                        var state = reader["state"].ToString();
                        var address_1 = reader["address_1"].ToString();
                        var address_2 = reader["address_2"].ToString();
                        var dob = reader["dob"].ToString();
                        var telephone = Convert.ToInt64(reader["telephone"]);
                        var fy2019_20 = Convert.ToInt64(reader["fy2019_20"]);
                        var fy2020_21 = Convert.ToInt64(reader["fy2020_21"]);
                        var fy2021_22 = Convert.ToInt64(reader["fy2021_22"]);
                        var fy2022_23 = Convert.ToInt64(reader["fy2022_23"]);
                        var fy2023_24 = Convert.ToInt64(reader["fy2023_24"]);

                        todoList.Add(new TodoItem { Name = name, Email = email, Country = country, State = state, City = city, Telephone = telephone, Address_1 = address_1, Address_2 = address_2, DOB = dob, FY2019_20 = fy2019_20, FY2020_21 = fy2020_21, FY2021_22 = fy2021_22, FY2022_23 = fy2022_23, FY2023_24 = fy2023_24 });

                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            finally
            {
                connection.Close();
            }

            return Ok(todoList);

        }
        // to get all data  passs id of file in this  
        [HttpGet("fetch/{rlowlimit}/{file_id}")]
        public async Task<ActionResult<IEnumerable<Get_TodoItems>>> GetTodoItemall(long rlowlimit, long file_id)
        {

            var todoList = new List<Get_TodoItems>();



            var todoItems = await _context.TodoItems.ToListAsync();
            todoList.AddRange(todoItems.Select(item => new Get_TodoItems
            {

                Name = item.Name

            }));

            long low = rlowlimit;
            long high = 40;
            var query = $"SELECT * FROM datas where file_id = {file_id}  LIMIT {low},{high}";
            MySqlCommand queryCommand = new MySqlCommand(query, connection);


            try
            {
                await connection.OpenAsync();
                using (MySqlDataReader reader = queryCommand.ExecuteReader())
                {
                    while (reader.Read())
                    {


                        var name = reader["Name_1"] != DBNull.Value ? reader["Name_1"].ToString() : string.Empty;
                        var email = reader["email"] != DBNull.Value ? reader["email"].ToString() : string.Empty;
                        var country = reader["country"] != DBNull.Value ? reader["country"].ToString() : string.Empty;
                        var city = reader["city"] != DBNull.Value ? reader["city"].ToString() : string.Empty;
                        var state = reader["state"] != DBNull.Value ? reader["state"].ToString() : string.Empty;
                        var address_1 = reader["address_1"] != DBNull.Value ? reader["address_1"].ToString() : string.Empty;
                        var address_2 = reader["address_2"] != DBNull.Value ? reader["address_2"].ToString() : string.Empty;
                        var dob = reader["dob"] != DBNull.Value ? reader["dob"].ToString() : string.Empty;

                        // For numeric values, use default(long) or another suitable default value
                        var telephone = reader["telephone"] != DBNull.Value ? Convert.ToInt64(reader["telephone"]) : default(long);
                        var fy2019_20 = reader["fy2019_20"] != DBNull.Value ? Convert.ToInt64(reader["fy2019_20"]) : default(long);
                        var fy2020_21 = reader["fy2020_21"] != DBNull.Value ? Convert.ToInt64(reader["fy2020_21"]) : default(long);
                        var fy2021_22 = reader["fy2021_22"] != DBNull.Value ? Convert.ToInt64(reader["fy2021_22"]) : default(long);
                        var fy2022_23 = reader["fy2022_23"] != DBNull.Value ? Convert.ToInt64(reader["fy2022_23"]) : default(long);
                        var fy2023_24 = reader["fy2023_24"] != DBNull.Value ? Convert.ToInt64(reader["fy2023_24"]) : default(long);


                        todoList.Add(new Get_TodoItems { Name = name, Email = email, Country = country, State = state, City = city, Telephone = telephone, Address_1 = address_1, Address_2 = address_2, DOB = dob, FY2019_20 = fy2019_20, FY2020_21 = fy2020_21, FY2021_22 = fy2021_22, FY2022_23 = fy2022_23, FY2023_24 = fy2023_24 });
                        // Console.WriteLine($"ID: {reader["id"]}");

                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            finally
            {
                connection.Close();
            }

            return todoList;
        }

        // file get all

        [HttpGet("fetchfile")]
        public async Task<ActionResult<IEnumerable<FileItems>>> GetTodoItemall()
        {
            var todoList = new List<FileItems>();

            try
            {

                var todoItems = await _context.TodoItems.ToListAsync();
                todoList.AddRange(todoItems.Select(item => new FileItems
                {
                    F_Id = item.Id,
                    File_Name = item.Name

                }));

                // Fetch data from MySQL
                var query = "SELECT * FROM files";
                using (var command = new MySqlCommand(query, connection))
                {
                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var id = Convert.ToInt64(reader["id"]);
                            var file_name = reader["file_name"].ToString();
                            var loader = Convert.ToInt64(reader["loader"]);
                            var date_time = reader["date_time"].ToString();

                            todoList.Add(new FileItems
                            {
                                F_Id = id,
                                File_Name = file_name,
                                loader = loader,
                                Date_time = date_time

                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                // Ensure connection is closed

                await connection.CloseAsync();

            }

            return Ok(todoList);
        }




        // // PUT: api/TodoItems/5
        [HttpPatch("delete/{srowid}/{scolid}/{erowid}/{ecolid}/{fileid}")]
        public async Task<IActionResult> deletecell(int srowid, int scolid, int erowid, int ecolid, int fileid)
        {


            string connectionString = _connectionString;

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    for (int j = srowid; j <= erowid; j++)
                    {
                        for (int i = scolid; i <= ecolid; i++)
                        {
                            // Console.WriteLine(j);
                            string columnName = listrows[i - 1];

                            string updSql = $@"
                      
                       UPDATE datas SET {columnName}=Null WHERE  id = (
                            SELECT id
                            FROM (
                                SELECT id,
                                       ROW_NUMBER() OVER (PARTITION BY file_id ORDER BY id) AS rn
                                FROM datas
                                WHERE file_id = @fileid
                            ) AS Subquery
                            WHERE rn = @rowid
                        ) AND file_id = @fileid;";

                            using (MySqlCommand command = new MySqlCommand(updSql, connection))
                            {
                                command.Parameters.AddWithValue("@rowid", j);
                                command.Parameters.AddWithValue("@fileid", fileid);

                                try
                                {
                                    await command.ExecuteNonQueryAsync();
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Error updating row: {ex.Message}");
                                    return BadRequest();
                                    // Optionally handle specific row errors
                                }
                            }
                        }
                    }
                }
            }
            catch (MySqlException sqlEx)
            {
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
                return BadRequest();
                // Optionally handle connection errors
            }

            return Ok();
        }

        // copypaste
        [HttpPatch("paste/{srowid}/{scolid}/{erowid}/{ecolid}/{fileid}")]
        public async Task<IActionResult> copy_paste(int srowid, int scolid, int erowid, int ecolid, List<string> selected_arr, int fileid)
        {

            // Console.WriteLine( selected_arr[0]);
            // Console.WriteLine(xposofvalues[0]);
            Console.WriteLine(srowid);
            Console.WriteLine(scolid);
            Console.WriteLine(erowid);
            Console.WriteLine(ecolid);

            string connectionString = _connectionString;

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    for (int j = srowid; j <= erowid; j++)
                    {
                        for (int i = scolid; i <= ecolid; i++)
                        {
                            // Console.WriteLine(j);
                            string columnName = listrows[i - 1];
                            // Console.WriteLine(columnName);
                            string value = selected_arr[i];
                            Console.WriteLine(value);
                            string updSql = $@"
                      
                       UPDATE datas SET {columnName}=@value WHERE  id = (
                            SELECT id
                            FROM (
                                SELECT id,
                                       ROW_NUMBER() OVER (PARTITION BY file_id ORDER BY id) AS rn
                                FROM datas
                                WHERE file_id = @fileid
                            ) AS Subquery
                            WHERE rn = @rowid
                        ) AND file_id = @fileid;";

                            using (MySqlCommand command = new MySqlCommand(updSql, connection))
                            {
                                command.Parameters.AddWithValue("@rowid", j);
                                command.Parameters.AddWithValue("@fileid", fileid);
                                command.Parameters.AddWithValue("@value", value);
                                try
                                {
                                    await command.ExecuteNonQueryAsync();
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Error updating row: {ex.Message}");
                                    return BadRequest();
                                    // Optionally handle specific row errors
                                }
                            }
                        }
                    }
                }
            }
            catch (MySqlException sqlEx)
            {
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
                return BadRequest();
                // Optionally handle connection errors
            }

            return Ok();
        }

        // edit text 
        [HttpPatch("edit/{rowid}/{colid}/{fileid}")]
        public async Task<IActionResult> edittext(int rowid, int colid, string value, int fileid)
        {
            //  row is  | and col is --
            Console.WriteLine(fileid);


            try
            {
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();


                    string columnName = listrows[rowid - 1];
                    // string updSql = $"UPDATE datas SET  {columnName}= @value WHERE id = @colid";
                    string updSql = @$"UPDATE datas SET {columnName}=@value  WHERE id = (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY file_id ORDER BY id) AS rn
        FROM datas
        WHERE file_id = @fileid
    ) AS Subquery
    WHERE rn = @colid
) AND file_id = @fileid;";
                    try
                    {
                        using (MySqlCommand command = new MySqlCommand(updSql, connection))
                        {
                            command.Parameters.AddWithValue("@value", value);
                            command.Parameters.AddWithValue("@colid", colid);
                            command.Parameters.AddWithValue("@fileid", fileid);
                            await command.ExecuteNonQueryAsync();


                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error inserting batch: {ex.Message}");
                        return BadRequest();
                    }
                }
            }
            catch (MySqlException sqlEx)
            {
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
                return BadRequest();
            }
            finally
            {
                connection.Close();
            }
            return Ok();

        }

        // file upload api/TodoItems/file
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // int Size = recordcount;
            // Console.WriteLine(Size);
            int file_id = 0;
            var filename = Path.GetRandomFileName() + ".csv";

            // Console.WriteLine(filename);
            // insert in files table

            try
            {
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    string query = "INSERT INTO files (file_name, loader) VALUES (@file_name,@loader)";


                    try
                    {
                        using (MySqlCommand command = new MySqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@file_name", filename);
                            command.Parameters.AddWithValue("@loader", 0);
                            await command.ExecuteNonQueryAsync();
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error inserting batch: {ex.Message}");
                    }
                }
            }
            catch (MySqlException sqlEx)
            {
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
            }

            // GET ID from files
            var query1 = "SELECT id FROM files WHERE file_name='" + filename + "';";
            MySqlCommand queryCommand = new MySqlCommand(query1, connection);
            try
            {
                await connection.OpenAsync();
                using (MySqlDataReader reader = queryCommand.ExecuteReader())
                {
                    while (await reader.ReadAsync())
                    {
                        // Console.WriteLine($"ID: {reader["id"]}");
                        file_id = Convert.ToInt32(reader["id"]);


                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            finally
            {
                connection.Close();
            }

            // var filePath = Path.Combine("UploadedFiles", file.FileName);
            var filePath = Path.Combine("UploadedFiles", filename);
            // Ensure the directory exists
            var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
            if (!Directory.Exists(uploadsDirectory))
            {
                Directory.CreateDirectory(uploadsDirectory);
            }

            // Save the file locally
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Process the file and send data to RabbitMQ in chunks
            var todoItems = ReadTodoItemsFromCsv(filePath);
            // Console.WriteLine(recordcount);

            int chunkSize = 1;
            if (recordcount > 10)
            {
                chunkSize = (recordcount / 10);
            }
            else
            {
                chunkSize = 1;
            }
            int no_ofchunks = recordcount / chunkSize;
            // Console.WriteLine(no_ofchunks);
            // Console.WriteLine(chunkSize);
            var chunks = todoItems
                .Select((item, index) => new { Item = item, Index = index })
                .GroupBy(x => x.Index / chunkSize)
                .Select(g => g.Select(x => x.Item).ToList())
                .ToList();

            foreach (var chunk in chunks)
            {
                _rabbitMqService.SendChunk(chunk, filename, file_id, no_ofchunks);  // Send each chunk to RabbitMQ fileid send
            }
            // File.Delete(filePath);
            // Fil

            System.IO.File.Delete(filePath);
            return Ok("Data uploaded and sent to RabbitMQ in chunks");
        }

        private IEnumerable<TodoItem> ReadTodoItemsFromCsv(string filePath)
        {

            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, new CsvHelper.Configuration.CsvConfiguration(System.Globalization.CultureInfo.InvariantCulture));

            var records = csv.GetRecords<TodoItem>().ToList();
            // Console.WriteLine(records.Count);
            recordcount = records.Count;
            return records;
        }


        // post  new data

        [HttpPost("insert/{colid}/{fileid}")]
        public async Task<IActionResult> insertnewdata(int colid, int fileid, string value)
        {
            // Console.WriteLine(colid);
            // Console.WriteLine(fileid);
            // Console.WriteLine(value);
            string columnName = listrows[colid - 1];


            try
            {
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    // "INSERT INTO files (file_name, loader) VALUES (@file_name,@loader)";
                    string query = $"INSERT INTO datas ({columnName},file_id) VALUES (@value,@fileid);";


                    try
                    {
                        using (MySqlCommand command = new MySqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@value", value);
                            command.Parameters.AddWithValue("@fileid", fileid);
                            await command.ExecuteNonQueryAsync();
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error inserting batch: {ex.Message}");
                    }
                }
            }
            catch (MySqlException sqlEx)
            {
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
            }
            finally
            {
                connection.Close();
            }




            return Ok("Data inserted");
        }



        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            var deleted = 0;


            using (MySqlConnection conn = new MySqlConnection(_connectionString))
            {
                conn.Open();
                string delSql = "DELETE FROM datas WHERE id = @id";
                using (MySqlCommand command = new MySqlCommand(delSql, conn))
                {
                    // cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = txtRemoveUser.Text;
                    command.Parameters.AddWithValue("@id", id);
                    deleted = command.ExecuteNonQuery();
                    // Console.WriteLine(deleted);
                }
                if (deleted == 0)
                {
                    return NotFound();
                }


                return Ok();
            }
        }
        private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }


    }
}



