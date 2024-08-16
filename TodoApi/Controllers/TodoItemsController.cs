
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        private readonly RabbitMqService _rabbitMqService;


        public TodoItemsController(TodoContext context, RabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
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
            var todoItem = await _context.TodoItems.ToListAsync();

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
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
            int chunkSize = 10000; // Define your chunk size
            var chunks = todoItems
                .Select((item, index) => new { Item = item, Index = index })
                .GroupBy(x => x.Index / chunkSize)
                .Select(g => g.Select(x => x.Item).ToList())
                .ToList();

            foreach (var chunk in chunks)
            {
                _rabbitMqService.SendChunk(chunk);  // Send each chunk to RabbitMQ
            }

            return Ok("Data uploaded and sent to RabbitMQ in chunks");
        }

        private IEnumerable<TodoItem> ReadTodoItemsFromCsv(string filePath)
        {
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, new CsvHelper.Configuration.CsvConfiguration(System.Globalization.CultureInfo.InvariantCulture));
            return csv.GetRecords<TodoItem>().ToList();
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



