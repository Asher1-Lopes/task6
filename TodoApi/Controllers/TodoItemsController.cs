
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
        private static readonly string _connectionString = "Server=localhost;Database=sql_workbench;User=root;Password=root;";
        MySqlConnection connection = new MySqlConnection(_connectionString);

        public TodoItemsController(TodoContext context, RabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
            //    var todoItems = await _context.TodoItems.ToListAsync();
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;


        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItemall()
        {
            var todoItems = await _context.TodoItems.ToListAsync();

            // Create a new list and add data
            List<TodoItem> todoList = new List<TodoItem>(todoItems);

            var query = "SELECT * FROM datas";
            MySqlCommand queryCommand = new MySqlCommand(query, connection);


            try
            {
                connection.Open();
                using (MySqlDataReader reader = queryCommand.ExecuteReader())
                {
                    while (reader.Read())
                    {

                        var id = Convert.ToInt64(reader["id"]);
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
                        var msg = Convert.ToInt64(reader["msg"]);

                        todoList.Add(new TodoItem { Id = id, Name = name, Email = email, Country = country, State = state, City = city, Telephone = telephone, Address_1 = address_1, Address_2 = address_2, DOB = dob, FY2019_20 = fy2019_20, FY2020_21 = fy2020_21, FY2021_22 = fy2021_22, FY2022_23 = fy2022_23, FY2023_24 = fy2023_24 });
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
        // PUT: api/TodoItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(todoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // file upload 
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // int Size = recordcount;
            // Console.WriteLine(Size);
            int file_id = 0;


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
                            command.Parameters.AddWithValue("@file_name", file.FileName);
                           command.Parameters.AddWithValue("@loader",0);
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


            var query1 = "SELECT id FROM files WHERE file_name='" + file.FileName + "';";

            MySqlCommand queryCommand = new MySqlCommand(query1, connection);
            // Console.WriteLine(query1 );

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

            // have to pass this id 
            // Console.WriteLine(file_id);

            var filePath = Path.Combine("UploadedFiles", file.FileName);

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
            int no_ofchunks = recordcount/chunkSize;
            // Console.WriteLine(no_ofchunks);
            // Console.WriteLine(chunkSize);
            var chunks = todoItems
                .Select((item, index) => new { Item = item, Index = index })
                .GroupBy(x => x.Index / chunkSize)
                .Select(g => g.Select(x => x.Item).ToList())
                .ToList();

            foreach (var chunk in chunks)
            {
                _rabbitMqService.SendChunk(chunk, file.FileName, file_id ,no_ofchunks);  // Send each chunk to RabbitMQ fileid send
            }

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




        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }


    }
}



