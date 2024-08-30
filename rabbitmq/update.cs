using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace updateinto
{


    public static class Myclass1
    {
        private static readonly string _connectionString = "Server=localhost;Database=sql_workbench;User=root;Password=root;";


        public static void updateloader(int percent, int file_id)
        {



            // update query 
            try
            {
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();

                    // Corrected SQL query with parameters    '" + file.FileName + "'
                    string updSql = "UPDATE files SET loader = loader + @percent WHERE id = @file_id;";
                    try
                    {
                        using (MySqlCommand command = new MySqlCommand(updSql, connection))
                        {
                            command.Parameters.AddWithValue("@percent", percent);
                            command.Parameters.AddWithValue("@file_Id", file_id);
                            int updated = command.ExecuteNonQuery();


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
                // connection.Close();
            }



        }



    }
}
