using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using updateinto;
namespace insertinto
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public long? Telephone { get; set; }
        public string? Address_1 { get; set; }
        public string? Address_2 { get; set; }
        public string? DOB { get; set; }
        public long FY2019_20 { get; set; }
        public long FY2020_21 { get; set; }
        public long FY2021_22 { get; set; }
        public long FY2022_23 { get; set; }
        public long FY2023_24 { get; set; }
        public bool IsComplete { get; set; }
        public string? file_name { get; set; }
        public int file_id { get; set; }
    }

    public static class Myclass
    {
        private static readonly string _connectionString = "Server=localhost;Database=sql_workbench;User=root;Password=root;";


        private static string EscapeSqlValue(string? value)
        {
            if (value == null)
                return "NULL";

            // Escape single quotes by doubling them
            value = value.Replace("'", "''");

            // Escape backslashes (optional, depending on MySQL mode)
            value = value.Replace("\\", "\\\\");

            // Return escaped string wrapped in single quotes
            return $"'{value}'";
        }
        public static async Task InsertTodoItemsBatchAsync(List<TodoItem> todoItems, string filename, int file_id, int percent)
        {

            // Console.WriteLine(file_id);
            if (todoItems == null || todoItems.Count == 0)
                return;


            // Copy the batch and clear the original list
            List<TodoItem> batchToInsert;
            lock (todoItems)
            {
                batchToInsert = new List<TodoItem>(todoItems);
                todoItems.Clear();
            }
            try
            {
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Create the initial part of the query
                    var query = "INSERT INTO datas (Name_1, email, country, city, state, telephone, address_1, address_2, dob, fy2019_20, fy2020_21, fy2021_22, fy2022_23, fy2023_24, msg,file_name, file_id) VALUES ";

                    // Build the values part
                    var valuesList = new List<string>();
                    foreach (var item in batchToInsert)
                    {
                        var values = $"({EscapeSqlValue(item.Name)}, {EscapeSqlValue(item.Email)}, {EscapeSqlValue(item.Country)}, {EscapeSqlValue(item.City)}, {EscapeSqlValue(item.State)}, {item.Telephone}, {EscapeSqlValue(item.Address_1)}, {EscapeSqlValue(item.Address_2)}, {EscapeSqlValue(item.DOB)}, {item.FY2019_20}, {item.FY2020_21}, {item.FY2021_22}, {item.FY2022_23}, {item.FY2023_24}, {(item.IsComplete ? 1 : 0)}, {EscapeSqlValue(filename)},{file_id})";
                        valuesList.Add(values);

                    }

                    // Join all values with commas and add to the query
                    query += string.Join(", ", valuesList);
                    try
                    {
                        using (MySqlCommand command = new MySqlCommand(query, connection))
                        {
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
            } finally
            {
                // connection.Close();
            }



            // update 
            Myclass1.updateloader(percent, file_id);

        }



    }
}
