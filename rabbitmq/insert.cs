using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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
    }

    public static class Myclass
    {
        private static readonly string _connectionString = "Server=localhost;Database=sql_workbench;User=root;Password=root;";
        // private static MySqlConnection connection;
     
        // public static void init()
        // {
        //     using (var connection = new MySqlConnection(_connectionString))
        //     {
        //         connection.OpenAsync();
        //     }

        // }

        public static async Task InsertTodoItemsBatchAsync(List<TodoItem> todoItems)
        {
            if (todoItems == null || todoItems.Count == 0)
                return;


            // Copy the batch and clear the original list
            List<TodoItem> batchToInsert;
            lock (todoItems)
            {
                batchToInsert = new List<TodoItem>(todoItems);
                todoItems.Clear();
            }

            var query = @"
                INSERT INTO datas (Name_1, email, country, city, state, telephone, address_1, address_2, dob, fy2019_20, fy2020_21, fy2021_22, fy2022_23, fy2023_24, msg)
                VALUES (@Name, @Email, @Country, @City, @State, @Telephone, @Address_1, @Address_2, @DOB, @FY2019_20, @FY2020_21, @FY2021_22, @FY2022_23, @FY2023_24, @IsComplete)";

            try
            {
                using (var connection = new MySqlConnection(_connectionString))

                {
                    await connection.OpenAsync();

                    using (var transaction = await connection.BeginTransactionAsync())
                    {
                        try
                        {   
                          
                            foreach (var item in batchToInsert)
                            {   
                             
                                using (var command = new MySqlCommand(query, connection, transaction))

                                {
                                    command.Parameters.AddWithValue("@Name", item.Name);
                                    command.Parameters.AddWithValue("@Email", item.Email);
                                    command.Parameters.AddWithValue("@Country", item.Country);
                                    command.Parameters.AddWithValue("@State", item.State);
                                    command.Parameters.AddWithValue("@City", item.City);
                                    command.Parameters.AddWithValue("@Telephone", item.Telephone);
                                    command.Parameters.AddWithValue("@Address_1", item.Address_1);
                                    command.Parameters.AddWithValue("@Address_2", item.Address_2);
                                    command.Parameters.AddWithValue("@DOB", item.DOB);
                                    command.Parameters.AddWithValue("@FY2019_20", item.FY2019_20);
                                    command.Parameters.AddWithValue("@FY2020_21", item.FY2020_21);
                                    command.Parameters.AddWithValue("@FY2021_22", item.FY2021_22);
                                    command.Parameters.AddWithValue("@FY2022_23", item.FY2022_23);
                                    command.Parameters.AddWithValue("@FY2023_24", item.FY2023_24);
                                    command.Parameters.AddWithValue("@IsComplete", item.IsComplete);

                                    await command.ExecuteNonQueryAsync();
                                }
                            }

                            await transaction.CommitAsync();
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error inserting batch: {ex.Message}");
                            await transaction.RollbackAsync();
                        }
                    }
                }
            }
            catch (MySqlException sqlEx)
            {
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
            }
            finally
            {
                // connection?.Close();
                // connection?.Dispose();
                // // connection = null; 
            }
        }



    }
}
